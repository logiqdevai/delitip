import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { RefundsService } from './services/refunds.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { RefundsQuerySchema, RefundsQueryType } from './dto/refunds-query.schema';

@ApiTags('Refunds')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class RefundsController {
    constructor(private readonly refundsService: RefundsService) { }

    @Post('refunds')
    @ApiOperation({ summary: 'Request a refund for a tip, on behalf of a customer (§28)' })
    create(@CurrentUser() user: AuthUser, @Body() dto: CreateRefundDto) {
        return this.refundsService.create(user, dto);
    }

    @Get('stores/:storeId/refunds')
    @ApiOperation({ summary: "List a Store's refund requests" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'status', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(RefundsQuerySchema)) query: RefundsQueryType,
    ) {
        return this.refundsService.findAll(user, storeId, query);
    }

    @Get('refunds/:id')
    @ApiOperation({ summary: 'Get a refund' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.refundsService.findOne(user, id);
    }

    @Patch('refunds/:id')
    @ApiOperation({ summary: 'Approve, reject, or complete a refund (§28)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateRefundDto) {
        return this.refundsService.update(user, id, dto);
    }
}
