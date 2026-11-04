
import { tr } from "@/lib/i18n-runtime";

// Turns a provider failure reason into something an admin can act on. Viva's
// own wording is kept for anything we don't recognise.
export function describePayoutFailure(
  reason: string | null | undefined,
  currency?: string,
): string {
  if (!reason) return tr("errors.payoutFailure.unknown");

  if (/insufficient funds/i.test(reason)) {
    const required = reason.match(/required amount\s+([\d.,]+)/i)?.[1];
    if (required) {
      return tr("errors.payoutFailure.insufficientFundsWithAmount", {
        amount: currency ? `${required} ${currency}` : required,
      });
    }
    return tr("errors.payoutFailure.insufficientFunds");
  }

  return reason;
}
