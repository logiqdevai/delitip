import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { AlertsService } from '../services/alerts.service';
import { AlertsQuerySchema, AlertsQueryType } from '../dto/alerts-query.schema';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/alerts')
export class AlertsController {
    constructor(private readonly alertsService: AlertsService) { }

    @Get()
    @ApiOperation({ summary: "List a Store's triggered alerts, paginated" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'is_read', required: false })
    @ApiQuery({ name: 'type', required: false })
    @ApiQuery({ name: 'employee_id', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(AlertsQuerySchema)) query: AlertsQueryType,
    ) {
        return this.alertsService.findAll(user, storeId, query);
    }

    @Patch('read-all')
    @ApiOperation({ summary: "Mark every unread alert for a Store as read" })
    markAllRead(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
        return this.alertsService.markAllRead(user, storeId);
    }
}
