"use client";

import { type FC } from "react";
import { cn } from "@/lib/utils";

type LegalNavItem = {
  id: string;
  title: string;
};

type LegalDocumentNavProps = {
  items: LegalNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
};

export const LegalDocumentNav: FC<LegalDocumentNavProps> = ({
  items,
  activeId,
  onNavigate,
}) => {
  return (
    <>
      <nav
        aria-label="Document sections"
        className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(item.id);
              }}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-chip whitespace-nowrap transition-colors duration-200",
                isActive
                  ? "bg-ink-charcoal font-semibold text-paper-offwhite"
                  : "bg-neutral-fill font-medium text-zinc-500 hover:text-ink-charcoal",
              )}
            >
              {item.title}
            </a>
          );
        })}
      </nav>

      <nav
        aria-label="Document sections"
        className="hidden lg:block"
      >
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.id);
                  }}
                  className={cn(
                    "block py-1.5 text-[0.9375rem] leading-snug transition-colors duration-200",
                    isActive
                      ? "font-semibold text-ink-charcoal"
                      : "font-medium text-zinc-400 hover:text-zinc-600",
                  )}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
