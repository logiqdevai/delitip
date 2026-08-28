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
    <div className="mb-6 inline-flex rounded-xl border border-zinc-200/60 bg-neutral-fill p-1">
      <button
        type="button"
        onClick={onSelectBusiness}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition",
          activeRole === AuthRoles.BUSINESS
            ? "bg-white font-bold text-ink-charcoal shadow-xs"
            : "font-semibold text-zinc-500 hover:text-ink-charcoal"
        )}
      >
        <Building2
          className={cn(
            "size-3.5",
            activeRole === AuthRoles.BUSINESS
              ? "text-electric-lime"
              : "text-zinc-400"
          )}
          strokeWidth={2}
        />
        Business Account
      </button>
      <button
        type="button"
        onClick={onSelectEmployee}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs transition",
          activeRole === AuthRoles.EMPLOYEE
            ? "bg-white font-bold text-ink-charcoal shadow-xs"
            : "font-semibold text-zinc-500 hover:text-ink-charcoal"
        )}
      >
        <User
          className={cn(
            "size-3.5",
            activeRole === AuthRoles.EMPLOYEE
              ? "text-electric-lime"
              : "text-zinc-400"
          )}
          strokeWidth={2}
        />
        Employee Access
      </button>
    </div>
  );
};
