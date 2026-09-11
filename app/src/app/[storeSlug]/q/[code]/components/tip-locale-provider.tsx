"use client";

import { type FC, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useTipLocaleStore } from "@/app/[storeSlug]/q/[code]/lib/locale-store";
import { MESSAGES_BY_LOCALE } from "@/app/[storeSlug]/q/[code]/messages";

// Provider-only next-intl usage, scoped to this one route: no locale-prefixed
// routing and no proxy.ts, since translations here don't extend app-wide yet.
export const TipLocaleProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const locale = useTipLocaleStore((state) => state.locale);

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES_BY_LOCALE[locale]}>
      {children}
    </NextIntlClientProvider>
  );
};
