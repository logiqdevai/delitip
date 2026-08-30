"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionSidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface SectionSidebarProps {
  items: SectionSidebarItem[];
}

export const SectionSidebar: FC<SectionSidebarProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className="w-full shrink-0 self-start lg:w-56">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs lg:hidden">
        <nav className="flex gap-1 overflow-x-auto">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-chip transition",
                  active
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-electric-lime" : "text-zinc-400",
                  )}
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <nav className="sticky top-6 hidden rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs lg:block">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-chip transition",
                    active
                      ? "bg-brand-50 font-semibold text-brand-800"
                      : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-electric-lime" : "text-zinc-400",
                    )}
                    strokeWidth={2}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
