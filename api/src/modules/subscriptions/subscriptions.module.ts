import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './services/subscriptions.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [SubscriptionsController],
    providers: [SubscriptionsService],
})
export class SubscriptionsModule { }
