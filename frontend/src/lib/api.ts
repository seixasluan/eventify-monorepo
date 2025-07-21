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
