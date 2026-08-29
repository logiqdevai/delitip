import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { SubscriptionsService } from './services/subscriptions.service';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('organizations/:organizationId/subscription')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Get()
    @ApiOperation({ summary: "Get the Organization's subscription (§32) — no real billing provider is connected" })
    findOne(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string) {
        return this.subscriptionsService.findOne(user, organizationId);
    }

    @Patch()
    @ApiOperation({ summary: 'Change the subscription plan (mocked — takes effect immediately, Owner only)' })
    changePlan(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Body() dto: UpdateSubscriptionDto,
    ) {
        return this.subscriptionsService.changePlan(user, organizationId, dto);
    }

    @Post('cancel')
    @ApiOperation({ summary: 'Cancel the subscription (mocked, Owner only)' })
    cancel(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string) {
        return this.subscriptionsService.cancel(user, organizationId);
    }
}
