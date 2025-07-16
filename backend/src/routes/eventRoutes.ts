import { FastifyInstance } from "fastify";
import {
  createEventHandler,
  getEventHandler,
  updateEventHandler,
  deleteEventHandler,
  listPublicEventsHandler,
  listOrganizerEventsHandler,
  getEventStatsHandler,
  uploadEventImageHandler,
  deleteEventImageHandler,
} from "../controllers/eventController";
import { authenticate } from "../middleware/auth";
import { authorizeOrganizer } from "../middleware/authorizeOrganizer";

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/events",
    {
      schema: {
        tags: ["Events"],
        summary: "List all public events with filters and pagination",
        querystring: {
          type: "object",
          properties: {
            search: { type: "string" },
            minPrice: { type: "number" },
            maxPrice: { type: "number" },
            dateFrom: { type: "string", format: "date" },
            dateTo: { type: "string", format: "date" },
            page: { type: "integer" },
            limit: { type: "integer" },
          },
        },
        response: {
          200: {
            type: "array",
            items: { $ref: "Event#" },
          },
        },
      },
    },
    listPublicEventsHandler
  );

  fastify.get(
    "/events/mine",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "List events created by the authenticated organizer",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "array",
            items: { $ref: "Event#" },
          },
        },
      },
    },
    listOrganizerEventsHandler
  );

  fastify.get(
    "/events/:id",
    {
      schema: {
        tags: ["Events"],
        summary: "Get details of a specific event by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        response: {
          200: { $ref: "Event#" },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    getEventHandler
  );

  fastify.get(
    "/events/:id/stats",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Get sales statistics for an event",
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
              ticketsSold: { type: "number" },
              totalRevenue: { type: "number" },
            },
          },
        },
      },
    },
    getEventStatsHandler
  );

  fastify.post(
    "/events",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Create a new event",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["title", "description", "date", "price", "totalTickets"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
            price: { type: "number" },
            imageUrl: { type: "string" },
            totalTickets: { type: "integer" },
          },
        },
        response: {
          201: { $ref: "Event#" },
        },
      },
    },
    createEventHandler
  );

  fastify.post(
    "/events/:id/image",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Upload an image for the event",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            file: { type: "string", format: "binary" },
          },
          required: ["file"],
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
    uploadEventImageHandler
  );

  fastify.put(
    "/events/:id",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Update an existing event",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date-time" },
            price: { type: "number" },
            imageUrl: { type: "string" },
            totalTickets: { type: "integer" },
          },
        },
        response: {
          200: { $ref: "Event#" },
        },
      },
    },
    updateEventHandler
  );

  fastify.delete(
    "/events/:id",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Delete an event",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer" },
          },
          required: ["id"],
        },
        response: {
          204: {
            type: "null",
            description: "Event deleted successfully",
          },
        },
      },
    },
    deleteEventHandler
  );

  fastify.delete(
    "/events/:id/image",
    {
      preHandler: [authenticate, authorizeOrganizer],
      schema: {
        tags: ["Events"],
        summary: "Delete the event's image",
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
    deleteEventImageHandler
  );
}
