"use client";

import { type FC } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  /** Plain text label. Use `labelKey` instead for a translated label. */
  label?: string;
  /** Full message key (e.g. "dashboard.settings.nav.profile"), translated on render. */
  labelKey?: string;
  icon: LucideIcon;
}

interface SectionSidebarProps {
  items: SectionSidebarItem[];
}

export const SectionSidebar: FC<SectionSidebarProps> = ({ items }) => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const labelOf = (item: SectionSidebarItem) =>
    item.labelKey ? t(item.labelKey) : (item.label ?? "");
  const activeItem =
    items.find((item) => pathname === item.href) ?? items[0] ?? null;
  const ActiveIcon = activeItem?.icon;

  return (
    <div className="w-full shrink-0 self-start lg:w-64">
      {activeItem && ActiveIcon ? (
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5 text-base shadow-xs outline-none transition",
                "font-semibold text-ink-charcoal",
                "hover:bg-electric-lime/30 focus-visible:ring-2 focus-visible:ring-electric-lime/40",
              )}
            >
              <ActiveIcon
                className="size-4 shrink-0 text-ink-charcoal"
                strokeWidth={2}
              />
              <span className="min-w-0 flex-1 truncate text-left">
                {labelOf(activeItem)}
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
                      "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-base",
                      active
                        ? "bg-electric-lime font-semibold text-ink-charcoal focus:bg-electric-lime focus:text-ink-charcoal"
                        : "font-medium text-zinc-600",
                    )}
                    onClick={() => router.push(item.href)}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        active ? "text-ink-charcoal" : "text-zinc-400",
                      )}
                      strokeWidth={2}
                    />
                    {labelOf(item)}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}

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
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-base transition",
                    active
                      ? "bg-electric-lime font-semibold text-ink-charcoal"
                      : "font-medium text-zinc-600 hover:bg-electric-lime/30 hover:text-ink-charcoal",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      active ? "text-ink-charcoal" : "text-zinc-400",
                    )}
                    strokeWidth={2}
                  />
                  <span className="whitespace-nowrap">{labelOf(item)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
