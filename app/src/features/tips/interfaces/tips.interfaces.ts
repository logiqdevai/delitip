import type { Currency } from "@/features/stores/interfaces/stores.interfaces";

export const TipStatuses = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type TipStatus = (typeof TipStatuses)[keyof typeof TipStatuses];

export const PayoutStatuses = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type PayoutStatus = (typeof PayoutStatuses)[keyof typeof PayoutStatuses];

export const PaymentProviders = {
  VIVA: "VIVA",
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
} as const;
export type PaymentProvider =
  (typeof PaymentProviders)[keyof typeof PaymentProviders];

export const DistributionRecipientTypes = {
  STORE: "STORE",
  EMPLOYEE: "EMPLOYEE",
} as const;
export type DistributionRecipientType =
  (typeof DistributionRecipientTypes)[keyof typeof DistributionRecipientTypes];

export interface TipDistributionEmployeeRef {
  id: string;
  full_name: string;
}

export interface TipDistribution {
  id: string;
  tip_id: string;
  recipient_type: DistributionRecipientType;
  employee_id?: string | null;
  employee?: TipDistributionEmployeeRef | null;
  amount: number;
  percentage: number;
  payout_status: PayoutStatus;
  paid_out_at?: string | null;
  created_at: string;
}

export interface TipEmployeeRef {
  id: string;
  full_name: string;
}

export interface TipQrCodeRef {
  id: string;
  label: string;
}

export interface TipDistributionRuleRef {
  id: string;
  name: string;
}

export const RefundStatuses = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
} as const;
export type RefundStatus =
  (typeof RefundStatuses)[keyof typeof RefundStatuses];

export interface TipRefund {
  id: string;
  tip_id: string;
  amount: number;
  reason?: string | null;
  status: RefundStatus;
  created_at: string;
  updated_at: string;
}

export interface TipReviewRef {
  id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
}

export interface Tip {
  id: string;
  store_id: string;
  qr_code_id: string;
  employee_id?: string | null;
  distribution_rule_id?: string | null;
  customer_user_id?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  amount: number;
  currency: Currency;
  status: TipStatus;
  payment_provider?: PaymentProvider | null;
  payment_reference?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
  employee?: TipEmployeeRef | null;
  qr_code?: TipQrCodeRef | null;
  distribution_rule?: TipDistributionRuleRef | null;
  distributions?: TipDistribution[];
  review?: TipReviewRef | null;
  refunds?: TipRefund[];
}

export interface EmployeeTipDistribution extends TipDistribution {
  tip: {
    amount: number;
    currency: Currency;
    created_at: string;
    store_id: string;
  };
}

export interface TipsQuery {
  page?: number;
  limit?: number;
  employee_id?: string;
  qr_code_id?: string;
  status?: TipStatus;
  date_from?: string;
  date_to?: string;
}

export interface CreatePublicTipPayload {
  qr_code_id: string;
  amount: number;
  currency?: Currency;
  employee_id?: string;
  employee_ids?: string[];
  customer_email?: string;
  customer_name?: string;
}

export interface CreatePublicTipResponse {
  tip: Tip;
  thank_you_message: string;
}
