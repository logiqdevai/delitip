export const LOCALES = ["en", "el"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
};

export const isLocale = (value: string | undefined): value is Locale =>
  LOCALES.some((locale) => locale === value);
