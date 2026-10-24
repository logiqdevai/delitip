import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PayoutsService } from '../services/payouts.service';
import { AdminPayoutsQuerySchema, AdminPayoutsQueryType } from '../dto/admin-payouts-query.schema';
import { ManualPayoutSchema, ManualPayoutType } from '../dto/manual-payout.schema';

@ApiTags('Admin — Payouts')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/payouts')
export class AdminPayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  @ApiOperation({ summary: 'List every payout across all stores and employees' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'store_id', required: false })
  @ApiQuery({ name: 'recipient_type', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  findAll(@Query(new ZodValidationPipe(AdminPayoutsQuerySchema)) query: AdminPayoutsQueryType) {
    return this.payoutsService.findAllAdmin(query);
  }

  @Post('manual')
  @ApiOperation({
    summary: 'Pay out the selected tips now, skipping the hold window (fee must still be confirmed)',
  })
  runManual(@Body(new ZodValidationPipe(ManualPayoutSchema)) body: ManualPayoutType) {
    return this.payoutsService.runManualForTips(body.tip_ids);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single payout and its distribution breakdown' })
  findOne(@Param('id') id: string) {
    return this.payoutsService.findOneAdmin(id);
  }
}
