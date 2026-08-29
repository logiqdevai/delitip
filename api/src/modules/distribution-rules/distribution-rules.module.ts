import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { DistributionRulesController } from './distribution-rules.controller';
import { DistributionRulesService } from './distribution-rules.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [DistributionRulesController],
    providers: [DistributionRulesService],
    exports: [DistributionRulesService],
})
export class DistributionRulesModule { }
