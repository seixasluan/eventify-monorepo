"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const HeroSection = () => {
  const { user } = useAuth();

  const createEventHref = !user
    ? "/register"
    : user.role === "ORGANIZER"
    ? "/events/create"
    : "/events";

  const myEventsHref = !user
    ? ""
    : user.role === "ORGANIZER"
    ? "/events/myEvents"
    : "";

  return (
    <section className="bg-indigo-50 py-16 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Discover and Join the Best Events Near You
      </h1>
      <p className="text-zinc-600 mb-6">
        Buy tickets, manage your schedule, and never miss a moment.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/events"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Browse Events
        </Link>
        <Link
          href={createEventHref}
          className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-100 transition"
        >
          Create Your Event
        </Link>
        {user && user.role === "ORGANIZER" && (
          <Link
            href={myEventsHref}
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            My Events
          </Link>
        )}
      </div>
    </section>
  );
};
