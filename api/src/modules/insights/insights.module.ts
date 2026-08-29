import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [InsightsController],
    providers: [InsightsService],
    exports: [InsightsService],
})
export class InsightsModule { }
