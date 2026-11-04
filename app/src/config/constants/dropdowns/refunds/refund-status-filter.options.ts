import type { RefundStatus } from "@/features/tips/interfaces/tips.interfaces";
import { RefundStatusFormOptions } from "@/config/constants/dropdowns/refunds/refund-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const RefundStatusFilterOptions: DropdownOptionSource<RefundStatus>[] = [
  { id: "all", labelKey: "dashboard.enums.refundStatus.all" },
  ...RefundStatusFormOptions,
];
