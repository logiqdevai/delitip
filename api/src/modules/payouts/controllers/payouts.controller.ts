import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PayoutsService } from '../services/payouts.service';
import { RunPayoutDto } from '../dto/run-payout.dto';
import { PayoutsQuerySchema, PayoutsQueryType } from '../dto/payouts-query.schema';
import { DistributionsQuerySchema, DistributionsQueryType } from '../dto/distributions-query.schema';

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get('stores/:storeId/payouts/preview')
  @ApiOperation({
    summary: "Preview what a 'Pay out now' run would do — per-recipient amounts and who'd be skipped, without executing anything",
  })
  preview(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
    return this.payoutsService.previewEligiblePayouts(user, storeId);
  }

  @Post('stores/:storeId/payouts/run')
  @ApiOperation({
    summary:
      "Manually pay out a Store's own share and all its employees' eligible pending distributions (Owner only)",
  })
  run(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Body() dto: RunPayoutDto,
  ) {
    return this.payoutsService.run(user, storeId, dto);
  }

  @Get('stores/:storeId/payouts')
  @ApiOperation({ summary: "List a Store's payout history" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findForStore(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(PayoutsQuerySchema)) query: PayoutsQueryType,
  ) {
    return this.payoutsService.findForStore(user, storeId, query);
  }

  @Get('stores/:storeId/distributions')
  @ApiOperation({ summary: "List a Store's tip distributions (pending, paid, etc.)" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'payout_status', required: false })
  @ApiQuery({ name: 'recipient_type', required: false })
  @ApiQuery({ name: 'employee_id', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  findDistributionsForStore(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(DistributionsQuerySchema)) query: DistributionsQueryType,
  ) {
    return this.payoutsService.findDistributionsForStore(user, storeId, query);
  }

  @Get('employees/:id/payouts')
  @ApiOperation({ summary: "List an Employee's payout history (self or store access)" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findForEmployee(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query(new ZodValidationPipe(PayoutsQuerySchema)) query: PayoutsQueryType,
  ) {
    return this.payoutsService.findForEmployee(user, id, query);
  }
}
