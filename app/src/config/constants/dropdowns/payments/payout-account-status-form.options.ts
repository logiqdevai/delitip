import {
  PayoutAccountStatuses,
  type PayoutAccountStatus,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";

export const PayoutAccountStatusFormOptions: {
  id: PayoutAccountStatus;
  labelKey: string;
}[] = [
  {
    id: PayoutAccountStatuses.PENDING,
    labelKey: "dashboard.enums.payoutAccountStatus.PENDING",
  },
  {
    id: PayoutAccountStatuses.ACTIVE,
    labelKey: "dashboard.enums.payoutAccountStatus.ACTIVE",
  },
  {
    id: PayoutAccountStatuses.RESTRICTED,
    labelKey: "dashboard.enums.payoutAccountStatus.RESTRICTED",
  },
  {
    id: PayoutAccountStatuses.DISABLED,
    labelKey: "dashboard.enums.payoutAccountStatus.DISABLED",
  },
];
