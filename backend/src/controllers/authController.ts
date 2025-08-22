import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";
import { errorResponse, successResponse } from "../utils/response";
import dotenv from "dotenv";
dotenv.config();

export interface UpdateProfileBody {
  name?: string;
  email?: string;
  password?: string;
}

const BCRYPT_SALT = process.env.BCRYPT_SALT;

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

  const hashedPassword = await bcrypt.hash(password, Number(BCRYPT_SALT));

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  const token = generateToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
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

  const token = generateToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

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

export async function updateProfileHandler(
  request: FastifyRequest<{ Body: UpdateProfileBody }>,
  reply: FastifyReply
) {
  try {
    const userId = (request as any).user?.userId;

    if (!userId) {
      return reply
        .status(401)
        .send(errorResponse("User nof found.", "UNAUTHORIZED"));
    }

    const { name, email, password } = request.body;

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_SALT)
      );
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { id: true, name: true, email: true },
    });

    // generate new token with updated data
    const newToken = generateToken({
      userId: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });

    return reply
      .setCookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1d
      })
      .send({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return reply
      .status(500)
      .send(errorResponse("Failed to update profile", "PROFILE_UPDATE_ERROR"));
  }
}
