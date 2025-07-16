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
      schema: {
        tags: ["Tickets"],
        summary: "List all tickets purchased by the authenticated user",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "array",
            items: { $ref: "Ticket#" },
          },
        },
      },
    },
    listUserTicketsHandler
  );

  fastify.get(
    "/tickets/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Tickets"],
        summary: "Get details of a specific ticket by ID",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        response: {
          200: { $ref: "Ticket#" },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    getUserTicketByIdHandler
  );

  fastify.get(
    "/tickets/:id/qr",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Tickets"],
        summary: "Get QR code data for a ticket",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              qrCodeData: { type: "string" },
            },
          },
        },
      },
    },
    getTicketQrHandler
  );

  fastify.post(
    "/tickets",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Tickets"],
        summary: "Purchase one or more tickets for an event",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["eventId", "quantity"],
          properties: {
            eventId: { type: "integer" },
            quantity: { type: "integer" },
          },
        },
        response: {
          201: {
            type: "array",
            items: { $ref: "Ticket#" },
          },
        },
      },
    },
    createTicketHandler
  );

  fastify.post(
    "/tickets/validate",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Tickets"],
        summary: "Validate a ticket using its QR code or ID",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["ticketId"],
          properties: {
            ticketId: { type: "integer" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    validateTicketHandler
  );

  fastify.delete(
    "/tickets/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Tickets"],
        summary: "Cancel (delete) a ticket by ID",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    deleteTicketHandler
  );
}
