import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { TipsModule } from '@/modules/tips/tips.module';
import { PayoutAccountsModule } from '@/modules/payout-accounts/payout-accounts.module';
import { VivaWebhooksController } from './controllers/viva-webhooks.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';
import { PaymentWebhooksService } from './services/payment-webhooks.service';
import { PaymentsReconciliationService } from './services/payments-reconciliation.service';

@Module({
  imports: [PrismaModule, PlatformFinanceModule, VivaIntegrationModule, TipsModule, PayoutAccountsModule],
  controllers: [VivaWebhooksController, AdminPaymentsController],
  providers: [PaymentWebhooksService, PaymentsReconciliationService],
  exports: [PaymentWebhooksService, PaymentsReconciliationService],
})
export class PaymentsModule {}
