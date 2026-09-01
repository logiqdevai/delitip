import type { RefundStatus } from "@/features/tips/interfaces/tips.interfaces";
import { RefundStatusFormOptions } from "@/config/constants/dropdowns/refunds/refund-status-form.options";

export const RefundStatusFilterOptions: {
  id: RefundStatus | "all";
  label: string;
}[] = [{ id: "all", label: "All statuses" }, ...RefundStatusFormOptions];
