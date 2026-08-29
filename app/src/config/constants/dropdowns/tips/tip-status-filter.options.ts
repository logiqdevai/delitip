import type { TipStatus } from "@/features/tips/interfaces/tips.interfaces";
import { TipStatusFormOptions } from "@/config/constants/dropdowns/tips/tip-status-form.options";

export const TipStatusFilterOptions: {
  id: TipStatus | "all";
  label: string;
}[] = [{ id: "all", label: "All statuses" }, ...TipStatusFormOptions];
