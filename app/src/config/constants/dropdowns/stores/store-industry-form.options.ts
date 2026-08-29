import {
  StoreIndustries,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreIndustryFormOptions: { id: StoreIndustry; label: string }[] =
  [
    { id: StoreIndustries.RESTAURANT, label: "Restaurant" },
    { id: StoreIndustries.CAFE, label: "Café / Coffee Bar" },
    { id: StoreIndustries.BAR, label: "Bar & Lounge" },
    { id: StoreIndustries.HOTEL, label: "Hotel & Hospitality" },
    { id: StoreIndustries.SALON, label: "Salon" },
    { id: StoreIndustries.SPA, label: "Spa" },
    { id: StoreIndustries.RETAIL, label: "Retail" },
    { id: StoreIndustries.OTHER, label: "Other Service Business" },
  ];

export function getStoreIndustryLabel(
  industry: StoreIndustry | string,
): string {
  return (
    StoreIndustryFormOptions.find((option) => option.id === industry)?.label ??
    industry
  );
}
