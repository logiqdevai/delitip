import {
  DistributionPayoutModes,
  type DistributionPayoutMode,
} from "@/features/distribution/interfaces/distribution.interfaces";

export const DistributionPayoutModeDescriptionOptions: {
  id: DistributionPayoutMode;
  label: string;
}[] = [
  {
    id: DistributionPayoutModes.DIRECT,
    label:
      "Each employee is paid their share straight to their own bank account. They need a payout account set up before anything can reach them.",
  },
  {
    id: DistributionPayoutModes.VIA_STORE,
    label:
      "The whole tip lands in your business account. We keep track of what each employee earned so you can hand it over yourself — cash, transfer, payroll — and record it here.",
  },
];

export function getDistributionPayoutModeDescription(
  mode: DistributionPayoutMode | string,
): string {
  return (
    DistributionPayoutModeDescriptionOptions.find(
      (option) => option.id === mode,
    )?.label ?? ""
  );
}
