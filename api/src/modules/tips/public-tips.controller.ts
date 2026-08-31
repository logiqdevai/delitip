import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TipsService } from './services/tips.service';
import { CreatePublicTipDto } from './dto/create-public-tip.dto';

@ApiTags('Public — Tips')
@Controller('public/tips')
export class PublicTipsController {
    constructor(private readonly tipsService: TipsService) { }

    @Post()
    @ApiOperation({ summary: 'Start a tip checkout after scanning a QR code — no account required. Returns a Viva checkout URL to redirect to.' })
    create(@Body() dto: CreatePublicTipDto) {
        return this.tipsService.createPublicTip(dto);
    }

    @Get(':id/status')
    @ApiOperation({ summary: 'Poll a tip\'s payment status after returning from Viva checkout' })
    getStatus(@Param('id') id: string) {
        return this.tipsService.getPublicStatus(id);
    }
}
