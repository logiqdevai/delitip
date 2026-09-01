import type { DistributionRecipientType } from "@/features/tips/interfaces/tips.interfaces";

export const DistributionRecipientTypeFilterOptions: {
  id: DistributionRecipientType | "all";
  label: string;
}[] = [
  { id: "all", label: "All recipients" },
  { id: "STORE", label: "Store" },
  { id: "EMPLOYEE", label: "Employee" },
];
