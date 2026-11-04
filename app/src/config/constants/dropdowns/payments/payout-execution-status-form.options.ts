import {
  PayoutExecutionStatuses,
  type PayoutExecutionStatus,
} from "@/features/payouts/interfaces/payouts.interfaces";

export const PayoutExecutionStatusFormOptions: {
  id: PayoutExecutionStatus;
  labelKey: string;
}[] = [
  {
    id: PayoutExecutionStatuses.PROCESSING,
    labelKey: "dashboard.enums.payoutExecutionStatus.PROCESSING",
  },
  {
    id: PayoutExecutionStatuses.COMPLETED,
    labelKey: "dashboard.enums.payoutExecutionStatus.COMPLETED",
  },
  {
    id: PayoutExecutionStatuses.FAILED,
    labelKey: "dashboard.enums.payoutExecutionStatus.FAILED",
  },
  {
    id: PayoutExecutionStatuses.CANCELLED,
    labelKey: "dashboard.enums.payoutExecutionStatus.CANCELLED",
  },
];
