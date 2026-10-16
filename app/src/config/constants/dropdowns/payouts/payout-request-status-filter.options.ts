import type { PayoutRequestStatus } from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { PayoutRequestStatusFormOptions } from "@/config/constants/dropdowns/payouts/payout-request-status-form.options";

export const PayoutRequestStatusFilterOptions: {
  id: PayoutRequestStatus | "all";
  label: string;
}[] = [{ id: "all", label: "All statuses" }, ...PayoutRequestStatusFormOptions];
