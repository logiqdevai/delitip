// Turns a provider failure reason into something an admin can act on. Viva's
// own wording is kept for anything we don't recognise.
export function describePayoutFailure(
  reason: string | null | undefined,
  currency?: string,
): string {
  if (!reason) return "The transfer failed for an unknown reason.";

  if (/insufficient funds/i.test(reason)) {
    const required = reason.match(/required amount\s+([\d.,]+)/i)?.[1];
    const needed = required
      ? ` The transfer needs ${required}${currency ? ` ${currency}` : ""} including Viva's transfer fee.`
      : "";
    return `Not enough available funds in the Viva wallet.${needed} Top up the wallet or wait for payments to settle.`;
  }

  return reason;
}
