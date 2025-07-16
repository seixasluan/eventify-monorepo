import { FastifyInstance } from "fastify";
import { registerHandler, loginHandler } from "../controllers/authController";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        summary: "Register a new user",
        body: {
          type: "object",
          required: ["name", "email", "password", "role"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            role: { type: "string", enum: ["BUYER", "ORGANIZER"] },
          },
        },
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
              role: { type: "string" },
            },
          },
          400: {
            description: "Bad request",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    registerHandler
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        summary: "Log in and retrieve a JWT token",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            description: "Successful login",
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          401: {
            description: "Invalid credentials",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    loginHandler
  );
}
