import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { PayoutAccountsService } from './payout-accounts.service';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { UpdatePayoutAccountDto } from './dto/update-payout-account.dto';

@ApiTags('Payout Accounts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('employees/:employeeId/payout-account')
export class EmployeePayoutAccountController {
    constructor(private readonly payoutAccountsService: PayoutAccountsService) { }

    @Post()
    @ApiOperation({ summary: "Link an Employee's IBAN payout account on their behalf (Store Owner only)" })
    create(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string, @Body() dto: CreatePayoutAccountDto) {
        return this.payoutAccountsService.createForEmployee(user, employeeId, dto);
    }

    @Get()
    @ApiOperation({ summary: "Get an Employee's payout account (Store Owner only)" })
    findOne(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string) {
        return this.payoutAccountsService.findForEmployee(user, employeeId);
    }

    @Patch()
    @ApiOperation({ summary: "Update an Employee's payout account beneficiary/friendly name (Store Owner only)" })
    update(
        @CurrentUser() user: AuthUser,
        @Param('employeeId') employeeId: string,
        @Body() dto: UpdatePayoutAccountDto,
    ) {
        return this.payoutAccountsService.updateForEmployee(user, employeeId, dto);
    }

    @Post('refresh-status')
    @ApiOperation({ summary: "Check Viva for an Employee's payout account verification status now (Store Owner only)" })
    refreshStatus(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string) {
        return this.payoutAccountsService.refreshStatusForEmployee(user, employeeId);
    }
}
