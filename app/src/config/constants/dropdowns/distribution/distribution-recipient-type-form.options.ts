import {
  DistributionRecipientTypes,
  type DistributionRecipientType,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionRecipientTypeFormOptions: {
  id: DistributionRecipientType;
  label: string;
}[] = [
  { id: DistributionRecipientTypes.EMPLOYEE, label: "Employee" },
  { id: DistributionRecipientTypes.STORE, label: "Business (house)" },
];

export function getDistributionRecipientTypeLabel(
  type: DistributionRecipientType | string,
): string {
  return (
    DistributionRecipientTypeFormOptions.find((option) => option.id === type)
      ?.label ?? type
  );
}
