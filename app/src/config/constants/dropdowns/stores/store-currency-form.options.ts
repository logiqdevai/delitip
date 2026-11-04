import {
  Currencies,
  type Currency,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreCurrencyFormOptions: { id: Currency; labelKey: string }[] = [
  { id: Currencies.EUR, labelKey: "dashboard.enums.storeCurrency.EUR" },
  { id: Currencies.USD, labelKey: "dashboard.enums.storeCurrency.USD" },
  { id: Currencies.GBP, labelKey: "dashboard.enums.storeCurrency.GBP" },
  { id: Currencies.TRY, labelKey: "dashboard.enums.storeCurrency.TRY" },
  { id: Currencies.RUB, labelKey: "dashboard.enums.storeCurrency.RUB" },
  { id: Currencies.AED, labelKey: "dashboard.enums.storeCurrency.AED" },
  { id: Currencies.CNY, labelKey: "dashboard.enums.storeCurrency.CNY" },
];
