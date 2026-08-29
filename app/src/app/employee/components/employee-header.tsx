"use client";

import { type FC, useState } from "react";
import { AccountSwitcher } from "@/components/auth/account-switcher";
import { BrandMark } from "@/components/brand/brand-mark";
import { cn } from "@/lib/utils";
import { useCurrentEmployee } from "@/features/employees/hooks/use-employees";

const employeeInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export const EmployeeHeader: FC = () => {
  const [onShift, setOnShift] = useState(true);
  const { employee, store } = useCurrentEmployee();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white px-4 py-3 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <div className="text-sm leading-none font-bold tracking-tight text-ink-charcoal">
              delitip
              <span className="text-electric-lime">.com</span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase">
              Employee Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <AccountSwitcher />
          <button
            type="button"
            onClick={() => setOnShift((current) => !current)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-chip font-bold transition",
              onShift
                ? "border border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
                : "border border-zinc-200 bg-neutral-fill font-medium text-zinc-500 hover:bg-zinc-200"
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                onShift ? "animate-pulse bg-electric-lime" : "bg-zinc-400"
              )}
            />
            <span>{onShift ? "On Shift" : "Off Shift"}</span>
          </button>

          <div className="flex items-center gap-2.5 border-l border-zinc-200 pl-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink-charcoal text-xs font-bold text-paper-offwhite ring-2 ring-electric-lime/20">
              {employee ? employeeInitials(employee.full_name) : "?"}
            </div>
            <div className="hidden text-left sm:block">
              <div className="text-xs font-bold text-ink-charcoal">
                {employee?.full_name ?? "—"}
              </div>
              <div className="text-[10px] text-zinc-400">
                {store?.name ?? "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
