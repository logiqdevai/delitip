import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import type {
  DistributionRecipientType,
  PayoutStatus,
} from "@/features/tips/interfaces/tips.interfaces";
import type {
  PayoutAccount,
  PaymentProvider,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";

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

export interface PayoutStoreRef {
  id: string;
  name: string;
  slug: string;
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
  // Only present on admin-wide listings/detail (GET /admin/payouts) — store-
  // scoped listings already imply the store.
  store?: PayoutStoreRef | null;
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

export interface PayoutPreviewRecipient {
  recipient_type: DistributionRecipientType;
  employee_id?: string;
  name: string;
  amount: number;
  currency: Currency;
  will_be_paid: boolean;
  skip_reason?: PayoutSkipReason;
}

export interface PayoutPreview {
  total_amount: number;
  recipients: PayoutPreviewRecipient[];
}

export interface PayoutsQuery {
  page?: number;
  limit?: number;
}

export interface DistributionTipRef {
  id: string;
  amount: number;
  paid_at?: string | null;
  currency: Currency;
}

export const DistributionHoldReasons = {
  HOLD_WINDOW: "HOLD_WINDOW",
  FEE_NOT_CONFIRMED: "FEE_NOT_CONFIRMED",
} as const;
export type DistributionHoldReason =
  (typeof DistributionHoldReasons)[keyof typeof DistributionHoldReasons];

export interface Distribution {
  id: string;
  tip_id: string;
  recipient_type: DistributionRecipientType;
  employee_id?: string | null;
  employee?: PayoutEmployeeRef | null;
  amount: number;
  percentage: number;
  payout_status: PayoutStatus;
  payout_id?: string | null;
  paid_out_at?: string | null;
  created_at: string;
  eligible_now: boolean;
  // Why it isn't payable yet: HOLD_WINDOW has a knowable ETA (eligible_at);
  // FEE_NOT_CONFIRMED depends on Viva's own settlement webhook, which has
  // no predictable timing, so eligible_at stays null for that reason.
  hold_reason: DistributionHoldReason | null;
  eligible_at?: string | null;
  tip: DistributionTipRef;
}

export interface DistributionsSummary {
  pending_total_amount: number;
  eligible_total_amount: number;
  hold_window_hours: number;
  next_eligible_at: string | null;
}

export interface DistributionsQuery {
  page?: number;
  limit?: number;
  payout_status?: PayoutStatus;
  recipient_type?: DistributionRecipientType;
  employee_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface AdminPayoutsQuery {
  page?: number;
  limit?: number;
  store_id?: string;
  recipient_type?: DistributionRecipientType;
  status?: PayoutExecutionStatus;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface PayoutDetail extends Payout {
  payout_account: PayoutAccount;
  distributions: Distribution[];
}

export type DistributionsResponse = PaginatedResponse<Distribution> & {
  summary: DistributionsSummary;
};
