import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { StoreAnalyticsService } from '../services/store-analytics.service';
import { StoreTipsAnalyticsQuerySchema, StoreTipsAnalyticsQueryType } from '../dto/store-tips-analytics-query.schema';

@ApiTags('Store Analytics')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/analytics')
export class StoreAnalyticsController {
    constructor(private readonly storeAnalyticsService: StoreAnalyticsService) { }

    @Get('tips')
    @ApiOperation({ summary: 'Detailed tip analytics for a Store with filters and grouping (§15)' })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    @ApiQuery({ name: 'employee_id', required: false })
    @ApiQuery({ name: 'qr_code_id', required: false })
    @ApiQuery({ name: 'group_by', required: false, enum: ['day', 'week', 'month', 'employee', 'store'] })
    tips(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(StoreTipsAnalyticsQuerySchema)) query: StoreTipsAnalyticsQueryType,
    ) {
        return this.storeAnalyticsService.tips(user, storeId, query);
    }
}
