import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { TipsModule } from '@/modules/tips/tips.module';
import { PayoutAccountsModule } from '@/modules/payout-accounts/payout-accounts.module';
import { VivaWebhooksController } from './controllers/viva-webhooks.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';
import { AdminWebhookEventsController } from './controllers/admin-webhook-events.controller';
import { PaymentWebhooksService } from './services/payment-webhooks.service';
import { AdminWebhookEventsService } from './services/admin-webhook-events.service';
import { PaymentsReconciliationService } from './services/payments-reconciliation.service';

@Module({
  imports: [PrismaModule, PlatformFinanceModule, VivaIntegrationModule, TipsModule, PayoutAccountsModule],
  controllers: [VivaWebhooksController, AdminPaymentsController, AdminWebhookEventsController],
  providers: [PaymentWebhooksService, PaymentsReconciliationService, AdminWebhookEventsService],
  exports: [PaymentWebhooksService, PaymentsReconciliationService],
})
export class PaymentsModule {}
