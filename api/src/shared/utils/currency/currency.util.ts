import { Currency } from 'generated/prisma';

// ISO 4217 numeric currency codes, required by Viva's Smart Checkout
// order-creation payload (`currencyCode`).
const ISO_4217_NUMERIC_CODES: Record<Currency, string> = {
  EUR: '978',
  USD: '840',
  GBP: '826',
  TRY: '949',
  RUB: '643',
  AED: '784',
  CNY: '156',
};

export function toIso4217NumericCode(currency: Currency): string {
  return ISO_4217_NUMERIC_CODES[currency];
}
