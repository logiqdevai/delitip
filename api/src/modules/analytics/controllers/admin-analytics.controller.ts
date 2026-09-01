import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AdminAnalyticsService } from '../services/admin-analytics.service';
import {
    AdminOverviewQuerySchema,
    AdminOverviewQueryType,
    AdminTrendsQuerySchema,
    AdminTrendsQueryType,
} from '../dto/admin-analytics-query.schema';

@ApiTags('Admin — Analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/analytics')
export class AdminAnalyticsController {
    constructor(private readonly adminAnalyticsService: AdminAnalyticsService) { }

    @Get('overview')
    @ApiOperation({ summary: 'Platform-wide top-line stats: users, revenue split by currency, fees, average tip' })
    @ApiQuery({ name: 'period', required: false, enum: ['today', '7d', '30d', '90d'] })
    overview(@Query(new ZodValidationPipe(AdminOverviewQuerySchema)) query: AdminOverviewQueryType) {
        return this.adminAnalyticsService.overview(query);
    }

    @Get('trends')
    @ApiOperation({ summary: 'Users or revenue over time, bucketed by day/week/month' })
    @ApiQuery({ name: 'metric', required: false, enum: ['users', 'tips_revenue', 'platform_revenue', 'employee_revenue', 'store_revenue'] })
    @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d', '90d'] })
    @ApiQuery({ name: 'group_by', required: false, enum: ['day', 'week', 'month'] })
    @ApiQuery({ name: 'currency', required: false })
    trends(@Query(new ZodValidationPipe(AdminTrendsQuerySchema)) query: AdminTrendsQueryType) {
        return this.adminAnalyticsService.trends(query);
    }
}
