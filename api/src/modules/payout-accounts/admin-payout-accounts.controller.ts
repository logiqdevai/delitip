import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { PayoutAccountsService } from './payout-accounts.service';

@ApiTags('Admin — Payout Accounts')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/payout-accounts')
export class AdminPayoutAccountsController {
    constructor(private readonly payoutAccountsService: PayoutAccountsService) { }

    @Post('reconcile')
    @ApiOperation({ summary: 'Manually trigger the PENDING payout account verification sweep, instead of waiting for the next scheduled run' })
    reconcile() {
        return this.payoutAccountsService.sweepPendingAccounts();
    }
}
