import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_COMMISSION_PERCENTAGE = 5;
// Placeholder until Viva confirms a real per-transaction fee (via the 1799
// webhook or Data Services, neither reliably available yet — see
// PaymentWebhooksService/PaymentsReconciliationService). Solved from three
// real settled demo transactions' Viva dashboard entries on 2026-09-02
// (€5→€4.64, €10→€9.52, €20→€19.28 paid to account — all three fit
// `2.4% + €0.24` exactly, not a flat rate): €10 gave 4.8% and €20 gave 3.6%,
// which only makes sense with a fixed component included.
const DEFAULT_PROCESSOR_FEE_ESTIMATE_PERCENTAGE = 2.4;
const DEFAULT_PROCESSOR_FEE_ESTIMATE_FIXED_AMOUNT = 24; // minor units (€0.24)
const DEFAULT_PAYOUT_HOLD_WINDOW_HOURS = 48;

@Injectable()
export class PlatformFinanceConfig {
  constructor(private readonly configService: ConfigService) {}

  getCommissionPercentage(): number {
    return (
      this.configService.get<number>('TIP_PLATFORM_COMMISSION_PERCENTAGE') ??
      DEFAULT_COMMISSION_PERCENTAGE
    );
  }

  getProcessorFeeEstimatePercentage(): number {
    return (
      this.configService.get<number>(
        'TIP_PROCESSOR_FEE_ESTIMATE_PERCENTAGE',
      ) ?? DEFAULT_PROCESSOR_FEE_ESTIMATE_PERCENTAGE
    );
  }

  // Minor units (e.g. 24 = €0.24) — added to the percentage-based estimate,
  // not a replacement for it. Viva's real per-transaction fee is `% + fixed`,
  // not a flat rate (see DEFAULT_PROCESSOR_FEE_ESTIMATE_FIXED_AMOUNT above).
  getProcessorFeeEstimateFixedAmount(): number {
    return (
      this.configService.get<number>(
        'TIP_PROCESSOR_FEE_ESTIMATE_FIXED_AMOUNT',
      ) ?? DEFAULT_PROCESSOR_FEE_ESTIMATE_FIXED_AMOUNT
    );
  }

  getPayoutHoldWindowHours(): number {
    return (
      this.configService.get<number>('PAYOUT_HOLD_WINDOW_HOURS') ??
      DEFAULT_PAYOUT_HOLD_WINDOW_HOURS
    );
  }
}
