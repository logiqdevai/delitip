import {
  StoreIndustries,
  type StoreIndustry,
} from "@/features/stores/interfaces/stores.interfaces";

export const StoreIndustryFormOptions: {
  id: StoreIndustry;
  labelKey: string;
}[] = [
  {
    id: StoreIndustries.RESTAURANT,
    labelKey: "dashboard.enums.storeIndustry.RESTAURANT",
  },
  { id: StoreIndustries.CAFE, labelKey: "dashboard.enums.storeIndustry.CAFE" },
  { id: StoreIndustries.BAR, labelKey: "dashboard.enums.storeIndustry.BAR" },
  {
    id: StoreIndustries.HOTEL,
    labelKey: "dashboard.enums.storeIndustry.HOTEL",
  },
  {
    id: StoreIndustries.SALON,
    labelKey: "dashboard.enums.storeIndustry.SALON",
  },
  { id: StoreIndustries.SPA, labelKey: "dashboard.enums.storeIndustry.SPA" },
  {
    id: StoreIndustries.RETAIL,
    labelKey: "dashboard.enums.storeIndustry.RETAIL",
  },
  {
    id: StoreIndustries.BARBERSHOP,
    labelKey: "dashboard.enums.storeIndustry.BARBERSHOP",
  },
  {
    id: StoreIndustries.FITNESS,
    labelKey: "dashboard.enums.storeIndustry.FITNESS",
  },
  {
    id: StoreIndustries.FOOD_TRUCK,
    labelKey: "dashboard.enums.storeIndustry.FOOD_TRUCK",
  },
  {
    id: StoreIndustries.CLEANING,
    labelKey: "dashboard.enums.storeIndustry.CLEANING",
  },
  {
    id: StoreIndustries.OTHER,
    labelKey: "dashboard.enums.storeIndustry.OTHER",
  },
];
