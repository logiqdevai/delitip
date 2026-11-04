import type { StoreIndustry } from "@/features/stores/interfaces/stores.interfaces";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const StoreIndustryFilterOptions: DropdownOptionSource<StoreIndustry>[] =
  [
    { id: "all", labelKey: "dashboard.enums.storeIndustry.all" },
    ...StoreIndustryFormOptions,
  ];
