import { countries as flagCountryCodes } from "country-flag-icons";

// country-flag-icons also ships subdivisions (e.g. "GB-ENG") and a handful of
// non-country pseudo-codes (e.g. "EU"). Keep only real ISO 3166-1 alpha-2 codes.
const NON_COUNTRY_CODES = new Set(["AC", "EU", "IC", "TA", "XA", "XC", "XO"]);

const countryDisplayNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

function resolveCountryName(code: string): string {
  return countryDisplayNames?.of(code) ?? code;
}

export interface CountryOption {
  id: string;
  label: string;
}

export const CountryOptions: CountryOption[] = flagCountryCodes
  .filter((code) => /^[A-Z]{2}$/.test(code) && !NON_COUNTRY_CODES.has(code))
  .map((code) => ({ id: code, label: resolveCountryName(code) }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function getCountryLabel(code: string | null | undefined): string {
  if (!code) return "";
  return CountryOptions.find((option) => option.id === code)?.label ?? code;
}

export function getCountryCodeByName(
  name: string | null | undefined,
): string | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return CountryOptions.find(
    (option) => option.label.toLowerCase() === normalized,
  )?.id;
}
