import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundsService } from './services/refunds.service';
import { CreatePublicRefundRequestDto } from './dto/create-refund.dto';

@ApiTags('Public — Refunds')
@Controller('public/tips')
export class PublicRefundsController {
    constructor(private readonly refundsService: RefundsService) { }

    @Post(':tipId/refund-request')
    @ApiOperation({ summary: 'A customer asks for a refund on a tip they left, without needing an account (§28)' })
    create(@Param('tipId') tipId: string, @Body() dto: CreatePublicRefundRequestDto) {
        return this.refundsService.createPublicRequest(tipId, dto);
    }
}
