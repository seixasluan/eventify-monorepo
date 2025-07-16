"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Eventify
      </Link>

      <nav className="flex gap-4 items-center">
        <Link href="/events" className="text-gray-700 hover:text-blue-600">
          Events
        </Link>

        {user?.role === "BUYER" && (
          <Link
            href="/my-tickets"
            className="text-gray-700 hover:text-blue-600"
          >
            My Tickets
          </Link>
        )}

        {user?.role === "ORGANIZER" && (
          <Link
            href="/organizer/dashboard"
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>
        )}

        {!user ? (
          <Link
            href="/login"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
