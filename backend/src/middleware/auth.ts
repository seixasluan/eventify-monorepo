import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = request.cookies.token;

    if (!token) {
      return reply
        .status(401)
        .send(errorResponse("Token Not Found!", "NOT_FOUND"));
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    (request as any).user = decoded;
  } catch (error) {
    return reply
      .status(401)
      .send(errorResponse("Expired or invalid token!", "INVALID_CREDENTIALS"));
  }
}
