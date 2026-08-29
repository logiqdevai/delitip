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
} as const;
export type PayoutStatus = (typeof PayoutStatuses)[keyof typeof PayoutStatuses];

export const PaymentProviders = {
  VIVA: "VIVA",
  STRIPE: "STRIPE",
  PAYPAL: "PAYPAL",
} as const;
export type PaymentProvider =
  (typeof PaymentProviders)[keyof typeof PaymentProviders];

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
  employee_ids?: string[];
  customer_email?: string;
  customer_name?: string;
}
