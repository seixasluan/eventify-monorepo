"use client";

import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        alert("error");

        return;
      }

      localStorage.setItem("token", data.token);

      router.push("/");
    } catch (error) {
      alert("Somenthing went wrong: " + error);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit">Sign In</Button>
      </form>

      <p className="text-sm text-zinc-600 mt-4 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
