import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { ReviewTagsModule } from './review-tags.module';
import { ReviewTagsController } from './review-tags.controller';
import { ReviewTagsService } from './services/review-tags.service';

describe('ReviewTagsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ReviewTagsModule],
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

    it('should resolve ReviewTagsService', () => {
        expect(module.get(ReviewTagsService)).toBeInstanceOf(ReviewTagsService);
    });

    it('should resolve ReviewTagsController', () => {
        expect(module.get(ReviewTagsController)).toBeInstanceOf(ReviewTagsController);
    });
});
