"use client";

import { type FC } from "react";
import { Store, User } from "lucide-react";
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
  const isBusiness = activeRole === AuthRoles.BUSINESS;
  const isEmployee = activeRole === AuthRoles.EMPLOYEE;

  return (
    <div
      className={cn(
        "mb-7 flex w-full border-b border-zinc-200",
        "lg:mb-6 lg:rounded-xl lg:border lg:border-zinc-200/60 lg:bg-neutral-fill lg:p-1"
      )}
    >
      <button
        type="button"
        onClick={onSelectBusiness}
        aria-label="Business Account"
        className={cn(
          "relative flex min-w-0 flex-1 items-center justify-center gap-2 pb-3.5 text-sm transition",
          "lg:gap-1.5 lg:rounded-lg lg:px-3.5 lg:py-1.5 lg:pb-1.5 lg:text-xs lg:whitespace-nowrap",
          isBusiness
            ? "font-bold text-ink-charcoal lg:bg-white lg:shadow-xs"
            : "font-semibold text-zinc-400 hover:text-zinc-600 lg:text-zinc-500 lg:hover:text-ink-charcoal"
        )}
      >
        <Store
          className={cn(
            "size-4 shrink-0 lg:size-3.5",
            isBusiness ? "text-electric-lime" : "text-zinc-400"
          )}
          strokeWidth={2.25}
        />
        <span className="truncate">Business Account</span>
        {isBusiness ? (
          <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-electric-lime lg:hidden" />
        ) : null}
      </button>
      <button
        type="button"
        onClick={onSelectEmployee}
        aria-label="Staff Access"
        className={cn(
          "relative flex min-w-0 flex-1 items-center justify-center gap-2 pb-3.5 text-sm transition",
          "lg:gap-1.5 lg:rounded-lg lg:px-3.5 lg:py-1.5 lg:pb-1.5 lg:text-xs lg:whitespace-nowrap",
          isEmployee
            ? "font-bold text-ink-charcoal lg:bg-white lg:shadow-xs"
            : "font-semibold text-zinc-400 hover:text-zinc-600 lg:text-zinc-500 lg:hover:text-ink-charcoal"
        )}
      >
        <User
          className={cn(
            "size-4 shrink-0 lg:size-3.5",
            isEmployee ? "text-electric-lime" : "text-zinc-400"
          )}
          strokeWidth={2.25}
        />
        <span className="truncate">Staff Access</span>
        {isEmployee ? (
          <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-electric-lime lg:hidden" />
        ) : null}
      </button>
    </div>
  );
};
