import type { Currency } from "@/features/stores/interfaces/stores.interfaces";
import type { PayoutExecutionStatus } from "@/features/payouts/interfaces/payouts.interfaces";
import type {
  DistributionRecipientType,
  PayoutStatus,
} from "@/features/tips/interfaces/tips.interfaces";
import type {
  PayoutAccountStatus,
  PayoutMethod,
} from "@/features/payout-accounts/interfaces/payout-accounts.interfaces";
import type { PaginatedResponse } from "@/interfaces/pagination.interfaces";

// No PAID/FAILED on purpose: "paid" is derived from `payout.status`, and a
// failed bank transfer keeps the request PENDING_REVIEW with `failure_reason`.
export const PayoutRequestStatuses = {
  PENDING_REVIEW: "PENDING_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;
export type PayoutRequestStatus =
  (typeof PayoutRequestStatuses)[keyof typeof PayoutRequestStatuses];

export const InvoiceCheckStatuses = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  SKIPPED: "SKIPPED",
} as const;
export type InvoiceCheckStatus =
  (typeof InvoiceCheckStatuses)[keyof typeof InvoiceCheckStatuses];

export const InvoiceCheckVerdicts = {
  MATCH: "MATCH",
  MISMATCH: "MISMATCH",
  UNREADABLE: "UNREADABLE",
} as const;
export type InvoiceCheckVerdict =
  (typeof InvoiceCheckVerdicts)[keyof typeof InvoiceCheckVerdicts];

export const InvoiceCheckIssues = {
  NOT_AN_INVOICE: "NOT_AN_INVOICE",
  NET_MISSING: "NET_MISSING",
  NET_MISMATCH: "NET_MISMATCH",
  NET_ROUNDING: "NET_ROUNDING",
  CURRENCY_MISMATCH: "CURRENCY_MISMATCH",
  ISSUER_VAT_MISMATCH: "ISSUER_VAT_MISMATCH",
  ISSUER_VAT_MISSING: "ISSUER_VAT_MISSING",
  ORG_VAT_MISSING: "ORG_VAT_MISSING",
  RECIPIENT_VAT_MISMATCH: "RECIPIENT_VAT_MISMATCH",
  INVOICE_NUMBER_MISMATCH: "INVOICE_NUMBER_MISMATCH",
  DATE_SUSPICIOUS: "DATE_SUSPICIOUS",
  NET_PLUS_VAT_MISMATCH: "NET_PLUS_VAT_MISMATCH",
} as const;
export type InvoiceCheckIssue =
  (typeof InvoiceCheckIssues)[keyof typeof InvoiceCheckIssues];

// Issues that make the verdict MISMATCH; the rest are advisory notes.
export const HardInvoiceCheckIssues: ReadonlySet<InvoiceCheckIssue> = new Set<InvoiceCheckIssue>([
  InvoiceCheckIssues.NET_MISMATCH,
  InvoiceCheckIssues.CURRENCY_MISMATCH,
  InvoiceCheckIssues.ISSUER_VAT_MISMATCH,
  InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH,
]);

// What the model read off the invoice. Amounts are in major units.
export interface InvoiceExtraction {
  is_invoice: boolean;
  issuer_name: string | null;
  issuer_vat_number: string | null;
  recipient_name: string | null;
  recipient_vat_number: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  currency: string | null;
  net_amount: number | null;
  vat_rate_percentage: number | null;
  vat_amount: number | null;
  total_amount: number | null;
  notes: string | null;
}

export interface PayoutRequestInvoiceDocument {
  id: string;
  mimetype: string;
  filename: string;
  size: number;
}

export interface PayoutRequestPayoutRef {
  id: string;
  status: PayoutExecutionStatus;
  executed_at?: string | null;
  provider_transfer_id?: string | null;
  failure_reason?: string | null;
}

