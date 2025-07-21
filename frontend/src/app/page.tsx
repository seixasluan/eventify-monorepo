import Link from "next/link";
import EventList from "@/components/ui/EventList";

export default async function HomePage() {

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="bg-indigo-50 py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Discover and Join the Best Events Near You
        </h1>
        <p className="text-zinc-600 mb-6">
          Buy tickets, manage your schedule, and never miss a moment.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/events"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Events
          </Link>
          <Link
            href="/register"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-100 transition"
          >
            Create Your Event
          </Link>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Upcoming Events
        </h2>
        <EventList />
      </section>

      {/* CTA Bottom Section */}
      <section className="bg-indigo-600 text-white py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Ready to join the best events?
        </h2>
        <p className="mb-4">Sign up today and get started in seconds.</p>
        <Link
          href="/register"
          className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition"
        >
          Create Account
        </Link>
      </section>
    </main>
  );
}
