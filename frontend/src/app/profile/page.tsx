"use client";

// react
import { useEffect, useState } from "react";

// components
import { AuthLayout, Input, PasswordInput, Button } from "@/components";

// api
import { getCurrentUser } from "@/lib/api";

export default function Profile() {
  const [user, setUser] = useState<unknown>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.name);
        setEmail(currentUser.email);
      }
    };
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Error to uptdade profile.");
      return;
    }

    const data = await res.json();
    console.log("Profile updated.");
    setUser(data.user);
    setPassword(""); // clear password field
  };

  if (!user) return <p>Loading...</p>;

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Profile</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
        <PasswordInput
          label="Change Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
        />

        <Button type="submit">Edit Profile</Button>
      </form>
    </AuthLayout>
  );
}
