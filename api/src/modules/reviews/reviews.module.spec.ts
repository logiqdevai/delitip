import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ReviewsModule } from './reviews.module';
import { ReviewsController } from './reviews.controller';
import { PublicReviewsController } from './public-reviews.controller';
import { ReviewsService } from './services/reviews.service';

describe('ReviewsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ReviewsModule],
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

    it('should resolve ReviewsService', () => {
        expect(module.get(ReviewsService)).toBeInstanceOf(ReviewsService);
    });

    it('should resolve ReviewsController', () => {
        expect(module.get(ReviewsController)).toBeInstanceOf(ReviewsController);
    });

    it('should resolve PublicReviewsController', () => {
        expect(module.get(PublicReviewsController)).toBeInstanceOf(PublicReviewsController);
    });
});
