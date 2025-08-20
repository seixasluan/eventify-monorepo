import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import { validateEventInput } from "../validators/eventValidator";
import path from "path";
import fs from "fs";
import { errorResponse, successResponse } from "../utils/response";
import { generateGoogleMapsLink } from "../utils/getLocationLink";

export async function createEventHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const data = request.body as any;
  const user = (request as any).user;

  const { valid, errors, parsedTotalTickets, parsedDate } =
    validateEventInput(data);
  if (!valid || !parsedTotalTickets || !parsedDate) {
    return reply.status(400).send({ errors });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: parsedDate,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        location: data.location,
        totalTickets: parsedTotalTickets,
        organizerId: user.userId,
      },
    });

    return reply.status(201).send(successResponse(event));
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(errorResponse("Error creating event.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function getEventHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!event) {
      return reply
        .status(404)
        .send(errorResponse("Event not found.", "NOT_FOUND"));
    }

    const googleMapsUrl = generateGoogleMapsLink(event.location);

    const data = { ...event, mapsUrl: googleMapsUrl };

    return reply.send(successResponse(data));
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send(errorResponse("Error fetching event.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function updateEventHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  const data = request.body as any;

  const user = (request as any).user;

  const event = await prisma.event.findUnique({ where: { id: Number(id) } });

  if (!event || event.organizerId !== user.userId) {
    return reply
      .status(403)
      .send(
        errorResponse(
          "You don't have permission to edit this event.",
          "ACCESS_DENIED"
        )
      );
  }

  const { valid, errors } = validateEventInput(data);
  if (!valid) {
    return reply.status(400).send({ errors });
  }

  try {
    const updated = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
      },
    });

    return reply.send(successResponse(updated));
  } catch (error) {
    return reply
      .status(500)
      .send(errorResponse("Error updating event.", "INTERNAL_SEVER_ERROR"));
  }
}

export async function deleteEventHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as any;
  const user = (request as any).user;

  const event = await prisma.event.findUnique({ where: { id: Number(id) } });

  if (!event || event.organizerId !== user.userId) {
    return reply
      .status(403)
      .send(
        errorResponse(
          "You don't have permission to delete this event.",
          "ACCESS_DENIED"
        )
      );
  }

  await prisma.event.delete({ where: { id: Number(id) } });

  return reply.status(204).send(successResponse("Event deleted."));
}

export async function listPublicEventsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const {
    search,
    minPrice,
    maxPrice,
    dateFrom,
    dateTo,
    page = "1",
    limit = "10",
  } = request.query as {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: string;
    dateTo?: string;
    page: string;
    limit: string;
  };

  const pageNumber = Math.max(parseInt(page), 1);
  const pageSize = Math.max(parseInt(limit), 1);

  const skip = (pageNumber - 1) * pageSize;

  try {
    const filters: any = {};

    if (search) {
      filters.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice) {
      filters.price = { ...filters.price, gte: parseFloat(minPrice) };
    }

    if (maxPrice) {
      filters.price = { ...filters.price, lte: parseFloat(maxPrice) };
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (!isNaN(fromDate.getTime())) {
        filters.date = { ...filters.date, gte: fromDate };
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      if (!isNaN(toDate.getTime())) {
        filters.date = { ...filters.date, lte: toDate };
      }
    }

    const total = await prisma.event.count({ where: filters });
    const events = await prisma.event.findMany({
      skip,
      take: pageSize,
      where: filters,
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return reply.send(
      successResponse({
        events,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          pages: Math.ceil(total / pageSize),
        },
      })
    );
  } catch (error) {
    console.log(error);
    return reply
      .status(404)
      .send(errorResponse("Error to list events.", "INTERNAL_SERVER_ERROR"));
  }
}

export async function listOrganizerEventsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  if (user.role !== "ORGANIZER") {
    return reply
      .status(403)
      .send(
        errorResponse("Only organizers can view their events.", "ACCESS_DENIED")
      );
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        organizerId: user.userId,
      },
      orderBy: {
        date: "asc",
      },
    });

    return reply.send(successResponse(events));
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(
        errorResponse(
          "Error fetching organizer events.",
          "INTERNAL_SERVER_ERROR"
        )
      );
  }
}

export async function getEventStatsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;
  const { id } = request.params as { id: string };

  if (user.role !== "ORGANIZER") {
    return reply
      .status(403)
      .send(errorResponse("Only organizers can view stats.", "ACCESS_DENIED"));
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: { tickets: true },
        },
      },
    });

    if (!event) {
      return reply
        .status(404)
        .send(errorResponse("Event not found. ", "NOT_FOUND"));
    }

    if (event.organizerId !== user.userId) {
      return reply
        .status(403)
        .send(errorResponse("You don't own this event.", "ACCESS_DENIED"));
    }

    return reply.send(
      successResponse({
        id: event.id,
        title: event.title,
        totalTickets: event.totalTickets,
        ticketsSold: event.ticketsSold,
        remainingTickets: event.totalTickets - event._count.tickets,
        earnings: event.ticketsSold * event.price,
      })
    );
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send(
        errorResponse("Error fetching event stats.", "INTERNAL_SERVER_ERROR")
      );
  }
}

export async function uploadEventImageHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const user = (request as any).user;

  // check owner
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
  });

  if (!event || event.organizerId !== user.userId) {
    return reply
      .status(403)
      .send(
        errorResponse(
          "You don't have permission to modify this event.",
          "ACCESS_DENIED"
        )
      );
  }

  // get uploaded file
  const file = await (request as any).file();

  if (!file) {
    return reply
      .status(400)
      .send(errorResponse("No file uploaded.", "UNFILLED_FIELDS"));
  }

  // save file to disk
  const uploadsDir = path.join(__dirname, "..", "..", "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const filename = `event-${id}-${Date.now()}-${file.filename}`;
  const filepath = path.join(uploadsDir, filename);

  await new Promise<void>((resolve, reject) => {
    const stream = fs.createWriteStream(filepath);
    file.file.pipe(stream);
    stream.on("finish", () => resolve());
    stream.on("error", (err) => reject(err));
  });

  const imageUrl = `/uploads/${filename}`;

  await prisma.event.update({
    where: { id: Number(id) },
    data: { imageUrl },
  });

  return reply.send(
    successResponse(`Image uploaded successfully. ${imageUrl}`)
  );
}

export async function deleteEventImageHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = request.params as { id: string };
  const user = (request as any).user;

  try {
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    });

    if (!event || event.organizerId !== user.userId) {
      return reply
        .status(403)
        .send(
          errorResponse(
            "You don't have permission to modify this event.",
            "ACCESS_DENIED"
          )
        );
    }

    if (!event.imageUrl) {
      return reply
        .status(400)
        .send(errorResponse("This event does not have an image.", "NOT_FOUND"));
    }

    // Resolve o caminho absoluto do arquivo
    const uploadsDir = path.join(__dirname, "..", "..");
    const absolutePath = path.join(uploadsDir, event.imageUrl);

    // Tenta remover o arquivo do disco
    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
        // Opcional: pode decidir continuar mesmo se falhar
      }
    });

    // Limpa a imageUrl no banco
    await prisma.event.update({
      where: { id: Number(id) },
      data: {
        imageUrl: null,
      },
    });

    return reply.send(successResponse("Event image successfully removed."));
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send(
        errorResponse("Error removing event image.", "INTERNAL_SERVER_ERROR")
      );
  }
}
