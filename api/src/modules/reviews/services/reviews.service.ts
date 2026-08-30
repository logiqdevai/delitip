import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { CreatePublicReviewDto } from '../dto/create-public-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewsQueryType } from '../dto/reviews-query.schema';
import { AlertType, Employee, Language, OrganizationRole, Prisma, Review, ReviewSentiment } from 'generated/prisma';

const MANAGE_ROLES: OrganizationRole[] = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

@Injectable()
export class ReviewsService {
    private readonly logger = new Logger(ReviewsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
    ) { }

    // ------------------------------------------------------------------
    // Dashboard endpoints
    // ------------------------------------------------------------------

    async findAllForStore(user: AuthUser, storeId: string, query: ReviewsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const where: Prisma.ReviewWhereInput = {
            store_id: storeId,
            ...(query.employee_id && { employee_id: query.employee_id }),
            ...(query.min_rating !== undefined && { rating: { gte: query.min_rating } }),
            ...(query.search && { comment: { contains: query.search, mode: 'insensitive' as const } }),
        };

        const [items, total, store] = await Promise.all([
            this.prisma.review.findMany({
                where,
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
                include: {
                    employee: { select: { id: true, full_name: true } },
                    tags: { include: { review_tag: true } },
                },
            }),
            this.prisma.review.count({ where }),
            this.prisma.store.findUnique({ where: { id: storeId }, select: { primary_language: true } }),
        ]);
        const primaryLanguage = store?.primary_language ?? 'EN';

        const resolvedItems = items.map((review) => ({
            ...review,
            employee: review.employee
                ? {
                    ...review.employee,
                    full_name: resolveTranslatedText(review.employee.full_name as TranslatedText, undefined, primaryLanguage),
                }
                : review.employee,
        }));

        return paginate(resolvedItems, total, query);
    }

    async findOne(user: AuthUser, id: string) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        await this.accessControl.assertStoreAccess(user, review.store_id);

        const store = await this.prisma.store.findUnique({ where: { id: review.store_id }, select: { primary_language: true } });
        const primaryLanguage = store?.primary_language ?? 'EN';

        const full = await this.prisma.review.findUnique({
            where: { id },
            include: {
                category_ratings: { include: { review_category: true } },
                feedback_responses: { include: { feedback_question: true } },
                tags: { include: { review_tag: true } },
                employee: true,
            },
        });
        if (!full) return full;

