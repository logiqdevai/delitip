import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';

// Readable by any signed-in user (unlike /admin/app-config): a Store needs to
// know whether payouts are invoice-gated and who to invoice before it can act.
@ApiTags('App Config')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('app-config')
export class PlatformPayoutPolicyController {
    constructor(private readonly platformFinanceConfig: PlatformFinanceConfig) {}

    @Get('payout-policy')
    @ApiOperation({ summary: 'Whether payouts require an invoice-backed request, and the platform invoicing details' })
    async getPayoutPolicy() {
        const [payout_invoice_required, connected_account_payouts_enabled, tip_payouts_store_only, details] = await Promise.all([
            this.platformFinanceConfig.isPayoutInvoiceRequired(),
            this.platformFinanceConfig.isConnectedAccountPayoutsEnabled(),
            this.platformFinanceConfig.isTipPayoutsStoreOnly(),
            this.platformFinanceConfig.getPlatformInvoiceDetails(),
        ]);
        const { instructions, ...invoice_to } = details;
        return { payout_invoice_required, connected_account_payouts_enabled, tip_payouts_store_only, invoice_to, instructions };
    }
}
