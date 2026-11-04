"use client";

import { useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { CountryCodes } from "@/config/constants/dropdowns/shared/country.options";

function createRegionNames(locale: string): Intl.DisplayNames | null {
  try {
    return typeof Intl !== "undefined" && "DisplayNames" in Intl
      ? new Intl.DisplayNames([locale], { type: "region" })
      : null;
  } catch {
    return null;
  }
}

/** `(code) => country name in the active language` (falls back to the code). */
export function useCountryName() {
  const locale = useLocale();
  const names = useMemo(() => createRegionNames(locale), [locale]);
  return useCallback(
    (code: string | null | undefined): string => {
      if (!code) return "";
      return names?.of(code) ?? code;
    },
    [names],
  );
}

/** `{ id: ISO code, label: localized name }[]`, sorted by the localized name. */
export function useCountryOptions(): { id: string; label: string }[] {
  const locale = useLocale();
  const countryName = useCountryName();
  return useMemo(
    () =>
      CountryCodes.map((code) => ({ id: code, label: countryName(code) })).sort(
        (a, b) => a.label.localeCompare(b.label, locale),
      ),
    [countryName, locale],
  );
}
