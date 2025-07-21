import { FastifyInstance } from "fastify";
import {
  createTicketHandler,
  deleteTicketHandler,
  getTicketQrHandler,
  validateTicketHandler,
  listUserTicketsHandler,
  getUserTicketByIdHandler,
} from "../controllers/ticketController";
import { authenticate } from "../middleware/auth";

export async function ticketRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/tickets",
    {
      preHandler: [authenticate],
    },
    listUserTicketsHandler
  );

  fastify.get(
    "/tickets/:id",
    {
      preHandler: [authenticate],
    },
    getUserTicketByIdHandler
  );

  fastify.get(
    "/tickets/:id/qr",
    {
      preHandler: [authenticate],
    },
    getTicketQrHandler
  );

  fastify.post(
    "/tickets",
    {
      preHandler: [authenticate],
    },
    createTicketHandler
  );

  fastify.post(
    "/tickets/validate",
    {
      preHandler: [authenticate],
    },
    validateTicketHandler
  );

  fastify.delete(
    "/tickets/:id",
    {
      preHandler: [authenticate],
    },
    deleteTicketHandler
  );
}
