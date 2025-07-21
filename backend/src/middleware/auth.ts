import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply
        .status(401)
        .send(errorResponse("Token not found!", "NOT_FOUND"));
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    const decoded = jwt.verify(token, String(JWT_SECRET));
    (request as any).user = decoded;
  } catch (error) {
    return reply
      .status(401)
      .send(errorResponse("Expired or invalid token!", "INVALID_CREDENTIALS"));
  }
}
