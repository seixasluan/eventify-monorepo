import { useState, InputHTMLAttributes } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function PasswordInput({ label, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          <b>{label}</b>
        </label>
      )}
      <input
        type={showPassword ? "text" : "password"}
        className="w-full mt-1 px-4 py-2 pr-10 border border-zinc-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-900 placeholder:text-zinc-400"
        {...props} // Pass all other props like required, placeholder, value, onChange
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-[35px] right-3 text-zinc-500 hover:text-zinc-700"
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
