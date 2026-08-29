import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { ReviewsService } from './services/reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsQuerySchema, ReviewsQueryType } from './dto/reviews-query.schema';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get('stores/:storeId/reviews')
    @ApiOperation({ summary: 'List reviews for a store (§6/§19)' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'employee_id', required: false })
    @ApiQuery({ name: 'min_rating', required: false })
    @ApiQuery({ name: 'visibility', required: false })
    @ApiQuery({ name: 'search', required: false })
    findAllForStore(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(ReviewsQuerySchema)) query: ReviewsQueryType,
    ) {
        return this.reviewsService.findAllForStore(user, storeId, query);
    }

    @Get('reviews/:id')
    @ApiOperation({ summary: 'Get a single review with its category ratings, feedback responses, and tags' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.reviewsService.findOne(user, id);
    }

    @Patch('reviews/:id')
    @ApiOperation({ summary: 'Update a review\'s visibility and/or replace its tag assignments' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateReviewDto) {
        return this.reviewsService.update(user, id, dto);
    }

    @Delete('reviews/:id')
    @ApiOperation({ summary: 'Delete a review (Owner only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.reviewsService.remove(user, id);
    }
}
