import {
  DistributionPayoutModes,
  type DistributionPayoutMode,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionPayoutModeDescriptionOptions: {
  id: DistributionPayoutMode;
  descriptionKey: string;
}[] = [
  {
    id: DistributionPayoutModes.DIRECT,
    descriptionKey: "dashboard.enums.distributionPayoutModeDescription.DIRECT",
  },
  {
    id: DistributionPayoutModes.VIA_STORE,
    descriptionKey:
      "dashboard.enums.distributionPayoutModeDescription.VIA_STORE",
  },
];
