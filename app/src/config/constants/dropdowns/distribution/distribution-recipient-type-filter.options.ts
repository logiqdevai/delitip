import type { DistributionRecipientType } from "@/features/distribution/interfaces/distribution.interfaces";
import { DistributionRecipientTypeFormOptions } from "@/config/constants/dropdowns/distribution/distribution-recipient-type-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const DistributionRecipientTypeFilterOptions: DropdownOptionSource<DistributionRecipientType>[] =
  [
    { id: "all", labelKey: "dashboard.enums.distributionRecipientType.all" },
    ...DistributionRecipientTypeFormOptions,
  ];