export interface PayoutRequest {
  id: string;
  store_id: string;
  requested_by_user_id: string | null;
  status: PayoutRequestStatus;
  amount: number;
  own_share_amount: number;
  held_for_staff_amount: number;
  currency: Currency;
  distribution_count: number;
  period_from: string;
  period_to: string;
  hold_cutoff_at: string;
  invoice_document_id: string;
  invoice_number: string | null;
  store_note: string | null;
  failure_reason: string | null;
  check_status: InvoiceCheckStatus;
  check_verdict: InvoiceCheckVerdict | null;
  check_issues: InvoiceCheckIssue[] | null;
  check_extracted: InvoiceExtraction | { error: string } | null;
  check_model: string | null;
  // Prisma serialises Decimal columns as strings.
  check_cost_usd: string | number | null;
  checked_at: string | null;
  reviewed_by_user_id: string | null;
  reviewed_at: string | null;
  admin_note: string | null;
  payout_id: string | null;
  created_at: string;
  updated_at: string;
  invoice_document: PayoutRequestInvoiceDocument;
  payout: PayoutRequestPayoutRef | null;
}

export interface PayoutRequestStoreRef {
  id: string;
  name: string;
  slug: string;
}

export interface AdminPayoutRequest extends PayoutRequest {
  store: PayoutRequestStoreRef;
}

export interface PayoutRequestUserRef {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface PayoutRequestOrganizationRef {
  id: string;
  name: string;
  legal_name: string | null;
  vat_number: string | null;
  doy: string | null;
  profession: string | null;
  address_line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

export interface PayoutRequestDistribution {
  id: string;
  amount: number;
  recipient_type: DistributionRecipientType;
  employee_id: string | null;
  payout_status: PayoutStatus;
  payout_id: string | null;
  tip: {
    id: string;
    amount: number;
    paid_at: string | null;
    currency: Currency;
    status: string;
  };
}

// Live check of the frozen snapshot: a refund can cancel a locked tip after
// submission, in which case the invoice no longer matches what we'd pay.
export interface PayoutRequestIntegrity {
  locked_count: number;
  stale_count: number;
  live_amount: number;
  is_stale: boolean;
}

export interface AdminPayoutRequestDetail extends PayoutRequest {
  store: PayoutRequestStoreRef & {
    organization: PayoutRequestOrganizationRef;
    payout_account: {
      status: PayoutAccountStatus;
      payout_method: PayoutMethod;
      iban_last4: string | null;
      beneficiary_name: string | null;
    } | null;
  };
  requested_by: PayoutRequestUserRef | null;
  reviewed_by: PayoutRequestUserRef | null;
  distributions: PayoutRequestDistribution[];
  integrity: PayoutRequestIntegrity;
}

export interface PayoutRequestInvoiceTo {
  legal_name: string | null;
  vat_number: string | null;
  tax_office: string | null;
  address: string | null;
}

export interface OpenPayoutRequestSummary {
  id: string;
  amount: number;
  currency: Currency;
  created_at: string;
  failure_reason: string | null;
  check_status: InvoiceCheckStatus;
  check_verdict: InvoiceCheckVerdict | null;
}

// Everything the store needs before issuing an invoice.
export interface PayoutRequestPreview {
  policy_required: boolean;
  amount: number;
  own_share_amount: number;
  held_for_staff_amount: number;
  currency: Currency | null;
  distribution_count: number;
  period_from: string | null;
  period_to: string | null;
  hold_cutoff_at: string;
  hold_window_hours: number;
  already_paid_total_amount: number;
  last_paid_out_at: string | null;
  open_request: OpenPayoutRequestSummary | null;
  payout_account_status: PayoutAccountStatus | null;
  invoice_to: PayoutRequestInvoiceTo;
  instructions: string | null;
}

export interface CreatePayoutRequestPayload {
  invoice_document_id: string;
  invoice_number?: string;
  store_note?: string;
}

export interface ReviewPayoutRequestPayload {
  admin_note?: string;
}

export interface InvoiceUrlResponse {
  url: string;
  mimetype: string;
  expires_at: string;
}

export interface PayoutRequestsQuery {
  page?: number;
  limit?: number;
  status?: PayoutRequestStatus;
}

export interface AdminPayoutRequestsQuery extends PayoutRequestsQuery {
  store_id?: string;
  verdict?: InvoiceCheckVerdict;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export type PayoutRequestsResponse = PaginatedResponse<PayoutRequest>;
export type AdminPayoutRequestsResponse = PaginatedResponse<AdminPayoutRequest>;

export const INVOICE_ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;
export const INVOICE_MAX_SIZE_BYTES = 10 * 1024 * 1024;
