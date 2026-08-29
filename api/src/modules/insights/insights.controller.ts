import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { PaginationQuerySchema, PaginationQueryType } from '@/shared/utils/pagination/pagination-query.schema';
import { InsightsService } from './insights.service';
import { GenerateInsightDto } from './dto/generate-insight.dto';

@ApiTags('Insights')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/insights')
export class InsightsController {
    constructor(private readonly insightsService: InsightsService) { }

    @Get()
    @ApiOperation({ summary: "List a Store's generated feedback-analysis summaries (§20), paginated" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(PaginationQuerySchema)) query: PaginationQueryType,
    ) {
        return this.insightsService.findAll(user, storeId, query);
    }

    @Post('generate')
    @ApiOperation({
        summary:
            'Generate a rule-based feedback-analysis summary for a period (§20). No AI/LLM call — deterministic aggregation over the database.',
    })
    generate(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: GenerateInsightDto,
    ) {
        return this.insightsService.generate(user, storeId, dto);
    }
}
