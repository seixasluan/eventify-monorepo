import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { validateTicketInput } from "../validators/ticketValidator";
import { v4 as uuidv4 } from "uuid";
import { errorResponse, successResponse } from "../utils/response";

export async function createTicketHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = request.body as any;
  const user = (request as any).user;

  // only buyers
  if (user.role !== "BUYER") {
    return reply
      .status(403)
      .send(errorResponse("Only buyers can buy tickets.", "ACCESS_DENIED"));
  }

  const { valid, errors } = validateTicketInput(data);
  if (!valid) {
    return reply.status(400).send({ errors });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(data.eventId) },
    });

    if (!event) {
      return reply
        .status(404)
        .send(errorResponse("Event not found.", "NOT_FOUND"));
    }

    const quantity = Number(data.quantity);

    if (isNaN(quantity) || quantity <= 0) {
      return reply
        .status(400)
        .send(errorResponse("Invalid ticket quantity.", "INVALID_CREDENTIALS"));
    }

    // calculate how much tickets are available
    const available = event.totalTickets - event.ticketsSold;

    if (quantity > available) {
      return reply
        .status(400)
        .send(
          errorResponse(
            `Not enough tickets available. Only ${available} left.`,
            "NOT_ENOUGH_TICKETS"
          )
        );
    }

    // create a tickets array
    const ticketsData = Array.from({ length: quantity }, () => ({
      userId: user.userId,
      eventId: event.id,
      price: event.price,
      qrCode: uuidv4(),
    }));

    await prisma.ticket.createMany({
      data: ticketsData,
    });

    // update sales counter
    await prisma.event.update({
      where: { id: event.id },
      data: {
        ticketsSold: {
          increment: quantity,
        },
      },
    });

    return reply
      .status(201)
      .send(successResponse(`${quantity} ticket(s) successfully purchased.`));
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send(errorResponse("Error to buy ticket.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function getTicketQrHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { event: true },
    });

    if (!ticket) {
      return reply
        .status(404)
        .send(errorResponse("Ticket not found.", "NOT_FOUND"));
    }

    if (ticket.userId !== user.userId) {
      return reply
        .status(403)
        .send(errorResponse("Access denied.", "ACCESS_DENIED"));
    }

    return reply.send(
      successResponse({
        ticketId: ticket.id,
        eventTitle: ticket.event.title,
        qrCode: ticket.qrCode,
        used: ticket.used,
      })
    );
  } catch (erro) {
    console.log(erro);
    return reply
      .status(500)
      .send(
        errorResponse("Error retrieving QR code.", "INTERNAL_SERVER_ERROR")
      );
  }
}

export async function validateTicketHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = request.body as { qrCode: string };

  if (!data.qrCode || typeof data.qrCode !== "string") {
    return reply.status(400).send(errorResponse("QR code is required.", ""));
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { qrCode: data.qrCode },
      include: { event: true, user: true },
    });

    if (!ticket) {
      return reply
        .status(404)
        .send(errorResponse("Invalid QR code.", "INVALID_CREDENTIALS"));
    }

    if (ticket.used) {
      return reply
        .status(400)
        .send(errorResponse("Ticket already used.", "USED_TICKET"));
    }

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { used: true },
    });

    return reply.send(
      successResponse({
        message: "Ticket successfully validated!",
        ticketId: ticket.id,
        eventTitle: ticket.event.title,
        buyerName: ticket.user.name,
      })
    );
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(errorResponse("Error validating ticket.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function listUserTicketsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  if (user.role !== "BUYER") {
    return reply
      .status(403)
      .send(
        errorResponse("Only buyers can view their tickets.", "ACCESS_DENIED")
      );
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            imageUrl: true,
            price: true,
          },
        },
      },
      orderBy: {
        purchaseDate: "desc",
      },
    });

    return reply.send(successResponse(tickets));
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(errorResponse("Error to find tickets.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function getUserTicketByIdHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
      include: { event: true },
    });

    if (!ticket) {
      return reply
        .status(404)
        .send(errorResponse("Ticket not found.", "NOT_FOUND"));
    }

    if (ticket.userId !== user.userId) {
      return reply
        .status(403)
        .send(errorResponse("Access denied.", "ACCESS_DENIED"));
    }

    return reply.send(successResponse(ticket));
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(errorResponse("Error to find ticket.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function deleteTicketHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  try {
    // verify if ticket exist
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(id) },
    });

    if (!ticket) {
      return reply
        .status(404)
        .send(errorResponse("Ticket not found.", "NOT_FOUND"));
    }

    // check if the ticket belongs to the user
    if (ticket.userId !== user.userId) {
      return reply
        .status(403)
        .send(errorResponse("Access denied.", "ACCESS_DENIED"));
    }

    // delete
    await prisma.ticket.delete({
      where: { id: Number(id) },
    });

    await prisma.event.update({
      where: { id: ticket.eventId },
      data: {
        ticketsSold: {
          decrement: 1,
        },
      },
    });

    return reply.send(successResponse("Ticket successfully canceled."));
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(errorResponse("Error canceling ticket.", "INTERNAL_SERVER_ERROR"));
  }
}
