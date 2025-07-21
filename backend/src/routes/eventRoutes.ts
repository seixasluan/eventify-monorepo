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
  fastify.get("/events", listPublicEventsHandler);

  fastify.get(
    "/events/mine",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    listOrganizerEventsHandler
  );

  fastify.get("/events/:id", getEventHandler);

  fastify.get(
    "/events/:id/stats",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    getEventStatsHandler
  );

  fastify.post(
    "/events",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    createEventHandler
  );

  fastify.post(
    "/events/:id/image",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    uploadEventImageHandler
  );

  fastify.put(
    "/events/:id",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    updateEventHandler
  );

  fastify.delete(
    "/events/:id",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    deleteEventHandler
  );

  fastify.delete(
    "/events/:id/image",
    {
      preHandler: [authenticate, authorizeOrganizer],
    },
    deleteEventImageHandler
  );
}
