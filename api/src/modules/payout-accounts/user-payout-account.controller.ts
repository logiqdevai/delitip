import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { PayoutAccountsService } from './payout-accounts.service';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';

@ApiTags('Payout Accounts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users/me/payout-account')
export class UserPayoutAccountController {
    constructor(private readonly payoutAccountsService: PayoutAccountsService) { }

    @Post()
    @ApiOperation({
        summary:
            "Connect the current user's own payout account (mocked — instantly ACTIVE; shared across every Employee Account they hold, §11)",
    })
    create(@CurrentUser() user: AuthUser, @Body() dto: CreatePayoutAccountDto) {
        return this.payoutAccountsService.createForUser(user, dto);
    }

    @Get()
    @ApiOperation({ summary: "Get the current user's own payout account" })
    findOne(@CurrentUser() user: AuthUser) {
        return this.payoutAccountsService.findForUser(user);
    }
}
