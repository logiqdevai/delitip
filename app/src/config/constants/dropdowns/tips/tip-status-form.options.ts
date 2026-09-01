import {
  TipStatuses,
  type TipStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const TipStatusFormOptions: { id: TipStatus; label: string }[] = [
  { id: TipStatuses.CREATED, label: "Created" },
  { id: TipStatuses.PROCESSING, label: "Processing" },
  { id: TipStatuses.COMPLETED, label: "Completed" },
  { id: TipStatuses.FAILED, label: "Failed" },
  { id: TipStatuses.CANCELLED, label: "Cancelled" },
  { id: TipStatuses.REFUNDED, label: "Refunded" },
  { id: TipStatuses.PENDING, label: "Pending" },
];

export function getTipStatusLabel(status: TipStatus | string): string {
  return (
    TipStatusFormOptions.find((option) => option.id === status)?.label ?? status
  );
}
