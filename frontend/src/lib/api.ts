"use server";

// next
import { cookies } from "next/headers";

// jwt
import jwt from "jsonwebtoken";

// .env
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      name: string;
      email: string;
      role: string;
    };

    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function fetchEvents() {
  const res = await fetch("http://localhost:4000/events", {
    method: "GET",
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export async function fetchEventById(id: string) {
  const res = await fetch(`http://localhost:4000/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
}
