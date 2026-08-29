"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QrCode, Star, Wallet, Zap } from "lucide-react";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { useEmployeeCashOut } from "./employee-cash-out-provider";

const navItems = [
  {
    href: Routes.employee.root,
    label: "Earnings & Tips",
    icon: Wallet,
    match: (path: string) => path === Routes.employee.root,
  },
  {
    href: Routes.employee.reviews,
    label: "Reviews & Badges",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.employee.reviews),
  },
  {
    href: Routes.employee.qr,
    label: "My QR & Link",
    icon: QrCode,
    match: (path: string) => path.startsWith(Routes.employee.qr),
  },
] as const;

export const EmployeeNav: FC = () => {
  const pathname = usePathname();
  const { requestCashOut } = useEmployeeCashOut();

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-chip transition",
                active
                  ? "bg-ink-charcoal font-bold text-white shadow-xs"
                  : "font-semibold text-zinc-600 hover:bg-white hover:text-ink-charcoal"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5",
                  item.label === "Reviews & Badges" && !active
                    ? "text-rating-amber"
                    : undefined
                )}
                strokeWidth={2}
                fill={
                  item.label === "Reviews & Badges" && !active
                    ? "currentColor"
                    : "none"
                }
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={requestCashOut}
        className="hidden items-center gap-1.5 rounded-xl bg-electric-lime px-3.5 py-2 text-chip font-bold text-ink-charcoal shadow-sm transition hover:bg-brand-700 sm:flex"
      >
        <Zap className="size-3.5" strokeWidth={2} />
        Instant Cash Out
      </button>
    </div>
  );
};
