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
@Controller('stores/:storeId/payout-account')
export class PayoutAccountsController {
    constructor(private readonly payoutAccountsService: PayoutAccountsService) { }

    @Post()
    @ApiOperation({ summary: "Connect a Store's payout account (mocked — instantly ACTIVE, Owner only)" })
    create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreatePayoutAccountDto) {
        return this.payoutAccountsService.createForStore(user, storeId, dto);
    }

    @Get()
    @ApiOperation({ summary: "Get a Store's payout account" })
    findOne(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
        return this.payoutAccountsService.findForStore(user, storeId);
    }

    @Patch()
    @ApiOperation({ summary: "Mock-update a Store's payout account status/provider, e.g. to simulate RESTRICTED/DISABLED (Owner only)" })
    update(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: UpdatePayoutAccountDto,
    ) {
        return this.payoutAccountsService.updateForStore(user, storeId, dto);
    }
}
