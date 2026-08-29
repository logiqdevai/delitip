import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ReviewCategoriesService } from './services/review-categories.service';
import { CreateReviewCategoryDto } from './dto/create-review-category.dto';
import { UpdateReviewCategoryDto } from './dto/update-review-category.dto';
import { ReviewCategoryQuerySchema, ReviewCategoryQueryType } from './dto/review-category-query.schema';

@ApiTags('Review Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/review-categories')
export class ReviewCategoriesController {
    constructor(private readonly reviewCategoriesService: ReviewCategoriesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a store-configurable review category (§6), e.g. Friendliness, Speed' })
    create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreateReviewCategoryDto) {
        return this.reviewCategoriesService.create(user, storeId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List review categories for a store' })
    @ApiQuery({ name: 'is_active', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(ReviewCategoryQuerySchema)) query: ReviewCategoryQueryType,
    ) {
        return this.reviewCategoriesService.findAll(user, storeId, query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a review category' })
    update(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('id') id: string,
        @Body() dto: UpdateReviewCategoryDto,
    ) {
        return this.reviewCategoriesService.update(user, storeId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review category' })
    remove(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
        return this.reviewCategoriesService.remove(user, storeId, id);
    }
}
