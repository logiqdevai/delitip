import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { TipsService } from './services/tips.service';
import { TipsQuerySchema, TipsQueryType } from './dto/tips-query.schema';

@ApiTags('Tips')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class TipsController {
    constructor(private readonly tipsService: TipsService) { }

    @Get('stores/:storeId/tips')
    @ApiOperation({ summary: 'List a Store\'s tips (§15, §27)' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'employee_id', required: false })
    @ApiQuery({ name: 'qr_code_id', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(TipsQuerySchema)) query: TipsQueryType,
    ) {
        return this.tipsService.findAll(user, storeId, query);
    }

    @Get('tips/:id')
    @ApiOperation({ summary: 'Get a tip and its frozen distribution breakdown' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.tipsService.findOne(user, id);
    }
}
