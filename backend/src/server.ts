import Fastify from "fastify";
import { authRoutes } from "./routes/authRoutes";
import { authenticate } from "./middleware/auth";
import { eventRoutes } from "./routes/eventRoutes";
import { ticketRoutes } from "./routes/ticketRoutes";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

async function startServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Eventify API",
        description: "API for managing events and ticket sales",
        version: "1.0.0",
      },
      tags: [
        { name: "Events", description: "Operations about events" },
        {
          name: "Tickets",
          description: "Operations about ticket sales and validation",
        },
        { name: "Auth", description: "User login and registration" },
      ],
      servers: [{ url: "http://localhost:3000" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/docs",
    staticCSP: true,
  });

  fastify.addSchema({
    $id: "User",
    type: "object",
    required: ["id", "name", "email", "password"],
    properties: {
      id: { type: "number", example: 1 },
      name: { type: "string", example: "Jeremy Scottland" },
      email: { type: "string", example: "jeremy@example.com" },
      role: { type: "string", enum: ["BUYER", "ORGANIZER"], example: "BUYER" },
    },
  });

  fastify.addSchema({
    $id: "Event",
    type: "object",
    properties: {
      id: { type: "number", example: 42 },
      title: { type: "string", example: "Country Club" },
      description: {
        type: "string",
        example: "Country event with tipical musics",
      },
      date: {
        type: "string",
        format: "date-time",
        example: "2025-08-01T20:00:00Z",
      },
      price: { type: "number", example: 150 },
      imageUrl: {
        type: "string",
        example: "http://localhost:3000/uploads/country-club.jpg",
      },
      totalTickets: { type: "number", example: 200 },
      ticketsSold: { type: "number", example: 50 },
      organizerId: { type: "number", example: 1 },
      organizer: { $ref: "User#" },
    },
  });

  fastify.addSchema({
    $id: "Ticket",
    type: "object",
    properties: {
      id: { type: "number", example: 101 },
      eventId: { type: "number", example: 42 },
      userId: { type: "number", example: 1 },
      purchaseDate: {
        type: "string",
        format: "date-time",
        example: "2025-07-15T18:00:00Z",
      },
      price: { type: "number", example: 150 },
      event: { $ref: "Event#" },
    },
  });

  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(error.statusCode ?? 500).send({
      success: false,
      error: {
        message: error.message ?? "Internal Server Error",
      },
    });
  });

  // Register plugins
  await fastify.register(multipart);

  // Serve static files for uploaded images
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, "..", "uploads"),
    prefix: "/uploads/",
  });

  // Register routes
  fastify.register(authRoutes);
  fastify.register(eventRoutes);
  fastify.register(ticketRoutes);

  // Health check
  fastify.get("/", async () => {
    return { message: "API is running!" };
  });

  // Protected test route
  fastify.get(
    "/protected",
    { preHandler: [authenticate] },
    async (request, reply) => {
      return {
        message: "Protected route accessed!",
        user: (request as any).user,
      };
    }
  );

  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Server listening on port 3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
