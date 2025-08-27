"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Eventify
        </Link>
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                href="/events"
                className="text-zinc-700 hover:text-indigo-600 transition"
              >
                Events
              </Link>
              <Link
                href="/profile"
                className="text-zinc-700 hover:text-indigo-600 transition"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
