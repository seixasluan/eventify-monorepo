import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";
import { errorResponse, successResponse } from "../utils/response";
import dotenv from "dotenv";
dotenv.config();

export async function registerHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, email, password, role } = request.body as any;

  if (!name || !email || !password || !role) {
    return reply
      .status(400)
      .send(errorResponse("All fields must be filled in!", "UNFILLED_FIELDS"));
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return reply.status(400).send(errorResponse("Email is already in use!"));
  }

  const BCRYPT_SALT = process.env.BCRYPT_SALT;

  const hashedPassword = await bcrypt.hash(password, Number(BCRYPT_SALT));

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  const token = generateToken({ userId: user.id, role: user.role });
  return reply
    .setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    })
    .send({ message: "User registred soccessfully" });
}

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = request.body as any;

  if (!email || !password) {
    return reply
      .status(400)
      .send(errorResponse("All fields must be filled in!", "UNFILLED_FIELDS"));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return reply
      .status(401)
      .send(errorResponse("Invalid credentials!", "INVALID_CREDENTIALS"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return reply
      .status(401)
      .send(errorResponse("Invalid credentials!", "INVELID_CREDENTIALS"));
  }

  const token = generateToken({ userId: user.id, role: user.role });
  return reply
    .setCookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // day
    })
    .send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
}

export async function meHandler(request: FastifyRequest, reply: FastifyReply) {
  const token = request.cookies.token;
  if (!token) return reply.status(401).send({ user: null });

  try {
    const payload = verifyToken(token) as any;
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return reply.status(404).send({ user: null });

    return reply.send({ user });
  } catch (err) {
    return reply.status(401).send({ user: null });
  }
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  return reply.clearCookie("token", { path: "/" }).send({ success: true });
}
