import type { DistributionRecipientType } from "@/features/distribution/interfaces/distribution.interfaces";
import { DistributionRecipientTypeFormOptions } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-form.options";

export const DistributionRecipientTypeFilterOptions: {
  id: DistributionRecipientType | "all";
  label: string;
}[] = [
  { id: "all", label: "All recipients" },
  ...DistributionRecipientTypeFormOptions,
];
