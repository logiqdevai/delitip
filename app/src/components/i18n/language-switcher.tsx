"use client";

import { type FC, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, type Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/actions";
import { cn } from "@/lib/utils";

const SHORT_LABELS: Record<Locale, string> = {
  en: "EN",
  el: "ΕΛ",
};

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ className }) => {
  const t = useTranslations("landing.language");
  const activeLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (locale: Locale) => {
    if (locale === activeLocale) return;
    startTransition(async () => {
      await setLocale(locale);
      window.location.reload();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full border border-white/15 p-0.5 text-xs font-semibold",
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
            locale === activeLocale
              ? "bg-electric-lime text-ink-charcoal"
              : "text-ink-foreground/70 hover:text-electric-lime"
          )}
        >
          {SHORT_LABELS[locale]}
        </button>
      ))}
    </div>
  );
};
