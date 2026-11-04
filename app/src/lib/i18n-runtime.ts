import { createTranslator } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";

/**
 * Translator for code that runs outside React render: service fallbacks,
 * the axios interceptor, `getErrorMessage`, toast callbacks in mutation hooks.
 *
 * The messages are handed over by `<I18nRuntimeBridge />` (mounted once under
 * `NextIntlClientProvider`). Inside components use `useTranslations()` —
 * never `tr()` — so server rendering never depends on this module state.
 *
 * Usage: `tr("errors.network")`, `tr("errors.loadFailed", { what: "tips" })`.
 * Keys are full paths from the message root.
 */
type Runtime = { locale: string; messages: AbstractIntlMessages };

let runtime: Runtime | null = null;

export const setI18nRuntime = (locale: string, messages: AbstractIntlMessages) => {
  if (runtime?.locale === locale && runtime.messages === messages) return;
  runtime = { locale, messages };
};

export const getI18nLocale = (): string =>
  runtime?.locale ??
  (typeof document !== "undefined" ? document.documentElement.lang : "") ??
  "en";

export const tr = (
  key: string,
  values?: Record<string, string | number | Date>,
): string => {
  if (!runtime) return key;
  try {
    const translator = createTranslator({
      locale: runtime.locale,
      messages: runtime.messages,
      onError: () => {},
      getMessageFallback: ({ key: missing }) => missing,
    });
    return (translator as (k: string, v?: unknown) => string)(key, values);
  } catch {
    return key;
  }
};
