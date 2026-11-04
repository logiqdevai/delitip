"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { StoreTimezoneFormOptions } from "@/config/constants/dropdowns/stores/store-timezone-form.options";
import type { DropdownOption } from "@/hooks/use-dropdown-options";

/**
 * Timezone options as `{ id, label }[]`. When `preferred` (e.g. the browser's
 * zone or a store's saved zone) is not in the curated list it is added first,
 * labelled with its IANA name.
 */
export function useStoreTimezoneOptions(
  preferred?: string | null,
): DropdownOption[] {
  const t = useTranslations();
  return useMemo(() => {
    const options: DropdownOption[] = StoreTimezoneFormOptions.map((option) => ({
      id: option.id,
      label: t(option.labelKey),
    }));
    const extra = preferred?.trim();
    if (extra && !options.some((option) => option.id === extra)) {
      options.unshift({ id: extra, label: extra.replaceAll("_", " ") });
    }
    return options;
  }, [preferred, t]);
}
