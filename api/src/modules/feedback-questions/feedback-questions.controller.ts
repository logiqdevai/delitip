import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { FeedbackQuestionsService } from './services/feedback-questions.service';
import { CreateFeedbackQuestionDto } from './dto/create-feedback-question.dto';
import { UpdateFeedbackQuestionDto } from './dto/update-feedback-question.dto';
import { FeedbackQuestionQuerySchema, FeedbackQuestionQueryType } from './dto/feedback-question-query.schema';

@ApiTags('Feedback Questions')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/feedback-questions')
export class FeedbackQuestionsController {
    constructor(private readonly feedbackQuestionsService: FeedbackQuestionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a store-configurable feedback question (§8), e.g. "How was the food?"' })
    create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreateFeedbackQuestionDto) {
        return this.feedbackQuestionsService.create(user, storeId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List feedback questions for a store' })
    @ApiQuery({ name: 'is_active', required: false })
    findAll(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(FeedbackQuestionQuerySchema)) query: FeedbackQuestionQueryType,
    ) {
        return this.feedbackQuestionsService.findAll(user, storeId, query);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a feedback question' })
    update(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('id') id: string,
        @Body() dto: UpdateFeedbackQuestionDto,
    ) {
        return this.feedbackQuestionsService.update(user, storeId, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a feedback question' })
    remove(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Param('id') id: string) {
        return this.feedbackQuestionsService.remove(user, storeId, id);
    }
}
