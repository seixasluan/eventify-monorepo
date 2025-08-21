"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";
import { useRouter } from "next/navigation";

// components
import { AuthLayout } from "@/components";
import { Input, PasswordInput, Button, SelectRole } from "@/components";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"BUYER" | "ORGANIZER">("BUYER");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Registration failed");
        return;
      }

      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      alert("Something went wrong: " + error);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">
        Create an Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <SelectRole
          onChange={(e) => setRole(e.target.value as "BUYER" | "ORGANIZER")}
          value={role}
          required
        />
        <Button type="submit">Register</Button>
      </form>

      <p className="text-sm text-zinc-600 mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
