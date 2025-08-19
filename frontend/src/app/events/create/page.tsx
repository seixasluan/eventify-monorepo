"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    price: "",
    imageUrl: "",
    location: "",
    totalTickets: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      console.log("form:", form);

      if (!res.ok) {
        const data = await res.json();
        console.log("data: ", data);
        throw new Error(data.errors?.[0] || "Failed to create Event");
      }

      router.push("/events");
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          value={form.totalTickets}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
}
