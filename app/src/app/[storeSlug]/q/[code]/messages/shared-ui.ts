import type { TipLocale } from "@/app/[storeSlug]/q/[code]/lib/locale-store";

/**
 * Screen-reader labels of the shared `components/ui` primitives that render
 * inside the tip flow (NumberPicker, LanguagePicker). Those components read
 * `dashboard.shell.ui.*`, but this route has its own message provider in the
 * customer's language, so the keys are supplied here in every tip language.
 */
const SHARED_UI_LABELS: Record<
  TipLocale,
  { decrease: string; increase: string; language: string }
> = {
  en: { decrease: "Decrease", increase: "Increase", language: "Language" },
  el: { decrease: "Μείωση", increase: "Αύξηση", language: "Γλώσσα" },
  es: { decrease: "Disminuir", increase: "Aumentar", language: "Idioma" },
  fr: { decrease: "Diminuer", increase: "Augmenter", language: "Langue" },
  de: { decrease: "Verringern", increase: "Erhöhen", language: "Sprache" },
  it: { decrease: "Diminuisci", increase: "Aumenta", language: "Lingua" },
  pt: { decrease: "Diminuir", increase: "Aumentar", language: "Idioma" },
  tr: { decrease: "Azalt", increase: "Artır", language: "Dil" },
  ru: { decrease: "Уменьшить", increase: "Увеличить", language: "Язык" },
  zh: { decrease: "减少", increase: "增加", language: "语言" },
};

export const withSharedUiMessages = <T extends object>(
  locale: TipLocale,
  messages: T,
) => ({
  ...messages,
  dashboard: { shell: { ui: SHARED_UI_LABELS[locale] } },
});
