"use client";

import { type FC } from "react";
import { useTranslations } from "next-intl";
import { LanguagePicker } from "@/components/ui/language-picker";
import { TIP_PAGE_UI_LANGUAGES } from "@/app/[storeSlug]/q/[code]/lib/supported-ui-languages";
import {
  useTipLocaleStore,
  type TipLocale,
} from "@/app/[storeSlug]/q/[code]/lib/locale-store";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";

interface LanguageSelectorProps {
  supportedLanguages: Language[];
  primaryLanguage: Language;
}

export const LanguageSelector: FC<LanguageSelectorProps> = ({
  supportedLanguages,
  primaryLanguage,
}) => {
  const t = useTranslations("languageSelector");
  const locale = useTipLocaleStore((state) => state.locale);
  const setLocale = useTipLocaleStore((state) => state.setLocale);

  const offered = supportedLanguages.filter((language) =>
    TIP_PAGE_UI_LANGUAGES.includes(language),
  );
  if (!offered.length && TIP_PAGE_UI_LANGUAGES.includes(primaryLanguage)) {
    offered.push(primaryLanguage);
  }
  const languages = offered.length ? offered : (["EN"] as Language[]);

  // Only one language available (or none we've translated) — nothing to pick.
  if (languages.length <= 1) return null;

  return (
    <LanguagePicker
      value={locale.toUpperCase() as Language}
      onValueChange={(value) => setLocale(value.toLowerCase() as TipLocale)}
      languages={languages}
      labelSource="native"
      compact
      size="sm"
      aria-label={t("label")}
    />
  );
};
