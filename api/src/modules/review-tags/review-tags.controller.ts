import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ReviewTagsService } from './services/review-tags.service';
import { CreateReviewTagDto } from './dto/create-review-tag.dto';
import { UpdateReviewTagDto } from './dto/update-review-tag.dto';
import { ReviewTagQuerySchema, ReviewTagQueryType } from './dto/review-tag-query.schema';

@ApiTags('Review Tags')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/review-tags')
export class ReviewTagsController {
    constructor(private readonly reviewTagsService: ReviewTagsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a store-scoped review tag (§19), e.g. "Friendly service"' })
    create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreateReviewTagDto) {
        return this.reviewTagsService.create(user, storeId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List review tags for a store' })
    @ApiQuery({ name: 'sentiment', required: false })
    @ApiQuery({ name: 'is_active', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(ReviewTagQuerySchema)) query: ReviewTagQueryType,
    ) {
        return this.reviewTagsService.findAll(user, storeId, query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a review tag' })
    update(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('id') id: string,
        @Body() dto: UpdateReviewTagDto,
    ) {
        return this.reviewTagsService.update(user, storeId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review tag' })
    remove(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
        return this.reviewTagsService.remove(user, storeId, id);
    }
}
