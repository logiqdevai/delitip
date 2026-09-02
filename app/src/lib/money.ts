import type { Currency } from "@/features/stores/interfaces/stores.interfaces";

export function formatMoney(amountMinorUnits: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amountMinorUnits / 100);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value) + "%";
}

export function getCurrencySymbol(currency: Currency): string {
  const parts = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(0);
  return parts.find((part) => part.type === "currency")?.value ?? currency;
}
