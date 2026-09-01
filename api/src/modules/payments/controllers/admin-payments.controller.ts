import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { TipsService } from '@/modules/tips/services/tips.service';
import { AdminTipsQuerySchema, AdminTipsQueryType } from '@/modules/tips/dto/admin-tips-query.schema';
import { PaymentsReconciliationService } from '../services/payments-reconciliation.service';

@ApiTags('Admin — Payments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(
    private readonly reconciliationService: PaymentsReconciliationService,
    private readonly tipsService: TipsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List every payment (tip) across all stores' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'store_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  findAll(@Query(new ZodValidationPipe(AdminTipsQuerySchema)) query: AdminTipsQueryType) {
    return this.tipsService.findAllAdmin(query);
  }

  @Post('reconcile')
  @ApiOperation({ summary: 'Manually trigger the abandoned/expired-order reconciliation sweep' })
  reconcile() {
    return this.reconciliationService.sweep();
  }
}
