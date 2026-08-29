import {
  StoreIndustries,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";
import {
  StoreIndustryFormOptions,
  getStoreIndustryLabel,
} from "@/config/constants/dropdowns/stores/store-industry-form.options";

export const BusinessTypes = StoreIndustries;
export type BusinessType = StoreIndustry;

export const BusinessTypeFormOptions = StoreIndustryFormOptions;

export function getBusinessTypeLabel(type: BusinessType | string): string {
  return getStoreIndustryLabel(type);
}
