"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const router = useRouter();
  const activeItem =
    items.find((item) => pathname === item.href) ?? items[0] ?? null;
  const ActiveIcon = activeItem?.icon;

  return (
    <div className="w-full shrink-0 self-start lg:w-56">
      {activeItem && ActiveIcon ? (
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5 text-chip shadow-xs outline-none transition",
                "font-semibold text-brand-800",
                "hover:bg-brand-50/60 focus-visible:ring-2 focus-visible:ring-electric-lime/40",
              )}
            >
              <ActiveIcon
                className="size-4 shrink-0 text-electric-lime"
                strokeWidth={2}
              />
              <span className="min-w-0 flex-1 truncate text-left">
                {activeItem.label}
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-popup-open:rotate-180"
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="w-(--anchor-width) rounded-2xl border border-zinc-200/80 p-1.5 shadow-lg"
            >
              {items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <DropdownMenuItem
                    key={item.href}
                    className={cn(
                      "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-chip",
                      active
                        ? "bg-brand-50 font-semibold text-brand-800 focus:bg-brand-50 focus:text-brand-800"
                        : "font-medium text-zinc-600",
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        active ? "text-electric-lime" : "text-zinc-400",
                      )}
                      strokeWidth={2}
                    />
                    {item.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

      <div className="hidden rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs md:block lg:hidden">
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
