import { countries as flagCountryCodes } from "country-flag-icons";

// ISO 3166-1 alpha-2 code — referenced wherever behavior is Greece-specific
// (e.g. showing the Δ.Ο.Υ. tax office field), instead of a bare "GR" literal.
export const GREECE_COUNTRY_CODE = "GR";

// country-flag-icons also ships subdivisions (e.g. "GB-ENG") and a handful of
// non-country pseudo-codes (e.g. "EU"). Keep only real ISO 3166-1 alpha-2 codes.
const NON_COUNTRY_CODES = new Set(["AC", "EU", "IC", "TA", "XA", "XC", "XO"]);

// Only offer countries whose official currency AND official language are both
// supported by the app (Currency / Language enums in api/prisma/schema.prisma).
// Each code below must independently satisfy both conditions.
const SUPPORTED_COUNTRY_CODES = new Set([
  // EUR + supported official language
  "AT", // German
  "BE", // French / German
  "CY", // Greek / Turkish
  "DE", // German
  "ES", // Spanish
  "FR", // French
  GREECE_COUNTRY_CODE, // Greek
  "IE", // English
  "IT", // Italian
  "LU", // French / German
  "MC", // French
  "MT", // English
  "PT", // Portuguese
  "SM", // Italian
  // USD + supported official language
  "US", // English
  "EC", // Spanish
  "SV", // Spanish
  "TL", // Portuguese
  // GBP + English
  "GB",
  // TRY + Turkish
  "TR",
  // RUB + Russian
  "RU",
  // AED + Arabic
  "AE",
  // CNY + Chinese
  "CN",
]);

// ISO codes are the source of truth. Display names are locale-aware: use
// useCountryOptions() / useCountryName() from "@/hooks/use-country-options".
export const CountryCodes: string[] = flagCountryCodes.filter(
  (code) =>
    /^[A-Z]{2}$/.test(code) &&
    !NON_COUNTRY_CODES.has(code) &&
    SUPPORTED_COUNTRY_CODES.has(code),
);

// Countries are persisted by their ENGLISH name (tax details / business profile
// / onboarding store the name string, not the code). These helpers translate
// between that stored name and the ISO code and must stay English - never show
// them to people; use the locale-aware hook for display.
const englishNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export function getCountryStorageName(code: string | null | undefined): string {
  if (!code) return "";
  return englishNames?.of(code) ?? code;
}

export function getCountryCodeByName(
  name: string | null | undefined,
): string | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return CountryCodes.find(
    (code) => getCountryStorageName(code).toLowerCase() === normalized,
  );
}
