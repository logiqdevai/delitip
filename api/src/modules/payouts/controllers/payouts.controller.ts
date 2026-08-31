import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PayoutsService } from '../services/payouts.service';
import { RunPayoutDto } from '../dto/run-payout.dto';
import { PayoutsQuerySchema, PayoutsQueryType } from '../dto/payouts-query.schema';

@ApiTags('Payouts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

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
