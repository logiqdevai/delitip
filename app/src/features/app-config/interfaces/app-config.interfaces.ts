// Prisma serialises Decimal columns as strings, so the percentages arrive as
// `string` from the API even though they are edited as numbers.
export interface AppConfig {
  id: string;
  tip_platform_commission_percentage: string | number;
  tip_processor_fee_estimate_percentage: string | number;
  tip_processor_fee_estimate_fixed_amount: number;
  payout_hold_window_hours: number;
  vat_rate_percentage: string | number;
  // Invoice-gated payouts
  payout_invoice_required: boolean;
  payout_invoice_ai_check_enabled: boolean;
  connected_account_payouts_enabled: boolean;
  platform_legal_name: string | null;
  platform_vat_number: string | null;
  platform_tax_office: string | null;
  platform_address: string | null;
  payout_invoice_instructions: string | null;
  updated_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformVatRate {
  vat_rate_percentage: number;
}

// Readable by any signed-in user: whether a store must submit an
// invoice-backed payout request, and who it should invoice.
export interface PayoutPolicy {
  payout_invoice_required: boolean;
  connected_account_payouts_enabled: boolean;
  invoice_to: {
    legal_name: string | null;
    vat_number: string | null;
    tax_office: string | null;
    address: string | null;
  };
  instructions: string | null;
}

interface AppConfigEditableFields {
  tip_platform_commission_percentage: number;
  tip_processor_fee_estimate_percentage: number;
  tip_processor_fee_estimate_fixed_amount: number;
  payout_hold_window_hours: number;
  vat_rate_percentage: number;
  payout_invoice_required: boolean;
  payout_invoice_ai_check_enabled: boolean;
  connected_account_payouts_enabled: boolean;
  platform_legal_name: string;
  platform_vat_number: string;
  platform_tax_office: string;
  platform_address: string;
  payout_invoice_instructions: string;
}

// The API treats every field as optional, so only changed fields are sent.
export type UpdateAppConfigPayload = Partial<AppConfigEditableFields>;
