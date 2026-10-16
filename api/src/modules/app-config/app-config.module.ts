import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';
import { PlatformVatController } from './platform-vat.controller';
import { PlatformPayoutPolicyController } from './platform-payout-policy.controller';

@Module({
    imports: [PrismaModule, PlatformFinanceModule],
    controllers: [AppConfigController, PlatformVatController, PlatformPayoutPolicyController],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule { }
