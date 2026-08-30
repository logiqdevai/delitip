import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QrCodesService } from './qr-codes.service';

@ApiTags('Public QR')
@Controller('public/qr')
export class PublicQrController {
    constructor(private readonly qrCodesService: QrCodesService) { }

    @Get(':code')
    @ApiOperation({ summary: 'Public: resolve a scanned QR code to its Store/employee/spot config (§3, no auth)' })
    @ApiQuery({ name: 'lang', required: false })
    findByCode(@Param('code') code: string, @Query('lang') lang?: string) {
        return this.qrCodesService.findPublicByCode(code, lang);
    }
}
