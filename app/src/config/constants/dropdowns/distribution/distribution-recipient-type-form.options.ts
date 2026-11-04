import {
  DistributionRecipientTypes,
  type DistributionRecipientType,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionRecipientTypeFormOptions: {
  id: DistributionRecipientType;
  labelKey: string;
}[] = [
  {
    id: DistributionRecipientTypes.EMPLOYEE,
    labelKey: "dashboard.enums.distributionRecipientType.EMPLOYEE",
  },
  {
    id: DistributionRecipientTypes.STORE,
    labelKey: "dashboard.enums.distributionRecipientType.STORE",
  },
];
