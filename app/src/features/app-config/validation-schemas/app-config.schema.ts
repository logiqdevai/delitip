import { z } from "zod";
import { vmsg } from "@/lib/validation-message";

const percentage = z
  .number({ invalid_type_error: vmsg("enterNumber") })
  .min(0, vmsg("minValue", { min: 0 }))
  .max(100, vmsg("maxValue", { max: 100 }));

const optionalText = (max: number) =>
  z.string().trim().max(max, vmsg("maxChars", { max }));

export const appConfigSchema = z.object({
  tip_platform_commission_percentage: percentage,
  tip_processor_fee_estimate_percentage: percentage,
  vat_rate_percentage: percentage,
  tip_processor_fee_estimate_fixed_amount: z
    .number({ invalid_type_error: vmsg("enterNumber") })
    .int(vmsg("wholeNumber"))
    .min(0, vmsg("minValue", { min: 0 })),
  payout_hold_window_hours: z
    .number({ invalid_type_error: vmsg("enterNumber") })
    .int(vmsg("wholeNumber"))
    .min(0, vmsg("minValue", { min: 0 })),
  payout_invoice_required: z.boolean(),
  payout_invoice_ai_check_enabled: z.boolean(),
  connected_account_payouts_enabled: z.boolean(),
  tip_payouts_store_only: z.boolean(),
  platform_legal_name: optionalText(200),
  platform_vat_number: optionalText(40),
  platform_tax_office: optionalText(120),
  platform_address: optionalText(300),
  payout_invoice_instructions: optionalText(2000),
});

export type AppConfigFormData = z.infer<typeof appConfigSchema>;
