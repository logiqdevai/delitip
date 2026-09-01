import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { AnalyticsController } from './controllers/analytics.controller';
import { StoreAnalyticsController } from './controllers/store-analytics.controller';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { StoreAnalyticsService } from './services/store-analytics.service';
import { AdminAnalyticsService } from './services/admin-analytics.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [AnalyticsController, StoreAnalyticsController, AdminAnalyticsController],
    providers: [AnalyticsService, StoreAnalyticsService, AdminAnalyticsService],
    exports: [AnalyticsService, StoreAnalyticsService, AdminAnalyticsService],
})
export class AnalyticsModule { }
