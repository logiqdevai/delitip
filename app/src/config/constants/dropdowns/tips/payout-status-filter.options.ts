import type { PayoutStatus } from "@/features/tips/interfaces/tips.interfaces";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const PayoutStatusFilterOptions: DropdownOptionSource<PayoutStatus>[] = [
  { id: "all", labelKey: "dashboard.enums.payoutStatus.allPayouts" },
  ...PayoutStatusFormOptions,
];
