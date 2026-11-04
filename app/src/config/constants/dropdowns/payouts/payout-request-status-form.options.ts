import {
  PayoutRequestStatuses,
  type PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const PayoutRequestStatusFormOptions: {
  id: PayoutRequestStatus;
  labelKey: string;
}[] = [
  {
    id: PayoutRequestStatuses.PENDING_REVIEW,
    labelKey: "dashboard.enums.payoutRequestStatus.PENDING_REVIEW",
  },
  {
    id: PayoutRequestStatuses.APPROVED,
    labelKey: "dashboard.enums.payoutRequestStatus.APPROVED",
  },
  {
    id: PayoutRequestStatuses.REJECTED,
    labelKey: "dashboard.enums.payoutRequestStatus.REJECTED",
  },
  {
    id: PayoutRequestStatuses.CANCELLED,
    labelKey: "dashboard.enums.payoutRequestStatus.CANCELLED",
  },
];
