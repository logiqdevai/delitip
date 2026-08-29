import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TipsService } from './services/tips.service';
import { CreatePublicTipDto } from './dto/create-public-tip.dto';

@ApiTags('Public — Tips')
@Controller('public/tips')
export class PublicTipsController {
    constructor(private readonly tipsService: TipsService) { }

    @Post()
    @ApiOperation({ summary: 'Leave a tip after scanning a QR code — no account required (§4, §22)' })
    create(@Body() dto: CreatePublicTipDto) {
        return this.tipsService.createPublicTip(dto);
    }
}
