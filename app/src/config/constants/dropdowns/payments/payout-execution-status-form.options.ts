import {
  PayoutExecutionStatuses,
  type PayoutExecutionStatus,
} from "@/features/payouts/interfaces/payouts.interfaces";

export const PayoutExecutionStatusFormOptions: {
  id: PayoutExecutionStatus;
  label: string;
}[] = [
  { id: PayoutExecutionStatuses.PROCESSING, label: "Processing" },
  { id: PayoutExecutionStatuses.COMPLETED, label: "Completed" },
  { id: PayoutExecutionStatuses.FAILED, label: "Failed" },
  { id: PayoutExecutionStatuses.CANCELLED, label: "Cancelled" },
];

export function getPayoutExecutionStatusLabel(
  status: PayoutExecutionStatus | string,
): string {
  return (
    PayoutExecutionStatusFormOptions.find((option) => option.id === status)
      ?.label ?? status
  );
}
