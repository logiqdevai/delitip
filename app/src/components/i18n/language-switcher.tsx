"use client";

import { type FC, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE, LOCALES, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  el: "ΕΛ",
};

type LanguageSwitcherTone = "dark" | "light";

interface LanguageSwitcherProps {
  className?: string;
  /** "dark" (default) suits the dark landing surfaces; "light" suits the dashboard. */
  tone?: LanguageSwitcherTone;
}

const GROUP_TONE: Record<LanguageSwitcherTone, string> = {
  dark: "border-white/15",
  light: "border-zinc-200 bg-white",
};

const ACTIVE_TONE: Record<LanguageSwitcherTone, string> = {
  dark: "bg-electric-lime text-ink-charcoal",
  light: "bg-ink-charcoal text-paper-offwhite",
};

const IDLE_TONE: Record<LanguageSwitcherTone, string> = {
  dark: "text-ink-foreground/70 hover:text-electric-lime",
  light: "text-zinc-500 hover:text-ink-charcoal",
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  className,
  tone = "dark",
}) => {
  const t = useTranslations("landing.language");
  const activeLocale = useLocale();
  const [isPending, setIsPending] = useState(false);

  // The cookie is written in the browser, not through a Server Action: a
  // Server Action that sets a cookie makes Next re-render the current page
  // with the new messages *before* the reload, which flashed an error screen.
  const handleSelect = (locale: Locale) => {
    if (locale === activeLocale || isPending) return;
    setIsPending(true);
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    window.location.reload();
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-xs font-semibold",
        GROUP_TONE[tone],
        isPending && "opacity-60",
        className
      )}
    >
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => handleSelect(locale)}
          aria-pressed={locale === activeLocale}
          className={cn(
            "rounded-full px-2.5 py-1 transition",
            locale === activeLocale ? ACTIVE_TONE[tone] : IDLE_TONE[tone]
          )}
        >
          {SHORT_LABELS[locale]}
        </button>
      ))}
    </div>
  );
};
