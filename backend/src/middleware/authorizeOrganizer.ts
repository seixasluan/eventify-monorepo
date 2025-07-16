import { FastifyRequest, FastifyReply } from "fastify";
import { errorResponse } from "../utils/response";

export async function authorizeOrganizer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const user = (request as any).user;

  if (!user || user.role !== "ORGANIZER") {
    return reply
      .status(403)
      .send(
        errorResponse("Access allowed only for organizers.", "ACCESS_DENIED")
      );
  }
}
