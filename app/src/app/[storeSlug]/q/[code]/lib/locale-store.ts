import { create } from "zustand";
import { TIP_PAGE_UI_LANGUAGES } from "@/app/[storeSlug]/q/[code]/lib/supported-ui-languages";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";

// Keeps the customer's manually-chosen tip-page language across the
// full-page redirect to Viva checkout and back, and across later visits —
// unlike lib/pending-tip.ts's sessionStorage (tab-scoped, cleared once the
// tip is done), a language preference should outlive the tab/session.
export const TIP_LOCALE_STORAGE_KEY = "delitip:tip-locale";

export type TipLocale =
  | "en"
  | "el"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "tr"
  | "ru"
  | "zh";

const UI_LOCALES = TIP_PAGE_UI_LANGUAGES.map(
  (lang) => lang.toLowerCase() as TipLocale,
);

export function readStoredLocale(): TipLocale | null {
  try {
    const stored = localStorage.getItem(TIP_LOCALE_STORAGE_KEY) as TipLocale | null;
    return stored && UI_LOCALES.includes(stored) ? stored : null;
  } catch {
    // localStorage can throw in private-browsing/blocked-storage contexts —
    // fall back to auto-detection instead.
    return null;
  }
}

function writeStoredLocale(locale: TipLocale): void {
  try {
    localStorage.setItem(TIP_LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

function browserLocaleCandidates(): TipLocale[] {
  if (typeof navigator === "undefined") return [];
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return languages
    .map((lang) => lang.split("-")[0].toLowerCase() as TipLocale)
    .filter((lang) => UI_LOCALES.includes(lang));
}

// Best-effort guess before any store data is available: a persisted choice
// (from a previous store visit) or the browser's language, without knowing
// yet which languages *this* store actually supports.
function resolveInitialGuess(): TipLocale {
  if (typeof window === "undefined") return "en";
  return readStoredLocale() ?? browserLocaleCandidates()[0] ?? "en";
}

// Re-resolves once the store's own supported_languages/primary_language are
// known, so the guess above never surfaces a language the store hasn't
// enabled. Returns null when the current locale is already valid for this
// store (no change needed).
export function resolveLocaleForStore(
  currentLocale: TipLocale,
  supportedLanguages: Language[],
  primaryLanguage: Language,
): TipLocale | null {
  const storeLocales = supportedLanguages
    .filter((lang) => UI_LOCALES.includes(lang.toLowerCase() as TipLocale))
    .map((lang) => lang.toLowerCase() as TipLocale);

  if (storeLocales.includes(currentLocale)) return null;

  const stored = readStoredLocale();
  if (stored && storeLocales.includes(stored)) return stored;

  const browserMatch = browserLocaleCandidates().find((lang) =>
    storeLocales.includes(lang),
  );
  if (browserMatch) return browserMatch;

  const primary = primaryLanguage.toLowerCase() as TipLocale;
  if (storeLocales.includes(primary)) return primary;

  return "en";
}

interface TipLocaleState {
  locale: TipLocale;
  /** Sets the locale without persisting it — used by the store-clamping resolution pass. */
  setDetectedLocale: (locale: TipLocale) => void;
  /** Sets the locale AND persists it — used by the language selector. */
  setLocale: (locale: TipLocale) => void;
}

export const useTipLocaleStore = create<TipLocaleState>((set) => ({
  locale: resolveInitialGuess(),
  setDetectedLocale: (locale) => set({ locale }),
  setLocale: (locale) => {
    writeStoredLocale(locale);
    set({ locale });
  },
}));
