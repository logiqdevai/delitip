import { Body, Controller, Get, Header, Param, Post, Query, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { SettlementsService } from '../services/settlements.service';
import { CreateSettlementDto } from '../dto/create-settlement.dto';
import {
  OwedDistributionsQuerySchema,
  OwedDistributionsQueryType,
  SettlementBalancesQuerySchema,
  SettlementBalancesQueryType,
  SettlementsExportQuerySchema,
  SettlementsExportQueryType,
  SettlementsQuerySchema,
  SettlementsQueryType,
} from '../dto/settlements-query.schema';

@ApiTags('Settlements')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Get('stores/:storeId/settlements/balances')
  @ApiOperation({
    summary: 'What the Store owes each employee for tips it collected on their behalf',
  })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  @ApiQuery({ name: 'include_settled', required: false })
  balances(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(SettlementBalancesQuerySchema)) query: SettlementBalancesQueryType,
  ) {
    return this.settlementsService.balances(user, storeId, query);
  }

  @Get('stores/:storeId/settlements/owed-distributions')
  @ApiOperation({ summary: "The individual owed shares behind one employee's balance" })
  @ApiQuery({ name: 'employee_id', required: true })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  owedDistributions(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(OwedDistributionsQuerySchema)) query: OwedDistributionsQueryType,
  ) {
    return this.settlementsService.owedDistributions(user, storeId, query);
  }

  @Get('stores/:storeId/settlements/adjustments')
  @ApiOperation({ summary: 'Deductions proposed against what the Store owes an employee' })
  @ApiQuery({ name: 'employee_id', required: true })
  proposedAdjustments(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query('employee_id') employeeId: string,
  ) {
    return this.settlementsService.proposedAdjustments(user, storeId, employeeId);
  }

  @Get('stores/:storeId/settlements/export')
  @ApiOperation({ summary: "Export a Store's staff balances as CSV" })
  @ApiProduces('text/csv')
  @ApiQuery({ name: 'employee_id', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(SettlementsExportQuerySchema)) query: SettlementsExportQueryType,
  ) {
    const { csv, filename } = await this.settlementsService.exportCsv(user, storeId, query);
    return new StreamableFile(Buffer.from(csv, 'utf-8'), {
      type: 'text/csv; charset=utf-8',
      disposition: `attachment; filename="${filename}"`,
    });
  }

  @Get('stores/:storeId/settlements')
  @ApiOperation({ summary: 'Handovers a Store has recorded' })
  @ApiQuery({ name: 'employee_id', required: false })
  @ApiQuery({ name: 'date_from', required: false })
  @ApiQuery({ name: 'date_to', required: false })
  @ApiQuery({ name: 'unconfirmed_only', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findForStore(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Query(new ZodValidationPipe(SettlementsQuerySchema)) query: SettlementsQueryType,
  ) {
    return this.settlementsService.findForStore(user, storeId, query);
  }

  @Post('stores/:storeId/settlements')
  @ApiOperation({
    summary: 'Record that a Store handed an employee their share (Owner/Store Manager/Accountant)',
  })
  create(
    @CurrentUser() user: AuthUser,
    @Param('storeId') storeId: string,
    @Body() dto: CreateSettlementDto,
  ) {
    return this.settlementsService.create(user, storeId, dto);
  }

  @Post('settlements/:id/reverse')
  @ApiOperation({ summary: 'Reverse a recorded handover, returning its shares to owed' })
  reverse(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.settlementsService.reverse(user, id);
  }

  @Post('settlements/:id/confirm')
  @ApiOperation({ summary: 'Employee confirms they received a handover (the employee only)' })
  confirm(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.settlementsService.confirm(user, id);
  }

  @Get('employees/:id/settlements')
  @ApiOperation({ summary: "Handovers recorded for one employee" })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findForEmployee(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query(new ZodValidationPipe(SettlementsQuerySchema)) query: SettlementsQueryType,
  ) {
    return this.settlementsService.findForEmployee(user, id, query);
  }

  @Get('employees/:id/settlement-balance')
  @ApiOperation({ summary: 'What an employee is still owed by their Store' })
  employeeBalance(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.settlementsService.employeeBalance(user, id);
  }
}
