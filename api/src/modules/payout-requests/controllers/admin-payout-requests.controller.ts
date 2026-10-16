import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PayoutRequestsService } from '../services/payout-requests.service';
import { ApprovePayoutRequestDto, RejectPayoutRequestDto } from '../dto/review-payout-request.dto';
import {
  AdminPayoutRequestsQuerySchema,
  AdminPayoutRequestsQueryType,
} from '../dto/admin-payout-requests-query.schema';

@ApiTags('Admin — Payout Requests')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/payout-requests')
export class AdminPayoutRequestsController {
  constructor(private readonly payoutRequestsService: PayoutRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'List payout requests across all stores' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'store_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'verdict', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  findAll(@Query(new ZodValidationPipe(AdminPayoutRequestsQuerySchema)) query: AdminPayoutRequestsQueryType) {
    return this.payoutRequestsService.findAllAdmin(query);
  }

  @Get('pending-count')
  @ApiOperation({ summary: 'How many requests are awaiting review' })
  pendingCount() {
    return this.payoutRequestsService.pendingCountAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Full detail: invoice, automatic check, locked tips and live integrity' })
  findOne(@Param('id') id: string) {
    return this.payoutRequestsService.findOneAdmin(id);
  }

  @Get(':id/invoice-url')
  @ApiOperation({ summary: 'Short-lived signed URL to view the uploaded invoice' })
  invoiceUrl(@Param('id') id: string) {
    return this.payoutRequestsService.getInvoiceUrlAdmin(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: 'Approve and pay: executes the Viva transfer for the locked tips' })
  approve(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: ApprovePayoutRequestDto) {
    return this.payoutRequestsService.approve(user, id, dto);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: 'Reject with a note and release the locked tips so the store can resubmit' })
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: RejectPayoutRequestDto) {
    return this.payoutRequestsService.reject(user, id, dto);
  }

  @Post(':id/recheck')
  @ApiOperation({ summary: 'Re-run the automatic invoice read' })
  recheck(@Param('id') id: string) {
    return this.payoutRequestsService.recheck(id);
  }
}
