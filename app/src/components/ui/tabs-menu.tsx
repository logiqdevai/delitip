"use client";

import { type FC, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface TabsMenuItem {
  value: string;
  label: ReactNode;
  icon?: LucideIcon;
}

interface TabsMenuProps {
  items: readonly TabsMenuItem[];
  value: string;
  onValueChange: (value: string) => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Mobile replacement for a horizontal tab strip: shows the active tab and
 * opens the others in a dropdown. Pair it with `max-md:hidden` on the
 * TabsList and `md:hidden` here (the default).
 */
export const TabsMenu: FC<TabsMenuProps> = ({
  items,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}) => {
  const current = items.find((item) => item.value === value) ?? items[0];
  if (!current) return null;
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={ariaLabel}
        className={cn(
          "group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5 text-base font-semibold text-ink-charcoal shadow-xs outline-none transition hover:bg-electric-lime/30 focus-visible:ring-2 focus-visible:ring-electric-lime/40 md:hidden",
          className,
        )}
      >
        {CurrentIcon ? (
          <CurrentIcon className="size-4 shrink-0" strokeWidth={2} />
        ) : null}
        <span className="min-w-0 flex-1 truncate text-left">
          {current.label}
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
          const active = item.value === value;
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.value}
              className={cn(
                "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-base",
                active
                  ? "bg-electric-lime font-semibold text-ink-charcoal focus:bg-electric-lime focus:text-ink-charcoal"
                  : "font-medium text-zinc-600 focus:bg-electric-lime/30 focus:text-ink-charcoal",
              )}
              onClick={() => onValueChange(item.value)}
            >
              {Icon ? <Icon className="size-4" strokeWidth={2} /> : null}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
