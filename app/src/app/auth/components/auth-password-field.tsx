"use client";

import { type FC, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const authFieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/40 px-3.5 py-2.5 text-xs text-ink-charcoal focus:ring-2 focus:ring-electric-lime focus:outline-none";

interface AuthPasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  forgotHref?: string;
}

export const AuthPasswordField: FC<AuthPasswordFieldProps> = ({
  id,
  label,
  placeholder = "••••••••••••",
  value,
  onChange,
  required = true,
  forgotHref,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-zinc-700">
          {label}
        </label>
        {forgotHref ? (
          <Link
            href={forgotHref}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Forgot password?
          </Link>
        ) : null}
      </div>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          required={required}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn(authFieldClassName, "pr-10")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="size-4" strokeWidth={2} />
          ) : (
            <Eye className="size-4" strokeWidth={2} />
          )}
        </button>
      </div>
    </div>
  );
};

export { authFieldClassName };
