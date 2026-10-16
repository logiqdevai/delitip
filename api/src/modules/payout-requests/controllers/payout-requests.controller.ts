import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PayoutRequestsService } from '../services/payout-requests.service';
import { CreatePayoutRequestDto } from '../dto/create-payout-request.dto';
import { PayoutRequestsQuerySchema, PayoutRequestsQueryType } from '../dto/payout-requests-query.schema';

@ApiTags('Payout Requests')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/payout-requests')
export class PayoutRequestsController {
  constructor(private readonly payoutRequestsService: PayoutRequestsService) {}

  @Get('preview')
  @ApiOperation({
    summary: 'What the Store would be paid right now, the tips it covers, and the platform details to invoice',
  })
  preview(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
    return this.payoutRequestsService.preview(user, storeId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a payout request backed by an uploaded invoice (Owner only) — locks the eligible tips' })
  create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreatePayoutRequestDto) {
    return this.payoutRequestsService.create(user, storeId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List a Store's payout requests" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(PayoutRequestsQuerySchema)) query: PayoutRequestsQueryType,
  ) {
    return this.payoutRequestsService.findForStore(user, storeId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one payout request' })
  findOne(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
    return this.payoutRequestsService.findOneForStore(user, storeId, id);
  }

  @Get(':id/invoice-url')
  @ApiOperation({ summary: 'Short-lived signed URL to view the uploaded invoice' })
  invoiceUrl(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
    return this.payoutRequestsService.getInvoiceUrlForStore(user, storeId, id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a request still awaiting review and release its tips (Owner only)' })
  cancel(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
    return this.payoutRequestsService.cancel(user, storeId, id);
  }
}
