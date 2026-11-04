import {
  TipStatuses,
  type TipStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const TipStatusFormOptions: { id: TipStatus; labelKey: string }[] = [
  { id: TipStatuses.CREATED, labelKey: "dashboard.enums.tipStatus.CREATED" },
  {
    id: TipStatuses.PROCESSING,
    labelKey: "dashboard.enums.tipStatus.PROCESSING",
  },
  {
    id: TipStatuses.COMPLETED,
    labelKey: "dashboard.enums.tipStatus.COMPLETED",
  },
  { id: TipStatuses.FAILED, labelKey: "dashboard.enums.tipStatus.FAILED" },
  {
    id: TipStatuses.CANCELLED,
    labelKey: "dashboard.enums.tipStatus.CANCELLED",
  },
  { id: TipStatuses.REFUNDED, labelKey: "dashboard.enums.tipStatus.REFUNDED" },
  { id: TipStatuses.PENDING, labelKey: "dashboard.enums.tipStatus.PENDING" },
];
