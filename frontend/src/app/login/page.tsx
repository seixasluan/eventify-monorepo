"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";
import { useRouter } from "next/navigation";

// components
import { AuthLayout } from "@/components";
import { Input } from "@/components";
import { PasswordInput } from "@/components";
import { Button } from "@/components";

// context
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-zinc-900 mb-6">Sign in</h1>
      {error && <p className="text-red-500">{error}</p>}
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
