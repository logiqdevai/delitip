import type { Currency } from "@/features/stores/interfaces/stores.interfaces";

export function formatMoney(amountMinorUnits: number, currency: Currency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(amountMinorUnits / 100);
}
