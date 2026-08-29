import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './services/reviews.service';
import { CreatePublicReviewDto } from './dto/create-public-review.dto';

@ApiTags('Public Reviews')
@Controller('public')
export class PublicReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get('stores/:slug/review-config')
    @ApiOperation({ summary: 'Get the active review categories/feedback questions for a store\'s public review form (§7)' })
    @ApiQuery({ name: 'lang', required: false })
    getReviewConfig(@Param('slug') slug: string, @Query('lang') lang?: string) {
        return this.reviewsService.getPublicReviewConfig(slug, lang);
    }

    @Post('reviews')
    @ApiOperation({ summary: 'Submit a post-tip review/feedback from a customer (§7/§8)' })
    create(@Body() dto: CreatePublicReviewDto) {
        return this.reviewsService.createPublic(dto);
    }
}
