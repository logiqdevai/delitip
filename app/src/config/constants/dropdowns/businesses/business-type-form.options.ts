export const BusinessTypes = {
  RESTAURANT: "RESTAURANT",
  CAFE: "CAFE",
  BAR: "BAR",
  HOTEL: "HOTEL",
  SALON: "SALON",
  OTHER: "OTHER",
} as const;

export type BusinessType =
  (typeof BusinessTypes)[keyof typeof BusinessTypes];

export const BusinessTypeFormOptions: {
  id: BusinessType;
  label: string;
}[] = [
  { id: BusinessTypes.RESTAURANT, label: "Restaurant" },
  { id: BusinessTypes.CAFE, label: "Café / Coffee Bar" },
  { id: BusinessTypes.BAR, label: "Bar & Lounge" },
  { id: BusinessTypes.HOTEL, label: "Hotel & Hospitality" },
  { id: BusinessTypes.SALON, label: "Salon & Spa" },
  { id: BusinessTypes.OTHER, label: "Other Service Business" },
];

export function getBusinessTypeLabel(type: BusinessType | string): string {
  return (
    BusinessTypeFormOptions.find((option) => option.id === type)?.label ?? type
  );
}
