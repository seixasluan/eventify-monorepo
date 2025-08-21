// next
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// api
import { fetchEventById, getCurrentUser } from "@/lib/api";

// components
import { BackToHome } from "@/components";

type EventDetailsProps = {
  params: {
    id: string;
  };
};

export default async function EventDetailsPage({ params }: EventDetailsProps) {
  const { id } = await params;

  const user = await getCurrentUser();

  const event = await fetchEventById(id);

  if (!event) return notFound();

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <BackToHome />
        <div className="rounded-2xl overflow-hidden shadow-md my-6">
          <Image
            src={event.imageUrl || "https://placehold.co/800x400"}
            alt={event.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
            unoptimized
          />
        </div>

        <h1 className="text-3xl font-bold text-zinc-800 mb-2">{event.title}</h1>

        <p className="text-sm text-zinc-500 mb-4">
          {formattedDate} • {formattedTime} •{" "}
          <span className="font-medium text-zinc-700">
            Organized by {event.organizer?.name || "Desconhecido"}
          </span>
        </p>

        <p className="text-base text-zinc-700 leading-relaxed mb-8">
          {event.description}
        </p>

        <p className="text-base text-zinc-700 leading-relaxed mb-8">
          {event.location} <br />
          <span className="font-bold text-indigo-500 hover:underline">
            <Link
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on the map
            </Link>
          </span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-8">
          <div className="bg-zinc-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Price</p>
            <p className="text-xl font-semibold text-indigo-600">
              R$ {event.price}
            </p>
          </div>

          <div className="bg-zinc-100 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Tickets available</p>
            <p className="text-xl font-semibold text-zinc-700">
              {event.totalTickets - event.ticketsSold}
            </p>
          </div>
        </div>
        <div className="text-center">
          {user ? (
            <Link href={`/checkout/${event.id}`}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow transition duration-300 cursor-pointer">
                Buy Ticket
              </button>
            </Link>
          ) : (
            <Link href={`/register`}>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow transition duration-300 cursor-pointer">
                Buy Ticket
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
