import {
  Currencies,
  type Currency,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreCurrencyFormOptions: { id: Currency; label: string }[] = [
  { id: Currencies.EUR, label: "EUR - Euro" },
  { id: Currencies.USD, label: "USD - US Dollar" },
  { id: Currencies.GBP, label: "GBP - British Pound" },
  { id: Currencies.TRY, label: "TRY - Turkish Lira" },
  { id: Currencies.RUB, label: "RUB - Russian Ruble" },
  { id: Currencies.AED, label: "AED - UAE Dirham" },
  { id: Currencies.CNY, label: "CNY - Chinese Yuan" },
];

export function getStoreCurrencyLabel(currency: Currency | string): string {
  return (
    StoreCurrencyFormOptions.find((option) => option.id === currency)?.label ??
    currency
  );
}
