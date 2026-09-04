import type { Currency } from "@/features/stores/interfaces/stores.interfaces";

export const TipStatuses = {
  PENDING: "PENDING",
  CREATED: "CREATED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;
export type TipStatus = (typeof TipStatuses)[keyof typeof TipStatuses];

export const PayoutStatuses = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
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

export interface TipStoreRef {
  id: string;
  name: string;
  slug: string;
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

export const PaymentTransactionStatuses = {
  CREATED: "CREATED",
  PROCESSING: "PROCESSING",
  SUCCEEDED: "SUCCEEDED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;
export type PaymentTransactionStatus =
  (typeof PaymentTransactionStatuses)[keyof typeof PaymentTransactionStatuses];

// Only present on GET /tips/:id when the viewer is OWNER/ACCOUNTANT (or a
// platform admin) — omitted entirely otherwise.
export interface PaymentTransaction {
  id: string;
  provider: PaymentProvider;
  provider_order_code?: string | null;
  provider_transaction_id?: string | null;
  tip_amount: number;
  vat_rate_percentage?: number | null;
  vat_amount?: number | null;
  gross_amount: number;
  currency: Currency;
  commission_percentage_used: number;
  commission_amount: number;
  platform_fee_percentage: number;
  processor_fee_percentage_used?: number | null;
  processor_fee_estimated?: number | null;
  processor_fee_confirmed_amount?: number | null;
  processor_fee_confirmed: boolean;
  payment_fee_percentage?: number | null;
  total_fee_amount?: number | null;
  total_fee_percentage?: number | null;
  total_fee_percentage_sum?: number | null;
  net_distributable_amount?: number | null;
  payment_method?: string | null;
  status: PaymentTransactionStatus;
  failure_reason?: string | null;
  confirmed_at?: string | null;
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
  payment_transaction?: PaymentTransaction | null;
  // Only present on admin-wide listings/detail (GET /admin/payments, GET /tips/:id) —
  // store-scoped listings already imply the store.
  store?: TipStoreRef | null;
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

export type TipsExportQuery = Omit<TipsQuery, "page" | "limit">;

export interface AdminTipsQuery {
  page?: number;
  limit?: number;
  store_id?: string;
  status?: TipStatus;
  search?: string;
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
  // Generated once per checkout attempt so a network retry of "Pay" never
  // opens a second Viva order for the same intended tip.
  client_request_id?: string;
}

// POST /public/tips no longer completes the tip synchronously — it opens a
// Viva Smart Checkout order and returns where to redirect the customer.
export interface CreatePublicTipResponse {
  tip_id: string;
  checkout_url: string;
}

export interface PublicTipStatusDistributionLine {
  recipient_type: DistributionRecipientType;
  employee?: TipEmployeeRef | null;
  amount: number;
  percentage: number;
}

// GET /public/tips/:id/status — polled by the checkout-return flow to
// resolve the outcome once the customer comes back from Viva.
export interface PublicTipStatus {
  id: string;
  status: TipStatus;
  amount: number;
  currency: Currency;
  employee?: TipEmployeeRef | null;
  order_code: string | null;
  distribution_summary?: PublicTipStatusDistributionLine[];
  thank_you_message?: string;
}

// GET /public/tips/by-order-code/:orderCode — the checkout-return page's
// fallback when sessionStorage isn't available (different device, cleared
// storage): resolves Viva's own "s" redirect param back to our tip.
export interface PublicTipOrderCodeLookup {
  tip_id: string;
  store_slug: string;
  qr_code: string;
}
