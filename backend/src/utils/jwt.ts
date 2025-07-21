import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(payload: object): string {
  return jwt.sign(payload, String(JWT_SECRET), { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, String(JWT_SECRET));
}
