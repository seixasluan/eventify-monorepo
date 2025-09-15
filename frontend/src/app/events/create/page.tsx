"use client";

// react
import { useState } from "react";

// toast
import { toast } from "sonner";

// next
import { useRouter } from "next/navigation";

// components
import { Input, Button, TextArea, BackToHome } from "@/components";

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
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError("Failed to create Event");
        throw new Error(data.errors?.[0] || "Failed to create Event");
      }

      toast.success("Event created successfully");
      router.push("/events");
    } catch (error: unknown) {
      toast.error("Failed to create event");
      console.log("Error: ", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title"
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <TextArea
          label="Description"
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <Input
          label="Date and Time"
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <Input
          label="Ticket Price"
          type="number"
          name="price"
          placeholder="Ticket Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <Input
          label="Image URL"
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Input
          label="Location"
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <Input
          label="Total Tickets"
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          value={form.totalTickets}
          onChange={handleChange}
          className="w-full border border-zinc-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </section>
  );
}
