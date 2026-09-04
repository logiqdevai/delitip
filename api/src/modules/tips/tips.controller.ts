import { Controller, Get, Header, Param, Query, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { TipsService } from './services/tips.service';
import { TipsQuerySchema, TipsQueryType } from './dto/tips-query.schema';
import { TipsExportQuerySchema, TipsExportQueryType } from './dto/tips-export-query.schema';

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

    @Get('stores/:storeId/tips/export')
    @ApiOperation({ summary: 'Export a Store\'s tips as CSV' })
    @ApiProduces('text/csv')
    @ApiQuery({ name: 'employee_id', required: false })
    @ApiQuery({ name: 'qr_code_id', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'date_from', required: false })
    @ApiQuery({ name: 'date_to', required: false })
    @Header('Content-Type', 'text/csv; charset=utf-8')
    async exportCsv(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(TipsExportQuerySchema)) query: TipsExportQueryType,
    ) {
        const { csv, filename } = await this.tipsService.exportCsv(user, storeId, query);
        return new StreamableFile(Buffer.from(csv, 'utf-8'), {
            type: 'text/csv; charset=utf-8',
            disposition: `attachment; filename="${filename}"`,
        });
    }

    @Get('tips/:id')
    @ApiOperation({ summary: 'Get a tip and its frozen distribution breakdown' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.tipsService.findOne(user, id);
    }
}
