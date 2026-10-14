import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';

@ApiTags('App Config')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('app-config')
export class PlatformVatController {
    constructor(private readonly platformFinanceConfig: PlatformFinanceConfig) {}

    @Get('vat-rate')
    @ApiOperation({ summary: 'Get the platform-wide VAT rate added on top of tips at checkout' })
    async getVatRate() {
        return { vat_rate_percentage: await this.platformFinanceConfig.getVatRatePercentage() };
    }
}
