import { z } from "zod";

const percentage = z
  .number({ invalid_type_error: "Enter a number" })
  .min(0, "Must be at least 0")
  .max(100, "Must be at most 100");

export const appConfigSchema = z.object({
  tip_platform_commission_percentage: percentage,
  tip_processor_fee_estimate_percentage: percentage,
  vat_rate_percentage: percentage,
  tip_processor_fee_estimate_fixed_amount: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Must be a whole number")
    .min(0, "Must be at least 0"),
  payout_hold_window_hours: z
    .number({ invalid_type_error: "Enter a number" })
    .int("Must be a whole number")
    .min(0, "Must be at least 0"),
});

export type AppConfigFormData = z.infer<typeof appConfigSchema>;
