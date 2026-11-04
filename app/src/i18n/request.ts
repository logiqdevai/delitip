import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  type Locale,
} from "./config";

// Every area owns messages/<file>.<locale>.json and is exposed under its
// namespace, so no single message file grows unmanageable.
//   dashboard.<area>  -> messages/dashboard/<area>.<locale>.json
//   employee          -> messages/employee/employee.<locale>.json
//   onboarding        -> messages/onboarding/onboarding.<locale>.json
//   auth              -> messages/auth/auth.<locale>.json
//   errors            -> messages/errors/errors.<locale>.json
const MESSAGE_AREAS: ReadonlyArray<{ namespace: string[]; file: string }> = [
  ...[
    "shell",
    "enums",
    "analytics",
    "access",
    "team",
    "money",
    "engagement",
    "settings",
    "admin",
    "adminSystem",
  ].map((area) => ({ namespace: ["dashboard", area], file: `dashboard/${area}` })),
  { namespace: ["employee"], file: "employee/employee" },
  { namespace: ["onboarding"], file: "onboarding/onboarding" },
  { namespace: ["auth"], file: "auth/auth" },
  { namespace: ["errors"], file: "errors/errors" },
];

type MessageTree = { [key: string]: unknown };

const loadMessages = async (locale: Locale): Promise<MessageTree> => {
  const messages = structuredClone(
    (await import(`../../messages/${locale}.json`)).default,
  ) as MessageTree;

  await Promise.all(
    MESSAGE_AREAS.map(async ({ namespace, file }) => {
      const area = (await import(`../../messages/${file}.${locale}.json`)).default;
      let node = messages;
      for (const key of namespace.slice(0, -1)) {
        node = (node[key] ??= {}) as MessageTree;
      }
      node[namespace[namespace.length - 1]] = area;
    }),
  );
  return messages;
};

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
    messages: await loadMessages(locale),
  };
});
