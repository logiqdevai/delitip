import {
  PayoutStatuses,
  type PayoutStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const PayoutStatusFormOptions: { id: PayoutStatus; label: string }[] = [
  { id: PayoutStatuses.PENDING, label: "Pending" },
  { id: PayoutStatuses.PAID, label: "Paid" },
  { id: PayoutStatuses.FAILED, label: "Failed" },
  { id: PayoutStatuses.CANCELLED, label: "Cancelled" },
];

export function getPayoutStatusLabel(status: PayoutStatus | string): string {
  return (
    PayoutStatusFormOptions.find((option) => option.id === status)?.label ??
    status
  );
}
