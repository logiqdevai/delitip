import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import type { DistributionRecipientType } from "@/features/tips/interfaces/tips.interfaces";
import type { PaymentProvider } from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";

export const PayoutExecutionStatuses = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type PayoutExecutionStatus =
  (typeof PayoutExecutionStatuses)[keyof typeof PayoutExecutionStatuses];

export interface PayoutEmployeeRef {
  id: string;
  full_name: string;
}

export interface Payout {
  id: string;
  recipient_type: DistributionRecipientType;
  store_id?: string | null;
  employee_id?: string | null;
  payout_account_id: string;
  amount: number;
  currency: Currency;
  provider: PaymentProvider;
  provider_transfer_id?: string | null;
  status: PayoutExecutionStatus;
  failure_reason?: string | null;
  executed_at?: string | null;
  created_at: string;
  updated_at: string;
  employee?: PayoutEmployeeRef | null;
}

export const PayoutSkipReasons = {
  NO_PAYOUT_ACCOUNT: "NO_PAYOUT_ACCOUNT",
  ACCOUNT_NOT_ACTIVE: "ACCOUNT_NOT_ACTIVE",
  NO_LINKED_USER: "NO_LINKED_USER",
  TRANSFER_FAILED: "TRANSFER_FAILED",
} as const;
export type PayoutSkipReason =
  (typeof PayoutSkipReasons)[keyof typeof PayoutSkipReasons];

export interface SkippedPayoutRecipient {
  recipient_type: DistributionRecipientType;
  employee_id?: string;
  reason: PayoutSkipReason;
}

export interface RunPayoutPayload {
  employee_id?: string;
}

export interface RunPayoutResponse {
  payouts: Payout[];
  skipped_recipients: SkippedPayoutRecipient[];
}

export interface PayoutsQuery {
  page?: number;
  limit?: number;
}
