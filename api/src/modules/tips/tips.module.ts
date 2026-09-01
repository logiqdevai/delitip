import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { TipsController } from './tips.controller';
import { PublicTipsController } from './public-tips.controller';
import { TipsService } from './services/tips.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule, PlatformFinanceModule, VivaIntegrationModule],
    controllers: [TipsController, PublicTipsController],
    providers: [TipsService],
    exports: [TipsService],
})
export class TipsModule { }
