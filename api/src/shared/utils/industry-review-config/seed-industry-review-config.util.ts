import { Language, Prisma, StoreIndustry } from 'generated/prisma';
import { INDUSTRY_REVIEW_EXAMPLES } from '@/shared/constants/industry-review-examples.constant';

type ReviewConfigSeedClient = Pick<
    Prisma.TransactionClient,
    'reviewCategory' | 'feedbackQuestion' | 'reviewTag'
>;

// Gives a new store a ready-to-use "Reviews & feedback config" instead of the
// empty state, based on its industry (§ industry-based review config).
export async function seedIndustryReviewConfig(
    prisma: ReviewConfigSeedClient,
    storeId: string,
    industry: StoreIndustry,
    primaryLanguage: Language,
): Promise<void> {
    const example = INDUSTRY_REVIEW_EXAMPLES[industry];
    const primaryLanguageKey = primaryLanguage.toLowerCase() as keyof typeof example.tags[number]['text'];

    await prisma.reviewCategory.createMany({
        data: example.categories.map((name, index) => ({
            store_id: storeId,
            name,
            sort_order: index,
        })),
    });

    await prisma.feedbackQuestion.createMany({
        data: example.questions.map((question, index) => ({
            store_id: storeId,
            question: question.text,
            type: question.type,
            sort_order: index,
        })),
    });

    await prisma.reviewTag.createMany({
        data: example.tags.map((tag) => ({
            store_id: storeId,
            name: tag.text[primaryLanguageKey] ?? tag.text.en,
            sentiment: tag.sentiment,
        })),
    });
}
