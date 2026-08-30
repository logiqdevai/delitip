"use client";

import { type FC } from "react";
import { Building2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const AuthRoles = {
  BUSINESS: "business",
  EMPLOYEE: "employee",
} as const;

export type AuthRole = (typeof AuthRoles)[keyof typeof AuthRoles];

interface AuthRoleSwitcherProps {
  activeRole: AuthRole;
  onSelectBusiness: () => void;
  onSelectEmployee: () => void;
}

export const AuthRoleSwitcher: FC<AuthRoleSwitcherProps> = ({
  activeRole,
  onSelectBusiness,
  onSelectEmployee,
}) => {
  return (
    <div className="mb-6 flex w-full rounded-xl border border-zinc-200/60 bg-neutral-fill p-1">
      <button
        type="button"
        onClick={onSelectBusiness}
        aria-label="Business Account"
        className={cn(
          "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs whitespace-nowrap transition sm:px-3.5",
          activeRole === AuthRoles.BUSINESS
            ? "bg-white font-bold text-ink-charcoal shadow-xs"
            : "font-semibold text-zinc-500 hover:text-ink-charcoal"
        )}
      >
        <Building2
          className={cn(
            "size-3.5 shrink-0",
            activeRole === AuthRoles.BUSINESS
              ? "text-electric-lime"
              : "text-zinc-400"
          )}
          strokeWidth={2}
        />
        <span className="sm:hidden">Business</span>
        <span className="hidden sm:inline">Business Account</span>
      </button>
      <button
        type="button"
        onClick={onSelectEmployee}
        aria-label="Employee Access"
        className={cn(
          "flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs whitespace-nowrap transition sm:px-3.5",
          activeRole === AuthRoles.EMPLOYEE
            ? "bg-white font-bold text-ink-charcoal shadow-xs"
            : "font-semibold text-zinc-500 hover:text-ink-charcoal"
        )}
      >
        <User
          className={cn(
            "size-3.5 shrink-0",
            activeRole === AuthRoles.EMPLOYEE
              ? "text-electric-lime"
              : "text-zinc-400"
          )}
          strokeWidth={2}
        />
        <span className="sm:hidden">Employee</span>
        <span className="hidden sm:inline">Employee Access</span>
      </button>
    </div>
  );
};
