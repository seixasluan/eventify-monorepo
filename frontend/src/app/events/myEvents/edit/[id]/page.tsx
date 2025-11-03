"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { getCurrentEvent } from "@/lib/api";
import { Input, Button, TextArea, BackToHome } from "@/components";

export default function EditEvent() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    price: "",
    imageUrl: "",
    location: "",
    totalTickets: "",
  });

  // search for existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getCurrentEvent(id?.toString());

        const data = res.data;

        setForm({
          title: data.title || "",
          description: data.description || "",
          date: data.date ? data.date.slice(0, 16) : "",
          price: data.price?.toString() || "",
          imageUrl: data.imageUrl || "",
          location: data.location || "",
          totalTickets: data.totalTickets?.toString() || "",
        });
      } catch (error) {
        toast.error("Failed to load event data");
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

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
      const res = await fetch(`http://localhost:4000/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.errors?.[0] || "Failed to update event");
        throw new Error(data.errors?.[0] || "Failed to update event");
      }

      toast.success("Event updated successfully");
      router.push("/events");
    } catch (error: unknown) {
      toast.error("Failed to update event");
      console.error("Error: ", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <section className="max-w-wxl mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">Loading event data...</p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto py-10 px-4">
      <BackToHome />
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Event Title"
          type="text"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextArea
          label="Description"
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <Input
          label="Image URL"
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <Input
          label="Location"
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          label="Total Tickets"
          type="number"
          name="totalTickets"
          placeholder="Total Tickets"
          value={form.totalTickets}
          onChange={handleChange}
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Event"}
        </Button>
      </form>
    </section>
  );
}
