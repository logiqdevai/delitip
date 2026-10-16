import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';

export const APP_CONFIG_ID = 'default';

// Rationale for the processor fee defaults: placeholder until Viva confirms a
// real per-transaction fee (via the 1799 webhook or Data Services, neither
// reliably available yet — see PaymentWebhooksService/
// PaymentsReconciliationService). Solved from three real settled demo
// transactions' Viva dashboard entries on 2026-09-02 (€5→€4.64, €10→€9.52,
// €20→€19.28 paid to account — all three fit `2.4% + €0.24` exactly, not a
// flat rate): €10 gave 4.8% and €20 gave 3.6%, which only makes sense with a
// fixed component included.
//
// The values themselves live in the `app_config` singleton row (editable by
// ADMIN / SUPER_ADMIN); these are only the seed values if the row is missing.
export const APP_CONFIG_DEFAULTS = {
  tip_platform_commission_percentage: 5,
  tip_processor_fee_estimate_percentage: 2.4,
  tip_processor_fee_estimate_fixed_amount: 24, // minor units (€0.24)
  payout_hold_window_hours: 48,
  vat_rate_percentage: 0,
  payout_invoice_required: false,
  payout_invoice_ai_check_enabled: true,
  connected_account_payouts_enabled: false,
};

export interface PlatformInvoiceDetails {
  legal_name: string | null;
  vat_number: string | null;
  tax_office: string | null;
  address: string | null;
  instructions: string | null;
}

@Injectable()
export class PlatformFinanceConfig {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async getAppConfig() {
    const row = await this.prisma.appConfig.findUnique({
      where: { id: APP_CONFIG_ID },
    });
    return row ?? this.prisma.appConfig.upsert({
      where: { id: APP_CONFIG_ID },
      create: { id: APP_CONFIG_ID },
      update: {},
    });
  }

  async getCommissionPercentage(): Promise<number> {
    return Number((await this.getAppConfig()).tip_platform_commission_percentage);
  }

  async getProcessorFeeEstimatePercentage(): Promise<number> {
    return Number((await this.getAppConfig()).tip_processor_fee_estimate_percentage);
  }

  // Minor units (e.g. 24 = €0.24) — added to the percentage-based estimate,
  // not a replacement for it. Viva's real per-transaction fee is `% + fixed`,
  // not a flat rate.
  async getProcessorFeeEstimateFixedAmount(): Promise<number> {
    return (await this.getAppConfig()).tip_processor_fee_estimate_fixed_amount;
  }

  async getPayoutHoldWindowHours(): Promise<number> {
    return (await this.getAppConfig()).payout_hold_window_hours;
  }

  // Added on top of the net tip at checkout — 0 means no VAT. Never defaults
  // to a country rate automatically.
  async getVatRatePercentage(): Promise<number> {
    return Number((await this.getAppConfig()).vat_rate_percentage);
  }

  // When on, a Store's own money (STORE shares + pooled VIA_STORE staff
  // shares) can only be paid through an admin-reviewed, invoice-backed
  // PayoutRequest. DIRECT employee shares are unaffected — they're not the
  // Store's money and no invoice covers them.
  async isPayoutInvoiceRequired(): Promise<boolean> {
    return (await this.getAppConfig()).payout_invoice_required;
  }

  async isPayoutInvoiceAiCheckEnabled(): Promise<boolean> {
    return (await this.getAppConfig()).payout_invoice_ai_check_enabled;
  }

  // The platform's own invoicing identity — what a Store puts on the invoice
  // it issues for a payout request.
  async getPlatformInvoiceDetails(): Promise<PlatformInvoiceDetails> {
    const config = await this.getAppConfig();
    return {
      legal_name: config.platform_legal_name,
      vat_number: config.platform_vat_number,
      tax_office: config.platform_tax_office,
      address: config.platform_address,
      instructions: config.payout_invoice_instructions,
    };
  }

  // Central rollout switch for connected-account (Marketplace) Store
  // payouts, gated off by default — flip on only once real platform
  // credentials exist and a sandbox onboarding has been verified end-to-end.
  async isConnectedAccountPayoutsEnabled(): Promise<boolean> {
    return (await this.getAppConfig()).connected_account_payouts_enabled;
  }
}
