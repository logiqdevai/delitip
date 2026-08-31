import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { PayoutsController } from './controllers/payouts.controller';
import { PayoutsService } from './services/payouts.service';

@Module({
  imports: [PrismaModule, AccessControlModule, PlatformFinanceModule, VivaIntegrationModule],
  controllers: [PayoutsController],
  providers: [PayoutsService],
  exports: [PayoutsService],
})
export class PayoutsModule {}
