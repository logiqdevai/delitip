import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AnalyticsService } from '../services/analytics.service';
import { DashboardQuerySchema, DashboardQueryType, PeriodQuerySchema, PeriodQueryType } from '../dto/dashboard-query.schema';
import { TrendsQuerySchema, TrendsQueryType } from '../dto/trends-query.schema';

@ApiTags('Analytics Dashboard')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('organizations/:organizationId/dashboard')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    @ApiOperation({ summary: 'Dashboard overview: tips, transactions, reviews, rating, employees recognized (§14)' })
    @ApiQuery({ name: 'store_id', required: false })
    @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d'] })
    overview(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Query(new ZodValidationPipe(DashboardQuerySchema)) query: DashboardQueryType,
    ) {
        return this.analyticsService.overview(user, organizationId, query);
    }

    @Get('trends')
    @ApiOperation({ summary: 'Tips/reviews/rating over time, bucketed by day/week/month (§14)' })
    @ApiQuery({ name: 'store_id', required: false })
    @ApiQuery({ name: 'metric', required: false, enum: ['tips', 'reviews', 'rating'] })
    @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
    @ApiQuery({ name: 'group_by', required: false, enum: ['day', 'week', 'month'] })
    trends(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Query(new ZodValidationPipe(TrendsQuerySchema)) query: TrendsQueryType,
    ) {
        return this.analyticsService.trends(user, organizationId, query);
    }

    @Get('employees-performance')
    @ApiOperation({ summary: 'Per-employee informational stats — not a ranking (§16)' })
    @ApiQuery({ name: 'store_id', required: false })
    @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d'] })
    employeesPerformance(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Query(new ZodValidationPipe(DashboardQuerySchema)) query: DashboardQueryType,
    ) {
        return this.analyticsService.employeesPerformance(user, organizationId, query);
    }

    @Get('stores-performance')
    @ApiOperation({ summary: 'Per-store rollup across every accessible store (§17)' })
    @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d'] })
    storesPerformance(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Query(new ZodValidationPipe(PeriodQuerySchema)) query: PeriodQueryType,
    ) {
        return this.analyticsService.storesPerformance(user, organizationId, query);
    }

    @Get('experience-score')
    @ApiOperation({ summary: 'Composite 0-100 experience score with a breakdown and explanation (§18)' })
    @ApiQuery({ name: 'store_id', required: false })
    @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d'] })
    experienceScore(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Query(new ZodValidationPipe(DashboardQuerySchema)) query: DashboardQueryType,
    ) {
        return this.analyticsService.experienceScore(user, organizationId, query);
    }
}
