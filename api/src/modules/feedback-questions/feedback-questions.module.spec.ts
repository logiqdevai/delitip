import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { FeedbackQuestionsModule } from './feedback-questions.module';
import { FeedbackQuestionsController } from './feedback-questions.controller';
import { FeedbackQuestionsService } from './services/feedback-questions.service';

describe('FeedbackQuestionsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [FeedbackQuestionsModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve FeedbackQuestionsService', () => {
        expect(module.get(FeedbackQuestionsService)).toBeInstanceOf(FeedbackQuestionsService);
    });

    it('should resolve FeedbackQuestionsController', () => {
        expect(module.get(FeedbackQuestionsController)).toBeInstanceOf(FeedbackQuestionsController);
    });
});
