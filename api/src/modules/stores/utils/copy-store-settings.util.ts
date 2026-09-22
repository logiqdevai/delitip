import { Prisma } from 'generated/prisma';
import { StoreCopyOption, StoreCopyOptions } from '../constants/store-copy-options.constant';

export const copySourceStoreInclude = {
    review_categories: true,
    review_tags: true,
    feedback_questions: true,
    alert_preferences: true,
    qr_template_customizations: true,
} satisfies Prisma.StoreInclude;

export type CopySourceStore = Prisma.StoreGetPayload<{ include: typeof copySourceStoreInclude }>;

export type StoreCopyPlan = {
    source: CopySourceStore;
    options: Set<StoreCopyOption>;
    // Freshly duplicated documents for BRANDING — never the source's own ids.
    logoDocumentId: string | null;
    coverDocumentId: string | null;
};

const json = (value: Prisma.JsonValue | null): Prisma.InputJsonValue | undefined =>
    value === null ? undefined : (value as Prisma.InputJsonValue);

// Store-row fields taken from the source store; spread over the new store's
// own fields so the copied values win.
export function buildCopiedStoreFields(plan: StoreCopyPlan): Partial<Prisma.StoreUncheckedCreateInput> {
    const { source, options } = plan;
    const fields: Partial<Prisma.StoreUncheckedCreateInput> = {};

    if (options.has(StoreCopyOptions.BRANDING)) {
        fields.primary_color = source.primary_color;
        fields.secondary_color = source.secondary_color;
        fields.logo_document_id = plan.logoDocumentId;
        fields.cover_document_id = plan.coverDocumentId;
    }
    if (options.has(StoreCopyOptions.MESSAGES)) {
        fields.welcome_message = json(source.welcome_message);
        fields.thank_you_message = json(source.thank_you_message);
    }
    if (options.has(StoreCopyOptions.LOCALIZATION)) {
        fields.primary_language = source.primary_language;
        fields.supported_languages = source.supported_languages;
        fields.currency = source.currency;
        fields.timezone = source.timezone;
    }
    if (options.has(StoreCopyOptions.TIPPING)) {
        fields.suggested_tip_amounts = source.suggested_tip_amounts;
        fields.allow_custom_tip_amount = source.allow_custom_tip_amount;
        fields.vat_rate_percentage = source.vat_rate_percentage;
    }
    if (options.has(StoreCopyOptions.REVIEWS)) {
        fields.public_review_rating_threshold = source.public_review_rating_threshold;
    }

    return fields;
}

type CopyRelationsClient = Pick<
    Prisma.TransactionClient,
    'reviewCategory' | 'reviewTag' | 'feedbackQuestion' | 'alertPreference' | 'qrTemplateCustomization'
>;

// Copies the source store's per-store child rows into the new store.
export async function copyStoreRelations(
    prisma: CopyRelationsClient,
    plan: StoreCopyPlan,
    storeId: string,
): Promise<void> {
    const { source, options } = plan;

    if (options.has(StoreCopyOptions.REVIEWS)) {
        await prisma.reviewCategory.createMany({
            data: source.review_categories.map((category) => ({
                store_id: storeId,
                name: category.name as Prisma.InputJsonValue,
                is_active: category.is_active,
                sort_order: category.sort_order,
            })),
        });
        await prisma.feedbackQuestion.createMany({
            data: source.feedback_questions.map((question) => ({
                store_id: storeId,
                question: question.question as Prisma.InputJsonValue,
                type: question.type,
                is_active: question.is_active,
                sort_order: question.sort_order,
            })),
        });
        await prisma.reviewTag.createMany({
            data: source.review_tags.map((tag) => ({
                store_id: storeId,
                name: tag.name,
                sentiment: tag.sentiment,
                is_active: tag.is_active,
            })),
        });
    }

    if (options.has(StoreCopyOptions.ALERTS)) {
        await prisma.alertPreference.createMany({
            data: source.alert_preferences.map((preference) => ({
                store_id: storeId,
                alert_type: preference.alert_type,
                is_enabled: preference.is_enabled,
            })),
        });
    }

    if (options.has(StoreCopyOptions.QR_DESIGNS)) {
        await prisma.qrTemplateCustomization.createMany({
            data: source.qr_template_customizations.map((customization) => ({
                store_id: storeId,
                template_id: customization.template_id,
                canvas: customization.canvas as Prisma.InputJsonValue,
                elements: customization.elements as Prisma.InputJsonValue,
            })),
        });
    }
}
