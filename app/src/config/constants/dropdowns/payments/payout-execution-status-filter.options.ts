import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import { PayoutExecutionStatusFormOptions } from "@/config/constants/dropdowns/payments/payout-execution-status-form.options";

export const PayoutExecutionStatusFilterOptions: {
  id: PayoutExecutionStatus | "all";
  label: string;
}[] = [
  { id: "all", label: "All statuses" },
  ...PayoutExecutionStatusFormOptions,
];
