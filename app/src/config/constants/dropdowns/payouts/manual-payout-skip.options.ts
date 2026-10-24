export const ManualPayoutSkipOptions: { id: string; label: string }[] = [
  { id: "TIP_NOT_FOUND", label: "payment not found" },
  { id: "TIP_NOT_COMPLETED", label: "payment not completed" },
  { id: "FEE_NOT_CONFIRMED", label: "processor fee not confirmed yet" },
  { id: "ALREADY_CLAIMED", label: "already paid out or in progress" },
  { id: "PAYOUT_REQUESTED", label: "locked in a payout request" },
  { id: "NO_PAYOUT_ACCOUNT", label: "no payout account" },
  { id: "ACCOUNT_NOT_ACTIVE", label: "payout account not active" },
  { id: "NO_LINKED_USER", label: "employee has no linked user" },
  { id: "INVOICE_REQUIRED", label: "store payouts need an invoice-backed request" },
];

export function getManualPayoutSkipLabel(reason: string): string {
  return ManualPayoutSkipOptions.find((option) => option.id === reason)?.label ?? reason;
}
