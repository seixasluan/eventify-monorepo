import { EventList } from "@/components/ui";
import type { Event } from "@/types/types";

type Props = {
  events: Event[];
};

export const EventsPreviewSection = ({ events }: Props) => {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Upcoming Events
      </h2>
      <EventList events={events} />
    </section>
  );
};
