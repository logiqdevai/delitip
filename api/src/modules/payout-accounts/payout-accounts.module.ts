import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { PlatformFinanceModule } from '@/shared/config/platform-finance/platform-finance.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { PayoutAccountsController } from './payout-accounts.controller';
import { UserPayoutAccountController } from './user-payout-account.controller';
import { EmployeePayoutAccountController } from './employee-payout-account.controller';
import { AdminPayoutAccountsController } from './admin-payout-accounts.controller';
import { PayoutAccountsService } from './payout-accounts.service';

@Module({
    imports: [PrismaModule, AccessControlModule, PlatformFinanceModule, VivaIntegrationModule],
    controllers: [
        PayoutAccountsController,
        UserPayoutAccountController,
        EmployeePayoutAccountController,
        AdminPayoutAccountsController,
    ],
    providers: [PayoutAccountsService],
    exports: [PayoutAccountsService],
})
export class PayoutAccountsModule { }
