"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
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
  const t = useTranslations("dashboard.access.qrEditor.sidebar");
  const label = useDropdownLabel();
  const ActiveIcon = SECTION_ICONS[active];
  return (
    <div className="w-full shrink-0 self-start lg:sticky lg:top-6 lg:w-56">
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t("navAria")}
            className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white px-3 py-2.5 text-base font-semibold text-ink-charcoal shadow-xs outline-none transition hover:bg-electric-lime/30 focus-visible:ring-2 focus-visible:ring-electric-lime/40"
          >
            <ActiveIcon className="size-4 shrink-0" strokeWidth={2} />
            <span className="min-w-0 flex-1 truncate text-left">
              {label(QrEditorSectionOptions, active)}
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
            {QrEditorSectionOptions.map((option) => {
              const Icon = SECTION_ICONS[option.id];
              const isActive = option.id === active;
              return (
                <DropdownMenuItem
                  key={option.id}
                  className={cn(
                    "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-base",
                    isActive
                      ? "bg-electric-lime font-semibold text-ink-charcoal focus:bg-electric-lime focus:text-ink-charcoal"
                      : "font-medium text-zinc-600 focus:bg-electric-lime/30 focus:text-ink-charcoal",
                  )}
                  onClick={() => onSelect(option.id)}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      isActive ? "text-ink-charcoal" : "text-zinc-400",
                    )}
                    strokeWidth={2}
                  />
                  {label(QrEditorSectionOptions, option.id)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        aria-label={t("navAria")}
        className="hidden rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xs lg:block"
      >
        <ul className="flex flex-col gap-0.5">
          {QrEditorSectionOptions.map((option) => {
            const Icon = SECTION_ICONS[option.id];
            const isActive = option.id === active;

            return (
              <li key={option.id}>
                <button
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onSelect(option.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-base transition",
                    isActive
                      ? "bg-electric-lime font-semibold text-ink-charcoal"
                      : "font-medium text-zinc-600 hover:bg-electric-lime/30 hover:text-ink-charcoal",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isActive ? "text-ink-charcoal" : "text-zinc-400",
                    )}
                    strokeWidth={2}
                  />
                  <span className="whitespace-nowrap">
                    {label(QrEditorSectionOptions, option.id)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
