import type { TipStatus } from "@/features/tips/interfaces/tips.interfaces";
import { TipStatusFormOptions } from "@/config/constants/dropdowns/tips/tip-status-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const TipStatusFilterOptions: DropdownOptionSource<TipStatus>[] = [
  { id: "all", labelKey: "dashboard.enums.tipStatus.all" },
  ...TipStatusFormOptions,
];
