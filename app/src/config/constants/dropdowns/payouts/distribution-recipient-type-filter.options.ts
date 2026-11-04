import type { DistributionRecipientType } from "@/features/tips/interfaces/tips.interfaces";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const DistributionRecipientTypeFilterOptions: DropdownOptionSource<DistributionRecipientType>[] =
  [
    {
      id: "all",
      labelKey: "dashboard.enums.distributionRecipientTypeFilter.all",
    },
    {
      id: "STORE",
      labelKey: "dashboard.enums.distributionRecipientTypeFilter.STORE",
    },
    {
      id: "EMPLOYEE",
      labelKey: "dashboard.enums.distributionRecipientTypeFilter.EMPLOYEE",
    },
  ];
