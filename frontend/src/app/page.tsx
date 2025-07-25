"use client";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import EventsPreviewSection from "@/components/layout/EventsPreviewSection";
import CTABottomSection from "@/components/layout/CTABottomSection";
import { fetchEvents } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Event } from "@/types/types";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);

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
      <CTABottomSection />
    </main>
  );
}
