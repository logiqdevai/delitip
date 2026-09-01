import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { RefundsController } from './refunds.controller';
import { PublicRefundsController } from './public-refunds.controller';
import { RefundsService } from './services/refunds.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule, VivaIntegrationModule],
    controllers: [RefundsController, PublicRefundsController],
    providers: [RefundsService],
    exports: [RefundsService],
})
export class RefundsModule { }
