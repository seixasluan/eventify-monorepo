"use client";

// react
import { useState, useEffect } from "react";

// components
import { BackToHome, EventList } from "@/components";
import { Event } from "@/types/types";

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:4000/events/mine", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch Events");
        }

        const data = await res.json();
        setEvents(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900 px-4 py-12">
      <BackToHome />
      <h1 className="text-3xl font-bold text-center mb-8">My Events</h1>

      {/* Events List */}
      {loading ? (
        <p className="text-center text-zinc-500">Loading...</p>
      ) : events.length > 0 ? (
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <EventList events={events} isOrganizerView={true} />
        </section>
      ) : (
        <p className="text-center text-zinc-500">No events found.</p>
      )}
    </main>
  );
}
