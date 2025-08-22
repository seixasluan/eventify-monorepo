import { FastifyInstance } from "fastify";
import {
  registerHandler,
  loginHandler,
  meHandler,
  logoutHandler,
  updateProfileHandler,
  UpdateProfileBody,
} from "../controllers/authController";
import { authenticate } from "../middleware/auth";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", registerHandler);

  fastify.post("/login", loginHandler);

  fastify.get("/me", meHandler);

  fastify.post("/logout", logoutHandler);

  fastify.put<{ Body: UpdateProfileBody }>(
    "/profile",
    { preHandler: [authenticate] },
    updateProfileHandler
  );
}
