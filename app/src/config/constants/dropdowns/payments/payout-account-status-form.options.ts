import {
  PayoutAccountStatuses,
  type PayoutAccountStatus,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";

export const PayoutAccountStatusFormOptions: {
  id: PayoutAccountStatus;
  label: string;
}[] = [
  { id: PayoutAccountStatuses.PENDING, label: "Pending" },
  { id: PayoutAccountStatuses.ACTIVE, label: "Active" },
  { id: PayoutAccountStatuses.RESTRICTED, label: "Restricted" },
  { id: PayoutAccountStatuses.DISABLED, label: "Disabled" },
];

export function getPayoutAccountStatusLabel(
  status: PayoutAccountStatus | string,
): string {
  return (
    PayoutAccountStatusFormOptions.find((option) => option.id === status)
      ?.label ?? status
  );
}
