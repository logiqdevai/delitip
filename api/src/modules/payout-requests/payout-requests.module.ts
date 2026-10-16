import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { AiIntegrationModule } from '@/integrations/ai/ai.module';
import { ResendModule } from '@/integrations/notifications/resend/resend.module';
import { PayoutsModule } from '@/modules/payouts/payouts.module';
import { PayoutRequestsController } from './controllers/payout-requests.controller';
import { AdminPayoutRequestsController } from './controllers/admin-payout-requests.controller';
import { PayoutRequestsService } from './services/payout-requests.service';
import { InvoiceVerificationService } from './services/invoice-verification.service';
import { PayoutRequestNotificationsService } from './services/payout-request-notifications.service';

@Module({
  imports: [
    PrismaModule,
    AccessControlModule,
    PlatformFinanceModule,
    VivaIntegrationModule,
    GcsIntegrationModule,
    AiIntegrationModule,
    ResendModule,
    PayoutsModule,
  ],
  controllers: [PayoutRequestsController, AdminPayoutRequestsController],
  providers: [PayoutRequestsService, InvoiceVerificationService, PayoutRequestNotificationsService],
  exports: [PayoutRequestsService],
})
export class PayoutRequestsModule {}
