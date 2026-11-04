import type { PayoutRequestStatus } from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { PayoutRequestStatusFormOptions } from "@/config/constants/dropdowns/payouts/payout-request-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const PayoutRequestStatusFilterOptions: DropdownOptionSource<PayoutRequestStatus>[] =
  [
    { id: "all", labelKey: "dashboard.enums.payoutRequestStatus.all" },
    ...PayoutRequestStatusFormOptions,
  ];
