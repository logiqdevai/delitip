import type { StoreIndustry } from "@/features/stores/interfaces/stores.interfaces";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";

export const StoreIndustryFilterOptions: {
  id: StoreIndustry | "all";
  label: string;
}[] = [{ id: "all", label: "All industries" }, ...StoreIndustryFormOptions];
