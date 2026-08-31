import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { PaymentsReconciliationService } from '../services/payments-reconciliation.service';

@ApiTags('Admin — Payments')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(private readonly reconciliationService: PaymentsReconciliationService) {}

  @Post('reconcile')
  @ApiOperation({ summary: 'Manually trigger the abandoned/expired-order reconciliation sweep' })
  reconcile() {
    return this.reconciliationService.sweep();
  }
}
