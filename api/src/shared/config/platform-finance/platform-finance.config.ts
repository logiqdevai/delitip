import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_COMMISSION_PERCENTAGE = 5;
const DEFAULT_PROCESSOR_FEE_ESTIMATE_PERCENTAGE = 1.5;
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

  getPayoutHoldWindowHours(): number {
    return (
      this.configService.get<number>('PAYOUT_HOLD_WINDOW_HOURS') ??
      DEFAULT_PAYOUT_HOLD_WINDOW_HOURS
    );
  }
}
