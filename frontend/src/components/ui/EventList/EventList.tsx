"use client";

// next
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// types
import type { Event } from "@/types/types";

type EventListProps = {
  events: Event[];
};

function getValidImageUrl(url: string | undefined | null) {
  return url && url.trim().startsWith("http")
    ? url
    : "https://placehold.co/600x400";
}

export const EventList = ({ events }: EventListProps) => {
  const router = useRouter();

  if (!events || events.length === 0) {
    return <p className="text-center text-zinc-500">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="border border-indigo-400 rounded-xl overflow-hidden shadow hover:shadow-md transition hover:scale-[1.05]"
          onClick={() => router.push(`/events/${event.id}`)}
        >
          <Image
            src={getValidImageUrl(event.imageUrl)}
            alt={event.title}
            width={600}
            height={400}
            className="w-full h-48 object-cover"
            unoptimized
            priority
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-zinc-600 mb-2">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-zinc-600 mb-2">{event.location}</p>
            <Link
              href={`/events/${event.id}`}
              className="text-indigo-600 font-medium hover:underline"
            >
              <b>See details</b>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
