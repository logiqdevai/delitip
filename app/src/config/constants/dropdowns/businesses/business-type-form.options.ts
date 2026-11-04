import {
  StoreIndustries,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";

export const BusinessTypes = StoreIndustries;
export type BusinessType = StoreIndustry;

// Same vocabulary as store industries: labels live in dashboard.enums.storeIndustry.
export const BusinessTypeFormOptions = StoreIndustryFormOptions;
