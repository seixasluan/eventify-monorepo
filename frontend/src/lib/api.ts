export async function fetchEvents() {
  const res = await fetch("http://localhost:4000/events", {
    method: "GET",
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

export async function fetchEventById(id: string) {
  const res = await fetch(`http://localhost:4000/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
}
