import {
  TipStatuses,
  type TipStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const TipStatusFormOptions: { id: TipStatus; label: string }[] = [
  { id: TipStatuses.PENDING, label: "Pending" },
  { id: TipStatuses.COMPLETED, label: "Completed" },
  { id: TipStatuses.FAILED, label: "Failed" },
  { id: TipStatuses.REFUNDED, label: "Refunded" },
];

export function getTipStatusLabel(status: TipStatus | string): string {
  return (
    TipStatusFormOptions.find((option) => option.id === status)?.label ?? status
  );
}
