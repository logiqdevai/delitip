import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  type Locale,
} from "./config";

const detectFromAcceptLanguage = (header: string | null): Locale | undefined => {
  if (!header) return undefined;
  const requested = header
    .split(",")
    .map((part) => part.trim().split(";")[0].slice(0, 2).toLowerCase());
  return LOCALES.find((locale) => requested.includes(locale));
};

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(cookieLocale)
    ? cookieLocale
    : (detectFromAcceptLanguage((await headers()).get("accept-language")) ??
      DEFAULT_LOCALE);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
