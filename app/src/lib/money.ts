import type { Currency } from "@/features/stores/interfaces/stores.interfaces";

/**
 * `locale` should be `useLocale()` inside components so numbers follow the
 * language chosen in the app, not the browser default.
 */
export function formatMoney(
  amountMinorUnits: number,
  currency: Currency,
  locale?: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amountMinorUnits / 100);
}

export function formatPercent(value: number, locale?: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value) + "%";
}

export function getCurrencySymbol(currency: Currency, locale?: string): string {
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(0);
  return parts.find((part) => part.type === "currency")?.value ?? currency;
}
