import {
  DistributionPayoutModes,
  type DistributionPayoutMode,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionPayoutModeFormOptions: {
  id: DistributionPayoutMode;
  labelKey: string;
}[] = [
  {
    id: DistributionPayoutModes.DIRECT,
    labelKey: "dashboard.enums.distributionPayoutMode.DIRECT",
  },
  {
    id: DistributionPayoutModes.VIA_STORE,
    labelKey: "dashboard.enums.distributionPayoutMode.VIA_STORE",
  },
];

// Short form for badges and table cells, where the full sentence doesn't fit.
export const DistributionPayoutModeShortOptions: {
  id: DistributionPayoutMode;
  labelKey: string;
}[] = [
  {
    id: DistributionPayoutModes.DIRECT,
    labelKey: "dashboard.enums.distributionPayoutModeShort.DIRECT",
  },
  {
    id: DistributionPayoutModes.VIA_STORE,
    labelKey: "dashboard.enums.distributionPayoutModeShort.VIA_STORE",
  },
];
