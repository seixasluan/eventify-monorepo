"use client";

// react
import { ChangeEvent } from "react";

type SelectRoleProps = {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
};

export const SelectRole = ({
  label,
  value,
  onChange,
  required = false,
}: SelectRoleProps) => {
  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          <b>{label}</b>
        </label>
      )}
      <select
        className="appearance-none w-full mt-1 px-4 py-2 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 placeholder:text-zinc-400"
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="BUYER">Buyer</option>
        <option value="ORGANIZER">Organizer</option>
      </select>

      {/* Custom icon for dropdown */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
