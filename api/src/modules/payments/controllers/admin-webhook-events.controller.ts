import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import {
  AdminWebhookEventsQuerySchema,
  AdminWebhookEventsQueryType,
} from '../dto/admin-webhook-events-query.schema';
import { AdminWebhookEventsService } from '../services/admin-webhook-events.service';

@ApiTags('Admin — Webhook events')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/webhook-events')
export class AdminWebhookEventsController {
  constructor(private readonly webhookEventsService: AdminWebhookEventsService) {}

  @Get()
  @ApiOperation({ summary: 'List received payment-provider webhook events' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'event_type_id', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['PROCESSED', 'FAILED', 'PENDING'] })
  @ApiQuery({ name: 'search', required: false, description: 'Message ID, error text, transaction ID or order code' })
  @ApiQuery({ name: 'date_from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'date_to', required: false, description: 'YYYY-MM-DD, inclusive' })
  findAll(@Query(new ZodValidationPipe(AdminWebhookEventsQuerySchema)) query: AdminWebhookEventsQueryType) {
    return this.webhookEventsService.findAll(query);
  }
}
