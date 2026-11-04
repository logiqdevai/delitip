"use client";

import { useLocale, useMessages } from "next-intl";
import { setI18nRuntime } from "@/lib/i18n-runtime";

/** Feeds the active locale + messages to `tr()` for non-React code. */
export function I18nRuntimeBridge() {
  const locale = useLocale();
  const messages = useMessages();
  // Set during render (idempotent) so it is ready before any effect or
  // query in the subtree runs.
  setI18nRuntime(locale, messages);
  return null;
}
