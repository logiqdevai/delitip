"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutGrid,
  QrCode,
  Settings,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Routes } from "@/routes/routes";
import { cn } from "@/lib/utils";
import { demoBusiness } from "../data/dashboard-demo";

const navItems = [
  {
    href: Routes.dashboard.root,
    label: "Overview",
    icon: LayoutGrid,
    match: (path: string) => path === Routes.dashboard.root,
  },
  {
    href: Routes.dashboard.employees,
    label: "Employees",
    icon: Users,
    badge: String(demoBusiness.staffCount),
    match: (path: string) => path.startsWith(Routes.dashboard.employees),
  },
  {
    href: Routes.dashboard.tips,
    label: "Tips Ledger",
    icon: Wallet,
    match: (path: string) => path.startsWith(Routes.dashboard.tips),
  },
  {
    href: Routes.dashboard.reviews,
    label: "Reviews & Feedback",
    icon: Star,
    match: (path: string) => path.startsWith(Routes.dashboard.reviews),
  },
  {
    href: Routes.dashboard.distribution,
    label: "Tip Distribution",
    icon: ArrowLeftRight,
    match: (path: string) => path.startsWith(Routes.dashboard.distribution),
  },
  {
    href: Routes.dashboard.analytics,
    label: "Analytics",
    icon: BarChart3,
    match: (path: string) => path.startsWith(Routes.dashboard.analytics),
  },
  {
    href: Routes.dashboard.access,
    label: "Customer Access (QR)",
    icon: QrCode,
    match: (path: string) => path.startsWith(Routes.dashboard.access),
  },
] as const;

export const DashboardSidebar: FC = () => {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-zinc-200 bg-white p-4 md:w-64 md:border-r md:border-b-0">
      <div className="space-y-5">
        <div className="flex items-center gap-2.5 px-2">
          <BrandMark size="sm" className="size-7 rounded-lg text-xs" />
          <div>
            <div className="text-sm leading-none font-bold tracking-tight text-ink-charcoal">
              delitip
              <span className="text-electric-lime">.com</span>
            </div>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              Business Portal
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50 p-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ink-charcoal text-xs font-bold text-paper-offwhite">
              {demoBusiness.initial}
            </div>
            <div className="min-w-0 truncate">
              <div className="truncate text-xs font-bold text-ink-charcoal">
                {demoBusiness.name}
              </div>
              <div className="text-[10px] font-medium text-zinc-400">
                {demoBusiness.location} • {demoBusiness.staffCount} Staff
              </div>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto md:flex-col md:space-y-1 md:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            const badge = "badge" in item ? item.badge : undefined;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2 text-chip transition",
                  active
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal"
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-electric-lime" : "text-zinc-400"
                  )}
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{item.label}</span>
                {badge ? (
                  <span className="ml-auto rounded-full bg-neutral-fill px-1.5 py-0.5 text-caption font-semibold text-zinc-600">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3 md:mt-0">
        <Link
          href={Routes.dashboard.settings}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-chip transition",
            pathname.startsWith(Routes.dashboard.settings)
              ? "bg-brand-50 font-semibold text-brand-800"
              : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal"
          )}
        >
          <Settings
            className={cn(
              "size-4",
              pathname.startsWith(Routes.dashboard.settings)
                ? "text-electric-lime"
                : "text-zinc-400"
            )}
            strokeWidth={2}
          />
          Settings
        </Link>
      </div>
    </aside>
  );
};
