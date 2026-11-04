"use client";

import { useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";

/**
 * Option files in `config/constants/dropdowns/` hold message keys, not text:
 *   { id: "COMPLETED", labelKey: "dashboard.enums.tipStatus.COMPLETED" }
 * These hooks resolve them in the active language.
 */
export interface DropdownOptionSource<T extends string = string> {
  id: T | "all";
  labelKey: string;
}

export interface DropdownOption<T extends string = string> {
  id: T | "all";
  label: string;
}

export function useDropdownOptions<T extends string>(
  options: readonly DropdownOptionSource<T>[],
): DropdownOption<T>[] {
  const t = useTranslations();
  return useMemo(
    () => options.map((option) => ({ id: option.id, label: t(option.labelKey) })),
    [options, t],
  );
}

/** `(options, id, fallback?) => label` - for chips, table cells, titles. */
export function useDropdownLabel() {
  const t = useTranslations();
  return useCallback(
    <T extends string>(
      options: readonly DropdownOptionSource<T>[],
      id: T | string | null | undefined,
      fallback = "",
    ): string => {
      if (id == null || id === "") return fallback;
      const source = options.find((option) => option.id === id);
      if (source) return t(source.labelKey);
      return fallback || String(id);
    },
    [t],
  );
}

/** Descriptions keyed by enum: `{ id, descriptionKey }` -> `(options, id) => text`. */
export function useDropdownDescription() {
  const t = useTranslations();
  return useCallback(
    <T extends string>(
      options: readonly { id: T | "all"; descriptionKey: string }[],
      id: T | string | null | undefined,
    ): string => {
      const source = options.find((option) => option.id === id);
      return source ? t(source.descriptionKey) : "";
    },
    [t],
  );
}
