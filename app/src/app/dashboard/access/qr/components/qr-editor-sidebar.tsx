"use client";

import { type FC } from "react";
import {
  type LucideIcon,
  Palette,
  Printer,
  QrCode,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import {
  QrEditorSectionOptions,
  QrEditorSections,
  type QrEditorSection,
} from "@/config/constants/dropdowns/qr-codes/qr-editor-section.options";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<QrEditorSection, LucideIcon> = {
  [QrEditorSections.DETAILS]: QrCode,
  [QrEditorSections.RECIPIENTS]: Users,
  [QrEditorSections.APPEARANCE]: Palette,
  [QrEditorSections.TIPPING]: Wallet,
  [QrEditorSections.REVIEWS]: Star,
  [QrEditorSections.PRINT]: Printer,
};

interface QrEditorSidebarProps {
  active: QrEditorSection;
  onSelect: (section: QrEditorSection) => void;
}

export const QrEditorSidebar: FC<QrEditorSidebarProps> = ({
  active,
  onSelect,
}) => {
  return (
    <nav
      aria-label="QR editor sections"
      className="w-full shrink-0 self-start rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs lg:sticky lg:top-6 lg:w-48"
    >
      <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5 lg:overflow-visible">
        {QrEditorSectionOptions.map((option) => {
          const Icon = SECTION_ICONS[option.id];
          const isActive = option.id === active;

          return (
            <li key={option.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-chip transition",
                  isActive
                    ? "bg-brand-50 font-semibold text-brand-800"
                    : "font-medium text-zinc-600 hover:bg-neutral-fill hover:text-ink-charcoal",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-electric-lime" : "text-zinc-400",
                  )}
                  strokeWidth={2}
                />
                <span className="whitespace-nowrap">{option.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
