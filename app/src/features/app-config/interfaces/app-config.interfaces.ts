// Prisma serialises Decimal columns as strings, so the percentages arrive as
// `string` from the API even though they are edited as numbers.
export interface AppConfig {
  id: string;
  tip_platform_commission_percentage: string | number;
  tip_processor_fee_estimate_percentage: string | number;
  tip_processor_fee_estimate_fixed_amount: number;
  payout_hold_window_hours: number;
  vat_rate_percentage: string | number;
  updated_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformVatRate {
  vat_rate_percentage: number;
}

export interface UpdateAppConfigPayload {
  tip_platform_commission_percentage: number;
  tip_processor_fee_estimate_percentage: number;
  tip_processor_fee_estimate_fixed_amount: number;
  payout_hold_window_hours: number;
  vat_rate_percentage: number;
}
