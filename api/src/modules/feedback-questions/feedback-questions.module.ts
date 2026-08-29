import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { FeedbackQuestionsController } from './feedback-questions.controller';
import { FeedbackQuestionsService } from './services/feedback-questions.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [FeedbackQuestionsController],
    providers: [FeedbackQuestionsService],
    exports: [FeedbackQuestionsService],
})
export class FeedbackQuestionsModule { }
