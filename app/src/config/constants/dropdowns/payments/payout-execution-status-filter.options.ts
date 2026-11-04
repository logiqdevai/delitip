import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { PayoutExecutionStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const PayoutExecutionStatusFilterOptions: DropdownOptionSource<PayoutExecutionStatus>[] =
  [
    { id: "all", labelKey: "dashboard.enums.payoutExecutionStatus.all" },
    ...PayoutExecutionStatusFormOptions,
  ];
