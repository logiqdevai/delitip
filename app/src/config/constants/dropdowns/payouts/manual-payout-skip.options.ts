import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

// Reasons a manual payout skipped an item. The labels are lowercase fragments
// meant to be embedded in a sentence. Non-React callers: tr(option.labelKey).
export const ManualPayoutSkipOptions: DropdownOptionSource[] = [
  {
    id: "TIP_NOT_FOUND",
    labelKey: "dashboard.enums.manualPayoutSkip.TIP_NOT_FOUND",
  },
  {
    id: "TIP_NOT_COMPLETED",
    labelKey: "dashboard.enums.manualPayoutSkip.TIP_NOT_COMPLETED",
  },
  {
    id: "FEE_NOT_CONFIRMED",
    labelKey: "dashboard.enums.manualPayoutSkip.FEE_NOT_CONFIRMED",
  },
  {
    id: "ALREADY_CLAIMED",
    labelKey: "dashboard.enums.manualPayoutSkip.ALREADY_CLAIMED",
  },
  {
    id: "PAYOUT_REQUESTED",
    labelKey: "dashboard.enums.manualPayoutSkip.PAYOUT_REQUESTED",
  },
  {
    id: "NO_PAYOUT_ACCOUNT",
    labelKey: "dashboard.enums.manualPayoutSkip.NO_PAYOUT_ACCOUNT",
  },
  {
    id: "ACCOUNT_NOT_ACTIVE",
    labelKey: "dashboard.enums.manualPayoutSkip.ACCOUNT_NOT_ACTIVE",
  },
  {
    id: "NO_LINKED_USER",
    labelKey: "dashboard.enums.manualPayoutSkip.NO_LINKED_USER",
  },
  {
    id: "INVOICE_REQUIRED",
    labelKey: "dashboard.enums.manualPayoutSkip.INVOICE_REQUIRED",
  },
];
