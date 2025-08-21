import { FastifyInstance } from "fastify";
import {
  registerHandler,
  loginHandler,
  meHandler,
  logoutHandler,
} from "../controllers/authController";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", registerHandler);

  fastify.post("/login", loginHandler);

  fastify.get("/me", meHandler);

  fastify.post("/logout", logoutHandler);
}
