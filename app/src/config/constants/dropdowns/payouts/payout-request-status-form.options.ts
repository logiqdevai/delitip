import {
  PayoutRequestStatuses,
  type PayoutRequestStatus,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const PayoutRequestStatusFormOptions: {
  id: PayoutRequestStatus;
  label: string;
}[] = [
  { id: PayoutRequestStatuses.PENDING_REVIEW, label: "Awaiting review" },
  { id: PayoutRequestStatuses.APPROVED, label: "Approved" },
  { id: PayoutRequestStatuses.REJECTED, label: "Rejected" },
  { id: PayoutRequestStatuses.CANCELLED, label: "Cancelled" },
];

export function getPayoutRequestStatusLabel(
  status: PayoutRequestStatus | string,
): string {
  return (
    PayoutRequestStatusFormOptions.find((option) => option.id === status)
      ?.label ?? status
  );
}
