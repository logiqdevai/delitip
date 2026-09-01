import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from './shared/config/env/env.module';
import { UsersModule } from './modules/users/users.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { TipsModule } from './modules/tips/tips.module';
import { RefundsModule } from './modules/refunds/refunds.module';
import { StoresModule } from './modules/stores/stores.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { SpotsModule } from './modules/spots/spots.module';
import { DistributionRulesModule } from './modules/distribution-rules/distribution-rules.module';
import { QrCodesModule } from './modules/qr-codes/qr-codes.module';
import { PayoutAccountsModule } from './modules/payout-accounts/payout-accounts.module';
import { ReviewCategoriesModule } from './modules/review-categories/review-categories.module';
import { ReviewTagsModule } from './modules/review-tags/review-tags.module';
import { FeedbackQuestionsModule } from './modules/feedback-questions/feedback-questions.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { InsightsModule } from './modules/insights/insights.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VivaIntegrationModule } from './integrations/viva/viva.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { PayoutsModule } from './modules/payouts/payouts.module';

@Module({
  imports: [
    ConfigModule,
    // GraphQLModule,
    ScheduleModule.forRoot(),
    VivaIntegrationModule,
    AuthModule,
    HealthModule,
    UsersModule,
    DocumentsModule,
    OrganizationsModule,
    SubscriptionsModule,
    TipsModule,
    RefundsModule,
    StoresModule,
    EmployeesModule,
    SpotsModule,
    DistributionRulesModule,
    QrCodesModule,
    PayoutAccountsModule,
    ReviewCategoriesModule,
    ReviewTagsModule,
    FeedbackQuestionsModule,
    ReviewsModule,
    AlertsModule,
    InsightsModule,
    AnalyticsModule,
    PaymentsModule,
    PayoutsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
