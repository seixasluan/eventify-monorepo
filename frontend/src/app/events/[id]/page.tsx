import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchEventById } from "@/lib/api";
import Link from "next/link";

type EventDetailsProps = {
  params: {
    id: string;
  };
};

export default async function EventDetailsPage({ params }: EventDetailsProps) {
  const event = await fetchEventById(params.id);

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
        <Link href="/" className="text-indigo-700 font-bold hover:underline">
          {"˂ Voltar"}
        </Link>
        <div className="rounded-2xl overflow-hidden shadow-md my-6">
          <Image
            src={event.imageUrl || "https://placehold.co/800x400"}
            alt={event.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
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
      </div>
    </div>
  );
}
