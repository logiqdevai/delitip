import {
  RefundStatuses,
  type RefundStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const RefundStatusFormOptions: { id: RefundStatus; labelKey: string }[] =
  [
    {
      id: RefundStatuses.PENDING,
      labelKey: "dashboard.enums.refundStatus.PENDING",
    },
    {
      id: RefundStatuses.APPROVED,
      labelKey: "dashboard.enums.refundStatus.APPROVED",
    },
    {
      id: RefundStatuses.REJECTED,
      labelKey: "dashboard.enums.refundStatus.REJECTED",
    },
    {
      id: RefundStatuses.COMPLETED,
      labelKey: "dashboard.enums.refundStatus.COMPLETED",
    },
  ];
