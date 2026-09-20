import {
  DistributionPayoutModes,
  type DistributionPayoutMode,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionPayoutModeFormOptions: {
  id: DistributionPayoutMode;
  label: string;
}[] = [
  { id: DistributionPayoutModes.DIRECT, label: "Pay each recipient directly" },
  {
    id: DistributionPayoutModes.VIA_STORE,
    label: "Send everything to the business",
  },
];

export function getDistributionPayoutModeLabel(
  mode: DistributionPayoutMode | string,
): string {
  return (
    DistributionPayoutModeFormOptions.find((option) => option.id === mode)
      ?.label ?? mode
  );
}

// Short form for badges and table cells, where the full sentence doesn't fit.
export const DistributionPayoutModeShortOptions: {
  id: DistributionPayoutMode;
  label: string;
}[] = [
  { id: DistributionPayoutModes.DIRECT, label: "Direct payouts" },
  { id: DistributionPayoutModes.VIA_STORE, label: "Paid by the business" },
];

export function getDistributionPayoutModeShortLabel(
  mode: DistributionPayoutMode | string,
): string {
  return (
    DistributionPayoutModeShortOptions.find((option) => option.id === mode)
      ?.label ?? mode
  );
}
