import {
  PayoutStatuses,
  type PayoutStatus,
} from "@/features/tips/interfaces/tips.interfaces";

export const PayoutStatusFormOptions: { id: PayoutStatus; labelKey: string }[] =
  [
    {
      id: PayoutStatuses.PENDING,
      labelKey: "dashboard.enums.payoutStatus.PENDING",
    },
    {
      id: PayoutStatuses.PROCESSING,
      labelKey: "dashboard.enums.payoutStatus.PROCESSING",
    },
    { id: PayoutStatuses.PAID, labelKey: "dashboard.enums.payoutStatus.PAID" },
    {
      id: PayoutStatuses.FAILED,
      labelKey: "dashboard.enums.payoutStatus.FAILED",
    },
    {
      id: PayoutStatuses.CANCELLED,
      labelKey: "dashboard.enums.payoutStatus.CANCELLED",
    },
  ];
