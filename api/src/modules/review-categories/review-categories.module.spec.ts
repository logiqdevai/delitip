import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ReviewCategoriesModule } from './review-categories.module';
import { ReviewCategoriesController } from './review-categories.controller';
import { ReviewCategoriesService } from './services/review-categories.service';

describe('ReviewCategoriesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ReviewCategoriesModule],
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

    it('should resolve ReviewCategoriesService', () => {
        expect(module.get(ReviewCategoriesService)).toBeInstanceOf(ReviewCategoriesService);
    });

    it('should resolve ReviewCategoriesController', () => {
        expect(module.get(ReviewCategoriesController)).toBeInstanceOf(ReviewCategoriesController);
    });
});