        return {
            ...full,
            employee: full.employee
                ? {
                    ...full.employee,
                    full_name: resolveTranslatedText(full.employee.full_name as TranslatedText, undefined, primaryLanguage),
                }
                : full.employee,
        };
    }

    async update(user: AuthUser, id: string, dto: UpdateReviewDto) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        await this.accessControl.assertStoreAccess(user, review.store_id, MANAGE_ROLES);

        if (dto.tag_ids) {
            const validTags = await this.prisma.reviewTag.findMany({
                where: { store_id: review.store_id, id: { in: dto.tag_ids } },
                select: { id: true },
            });
            if (validTags.length !== new Set(dto.tag_ids).size) {
                throw new BadRequestException('One or more tag ids do not belong to this store');
            }

            await this.prisma.$transaction([
                this.prisma.reviewTagAssignment.deleteMany({ where: { review_id: id } }),
                ...(dto.tag_ids.length
                    ? [
                        this.prisma.reviewTagAssignment.createMany({
                            data: dto.tag_ids.map((tagId) => ({ review_id: id, review_tag_id: tagId })),
                        }),
                    ]
                    : []),
            ]);
        }

        return this.findOne(user, id);
    }

    async remove(user: AuthUser, id: string) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        await this.accessControl.assertStoreAccess(user, review.store_id, [OrganizationRole.OWNER]);

        await this.prisma.review.delete({ where: { id } });
        return { success: true };
    }

    // ------------------------------------------------------------------
    // Public endpoints
    // ------------------------------------------------------------------

    async getPublicReviewConfig(slug: string, lang?: string) {
        const store = await this.prisma.store.findUnique({ where: { slug } });
        if (!store || !store.is_active) throw new NotFoundException('Store not found');

        const [categories, questions] = await Promise.all([
            this.prisma.reviewCategory.findMany({
                where: { store_id: store.id, is_active: true },
                orderBy: { sort_order: 'asc' },
            }),
            this.prisma.feedbackQuestion.findMany({
                where: { store_id: store.id, is_active: true },
                orderBy: { sort_order: 'asc' },
            }),
        ]);

        return {
            review_categories: categories.map((c) => ({
                id: c.id,
                name: resolveTranslatedText(c.name as TranslatedText, lang, store.primary_language),
                sort_order: c.sort_order,
            })),
            feedback_questions: questions.map((q) => ({
                id: q.id,
                question: resolveTranslatedText(q.question as TranslatedText, lang, store.primary_language),
                type: q.type,
                sort_order: q.sort_order,
            })),
            public_review_rating_threshold: store.public_review_rating_threshold,
        };
    }

    async createPublic(dto: CreatePublicReviewDto) {
        const store = await this.prisma.store.findUnique({ where: { id: dto.store_id } });
        if (!store || !store.is_active) throw new NotFoundException('Store not found');

        if (dto.tip_id) {
            const tip = await this.prisma.tip.findFirst({ where: { id: dto.tip_id, store_id: dto.store_id } });
            if (!tip) throw new BadRequestException('Tip not found for this store');
        }

        let employee: Employee | null = null;
        if (dto.employee_id) {
            employee = await this.prisma.employee.findFirst({ where: { id: dto.employee_id, store_id: dto.store_id } });
            if (!employee) throw new BadRequestException('Employee not found for this store');
        }

        // Customer identity is resolved/created for follow-up, but the raw
        // customer_email/customer_name are still stored denormalized on the
        // Review row as given, per the schema.
        let customerUserId: string | undefined;
        if (dto.customer_email) {
            const firstName = dto.customer_name?.trim().split(/\s+/)[0];
            const customerUser = await this.usersService.findOrCreateByEmail(dto.customer_email, { first_name: firstName });
            customerUserId = customerUser.id;
        }

        if (dto.category_ratings?.length) {
            await this.assertCategoriesBelongToStore(dto.store_id, dto.category_ratings.map((c) => c.review_category_id));
        }

        if (dto.feedback_responses?.length) {
            await this.assertQuestionsBelongToStore(dto.store_id, dto.feedback_responses.map((f) => f.feedback_question_id));
        }

        // Rule-based sentiment analysis, not an ML/AI call: bucketed directly
        // off the numeric star rating, per §21.
        const sentiment: ReviewSentiment =
            dto.rating >= 4 ? ReviewSentiment.POSITIVE : dto.rating === 3 ? ReviewSentiment.NEUTRAL : ReviewSentiment.NEGATIVE;

        const threshold = store.public_review_rating_threshold ?? 4;
        const redirected = dto.rating >= threshold && !!store.public_review_redirect_url;

        const review = await this.prisma.$transaction(async (tx) => {
            const created = await tx.review.create({
                data: {
                    store_id: dto.store_id,
                    tip_id: dto.tip_id,
                    employee_id: dto.employee_id,
                    customer_user_id: customerUserId,
                    customer_email: dto.customer_email,
                    customer_name: dto.customer_name,
                    rating: dto.rating,
                    comment: dto.comment,
                    sentiment,
                    redirected_to_public_platform: redirected,
                },
            });

            if (dto.category_ratings?.length) {
                await tx.reviewCategoryRating.createMany({
                    data: dto.category_ratings.map((c) => ({
                        review_id: created.id,
                        review_category_id: c.review_category_id,
                        rating: c.rating,
                    })),
                });
            }

            if (dto.feedback_responses?.length) {
                await tx.feedbackResponse.createMany({
                    data: dto.feedback_responses.map((f) => ({
                        review_id: created.id,
                        feedback_question_id: f.feedback_question_id,
                        rating_value: f.rating_value,
                        text_value: f.text_value,
                    })),
                });
            }

            return created;
        });

        // Side effect only — never fail the review submission because an
        // alert couldn't be written.
        try {
            await this.triggerAlerts(dto, review, employee, store.primary_language);
        } catch (error) {
            this.logger.error('Failed to process review alert triggers', error as Error);
        }

        return {
            review,
            redirect: {
                should_redirect: redirected,
                url: store.public_review_redirect_url ?? null,
            },
            message: redirected
                ? "We're glad you enjoyed your experience. Would you like to share your experience with others?"
                : "We're sorry your experience wasn't perfect. Thank you for telling us — we'll use it to improve.",
        };
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private async assertCategoriesBelongToStore(storeId: string, categoryIds: string[]) {
        const valid = await this.prisma.reviewCategory.findMany({
            where: { store_id: storeId, id: { in: categoryIds } },
            select: { id: true },
        });
        const validSet = new Set(valid.map((c) => c.id));
        for (const id of categoryIds) {
            if (!validSet.has(id)) throw new BadRequestException(`Review category ${id} not found for this store`);
        }
    }

    private async assertQuestionsBelongToStore(storeId: string, questionIds: string[]) {
        const valid = await this.prisma.feedbackQuestion.findMany({
            where: { store_id: storeId, id: { in: questionIds } },
            select: { id: true },
        });
        const validSet = new Set(valid.map((q) => q.id));
        for (const id of questionIds) {
            if (!validSet.has(id)) throw new BadRequestException(`Feedback question ${id} not found for this store`);
        }
    }

    private async triggerAlerts(dto: CreatePublicReviewDto, review: Review, employee: Employee | null, primaryLanguage: Language) {
        if (dto.rating <= 2) {
            const preference = await this.prisma.alertPreference.findUnique({
                where: { store_id_alert_type: { store_id: dto.store_id, alert_type: AlertType.LOW_RATING_REVIEW } },
            });
            const enabled = !preference || preference.is_enabled;

            if (enabled) {
                await this.prisma.alert.create({
                    data: {
                        store_id: dto.store_id,
                        type: AlertType.LOW_RATING_REVIEW,
                        title: 'Low rating review',
                        message: dto.comment
                            ? `A customer left a ${dto.rating}-star review: "${dto.comment}"`
                            : `A customer left a ${dto.rating}-star review.`,
                        employee_id: dto.employee_id ?? null,
                    },
                });
            }
        }

        if (dto.rating >= 4 && dto.employee_id && employee) {
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const count = await this.prisma.review.count({
                where: {
                    store_id: dto.store_id,
                    employee_id: dto.employee_id,
                    rating: { gte: 4 },
                    created_at: { gte: startOfToday },
                },
            });

            if (count > 0 && count % 10 === 0) {
                const preference = await this.prisma.alertPreference.findUnique({
                    where: { store_id_alert_type: { store_id: dto.store_id, alert_type: AlertType.POSITIVE_COMPLIMENTS } },
                });
                const enabled = !preference || preference.is_enabled;

                if (enabled) {
                    await this.prisma.alert.create({
                        data: {
                            store_id: dto.store_id,
                            type: AlertType.POSITIVE_COMPLIMENTS,
                            title: 'Customer compliments',
                            message: `${resolveTranslatedText(employee.full_name as TranslatedText, undefined, primaryLanguage)} has received ${count} customer compliments today.`,
                            employee_id: dto.employee_id,
                        },
                    });
                }
            }
        }
    }
}
