import Fastify from "fastify";
import { authRoutes } from "./routes/authRoutes";
import { authenticate } from "./middleware/auth";
import { eventRoutes } from "./routes/eventRoutes";
import { ticketRoutes } from "./routes/ticketRoutes";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path, { format } from "path";
// import swagger from "@fastify/swagger";
// import swaggerUI from "@fastify/swagger-ui";
import fastifyCookie from "@fastify/cookie";
import dotenv from "dotenv";
import fastifyCors from "@fastify/cors";

dotenv.config();

async function startServer() {
  const PORT = process.env.PORT;

  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    },
  });

  await fastify.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
    await fastify.listen({ port: Number(PORT), host: "0.0.0.0" }); // change for the next
    fastify.log.info(`Server listening on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
