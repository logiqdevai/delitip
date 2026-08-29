import {
  RefundStatuses,
  type RefundStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const RefundStatusFormOptions: { id: RefundStatus; label: string }[] = [
  { id: RefundStatuses.PENDING, label: "Pending" },
  { id: RefundStatuses.APPROVED, label: "Approved" },
  { id: RefundStatuses.REJECTED, label: "Rejected" },
  { id: RefundStatuses.COMPLETED, label: "Completed" },
];

export function getRefundStatusLabel(status: RefundStatus | string): string {
  return (
    RefundStatusFormOptions.find((option) => option.id === status)?.label ??
    status
  );
}
