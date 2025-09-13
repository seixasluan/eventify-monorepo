"use client";

// next
import Image from "next/image";
import Link from "next/link";

// heroicons
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// types
import type { Event } from "@/types/types";

type EventListProps = {
  events: Event[];
  isOrganizerView?: boolean;
};

function getValidImageUrl(url: string | undefined | null) {
  return url && url.trim().startsWith("http")
    ? url
    : "https://placehold.co/600x400";
}

export const EventList = ({
  events,
  isOrganizerView = false,
}: EventListProps) => {
  if (!events || events.length === 0) {
    return <p className="text-center text-zinc-500">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((event) => (
        <div
          key={event.id}
          className="border border-indigo-200 rounded-2xl overflow-hidden shadow hover:shadow-lg transition hover:scale-[1.03] bg-white"
        >
          <Image
            src={getValidImageUrl(event.imageUrl)}
            alt={event.title}
            width={600}
            height={400}
            className="w-full aspect-[4/3] md:aspect-[16/9] object-cover"
            unoptimized
            priority
          />
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-zinc-600 mb-1">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-zinc-600 mb-4">{event.location}</p>
              <div className="flex gap-2 mt-auto">
                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
                >
                  <EyeIcon className="w-4 h-4" /> Details
                </Link>

                {isOrganizerView && (
                  <>
                    <Link
                      href={`/events/mine/edit/${event.id}`}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Edit
                    </Link>
                    <Link
                      href={`/events/${event.id}`} // rota temporária até criar a de exclusão
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Ações */}
          </div>
        </div>
      ))}
    </div>
  );
};
