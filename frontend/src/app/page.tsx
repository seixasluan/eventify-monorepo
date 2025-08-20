"use client";

// react
import { useEffect, useState } from "react";

// api
import { fetchEvents } from "@/lib/api";

// components
import { Navbar } from "@/components";
import { HeroSection } from "@/components";
import { EventsPreviewSection } from "@/components";
import { CTABottomSection } from "@/components";

// types
import type { Event } from "@/types/types";

// context
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchEvents();
        const allEvents = res.data?.events ?? [];
        setEvents(allEvents);
      } catch (err) {
        console.error("Failed to load events:", err);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <HeroSection />
      <EventsPreviewSection events={events} />
      {!user && <CTABottomSection />}
    </main>
  );
}
