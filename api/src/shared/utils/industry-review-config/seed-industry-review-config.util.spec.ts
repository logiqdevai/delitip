import { Language, StoreIndustry } from 'generated/prisma';
import { INDUSTRY_REVIEW_EXAMPLES } from '@/shared/constants/industry-review-examples.constant';
import { seedIndustryReviewConfig } from './seed-industry-review-config.util';

describe('seedIndustryReviewConfig', () => {
    let prisma: any;

    beforeEach(() => {
        prisma = {
            reviewCategory: { createMany: jest.fn() },
            feedbackQuestion: { createMany: jest.fn() },
            reviewTag: { createMany: jest.fn() },
        };
    });

    it('creates the 3 example categories, questions, and tags for the given industry', async () => {
        await seedIndustryReviewConfig(prisma, 'store1', StoreIndustry.RESTAURANT, Language.EN);

        const example = INDUSTRY_REVIEW_EXAMPLES[StoreIndustry.RESTAURANT];

        expect(prisma.reviewCategory.createMany).toHaveBeenCalledWith({
            data: example.categories.map((name, index) => ({ store_id: 'store1', name, sort_order: index })),
        });
        expect(prisma.feedbackQuestion.createMany).toHaveBeenCalledWith({
            data: example.questions.map((q, index) => ({
                store_id: 'store1',
                question: q.text,
                type: q.type,
                sort_order: index,
            })),
        });
        expect(prisma.reviewTag.createMany).toHaveBeenCalledWith({
            data: example.tags.map((tag) => ({ store_id: 'store1', name: tag.text.en, sentiment: tag.sentiment })),
        });
    });

    it('names review tags using the store primary language rather than always English', async () => {
        await seedIndustryReviewConfig(prisma, 'store1', StoreIndustry.CAFE, Language.EL);

        const example = INDUSTRY_REVIEW_EXAMPLES[StoreIndustry.CAFE];

        expect(prisma.reviewTag.createMany).toHaveBeenCalledWith({
            data: example.tags.map((tag) => ({ store_id: 'store1', name: tag.text.el, sentiment: tag.sentiment })),
        });
    });

    it('covers every StoreIndustry with exactly 3 categories, questions, and tags', () => {
        for (const industry of Object.values(StoreIndustry)) {
            const example = INDUSTRY_REVIEW_EXAMPLES[industry];
            expect(example).toBeDefined();
            expect(example.categories).toHaveLength(3);
            expect(example.questions).toHaveLength(3);
            expect(example.tags).toHaveLength(3);
        }
    });
});
