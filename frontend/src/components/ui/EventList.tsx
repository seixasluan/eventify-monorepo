"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchEvents } from "@/lib/api";
import type { Event } from "@/types/types";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  function getValidImageUrl(url: string | undefined | null) {
    return url && url.trim().startsWith("http")
      ? url
      : "https://placehold.co/600x400";
  }

  useEffect(() => {
    async function load() {
      try {
        const response = await fetchEvents();
        setEvents(response.data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="border rounded-xl overflow-hidden shadow hover:shadow-md transition"
        >
          <Image
            src={getValidImageUrl(event.imageUrl)}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-zinc-500 mb-2">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • São Paulo
            </p>
            <Link
              href={`/events/${event.id}`}
              className="text-indigo-600 font-medium hover:underline"
            >
              See details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
