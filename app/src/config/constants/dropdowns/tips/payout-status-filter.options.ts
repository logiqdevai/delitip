import type { PayoutStatus } from "@/features/tips/interfaces/tips.interfaces";
import { PayoutStatusFormOptions } from "@/config/constants/dropdowns/tips/payout-status-form.options";

export const PayoutStatusFilterOptions: {
  id: PayoutStatus | "all";
  label: string;
}[] = [{ id: "all", label: "All payout statuses" }, ...PayoutStatusFormOptions];
