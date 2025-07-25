"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EventList from "@/components/ui/EventList";
import { fetchEvents } from "@/lib/api";
import type { Event } from "@/types/types";
import Link from "next/link";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEvents(); // <-- your API call
        const allEvents = res.data?.events ?? []; // ✅ FIX: extract array
        setEvents(allEvents);
        setFilteredEvents(allEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(term)
    );
    setFilteredEvents(filtered);
  }, [search, events]);

  return (
    <main className="min-h-screen bg-white text-zinc-900 px-4 py-12">
      <Link href="/" className="text-indigo-700 font-bold hover:underline">
        {"˂ Voltar"}
      </Link>
      <h1 className="text-3xl font-bold text-center mb-8">All Events</h1>

      {/* Search Box */}
      <div className="max-w-xl mx-auto relative mb-12">
        <input
          type="text"
          placeholder="Search for an event by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-zinc-300 rounded-lg px-4 py-3 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <EventList events={filteredEvents} />
      ) : (
        <p className="text-center text-zinc-500">No events found.</p>
      )}
    </main>
  );
}
