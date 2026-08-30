import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AlertType, AuthRole, OrganizationRole, ReviewSentiment, Language } from 'generated/prisma';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let prisma: any;
    let accessControl: any;
    let usersService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            review: {
                findMany: jest.fn(),
                count: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            reviewTag: { findMany: jest.fn() },
            reviewTagAssignment: { deleteMany: jest.fn(), createMany: jest.fn() },
            store: { findUnique: jest.fn() },
            reviewCategory: { findMany: jest.fn() },
            feedbackQuestion: { findMany: jest.fn() },
            tip: { findFirst: jest.fn() },
            employee: { findFirst: jest.fn() },
            alertPreference: { findUnique: jest.fn() },
            alert: { create: jest.fn() },
            $transaction: jest.fn((arg) => (typeof arg === 'function' ? arg(prisma) : Promise.all(arg))),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        usersService = { findOrCreateByEmail: jest.fn() };
        service = new ReviewsService(prisma, accessControl, usersService);
    });

    describe('findAllForStore', () => {
        it('checks store access and paginates with only the provided filters', async () => {
            prisma.review.findMany.mockResolvedValue([{ id: 'r1' }]);
            prisma.review.count.mockResolvedValue(1);

            const result = await service.findAllForStore(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.review.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1' }, skip: 0, take: 20 }),
            );
            expect(result).toEqual({
                data: [{ id: 'r1' }],
                pagination: { total: 1, page: 1, limit: 20, total_pages: 1, has_next: false, has_prev: false },
            });
        });

        it('applies every optional filter when provided', async () => {
            prisma.review.findMany.mockResolvedValue([]);
            prisma.review.count.mockResolvedValue(0);

            await service.findAllForStore(user, 'store1', {
                page: 2,
                limit: 10,
                employee_id: 'emp1',
                min_rating: 4,
                search: 'great',
            } as any);

            expect(prisma.review.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        store_id: 'store1',
                        employee_id: 'emp1',
                        rating: { gte: 4 },
                        comment: { contains: 'great', mode: 'insensitive' },
                    },
                    skip: 10,
                    take: 10,
                }),
            );
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the review does not exist', async () => {
            prisma.review.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'r1')).rejects.toThrow(NotFoundException);
        });

        it('checks store access using the review store_id and returns the fully-included review', async () => {
            prisma.review.findUnique
                .mockResolvedValueOnce({ id: 'r1', store_id: 'store1' })
                .mockResolvedValueOnce({ id: 'r1', store_id: 'store1', tags: [] });

            const result = await service.findOne(user, 'r1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toEqual({ id: 'r1', store_id: 'store1', tags: [] });
            expect(prisma.review.findUnique).toHaveBeenNthCalledWith(2, expect.objectContaining({ where: { id: 'r1' } }));
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the review does not exist', async () => {
            prisma.review.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'r1', {})).rejects.toThrow(NotFoundException);
        });

        it('checks store access with OWNER/STORE_MANAGER roles', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });
            jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'r1' } as any);

            await service.update(user, 'r1', {});

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
        });

        it('throws BadRequestException when a tag id does not belong to the store', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });
            prisma.reviewTag.findMany.mockResolvedValue([{ id: 'tag1' }]);

            await expect(service.update(user, 'r1', { tag_ids: ['tag1', 'tag2'] })).rejects.toThrow(BadRequestException);
            expect(prisma.$transaction).not.toHaveBeenCalled();
        });

        it('replaces tag assignments in a transaction when tag_ids is non-empty and valid', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });
            prisma.reviewTag.findMany.mockResolvedValue([{ id: 'tag1' }, { id: 'tag2' }]);
            jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'r1' } as any);

            await service.update(user, 'r1', { tag_ids: ['tag1', 'tag2'] });

            expect(prisma.reviewTagAssignment.deleteMany).toHaveBeenCalledWith({ where: { review_id: 'r1' } });
            expect(prisma.reviewTagAssignment.createMany).toHaveBeenCalledWith({
                data: [
                    { review_id: 'r1', review_tag_id: 'tag1' },
                    { review_id: 'r1', review_tag_id: 'tag2' },
                ],
            });
        });

        it('only clears tag assignments (no createMany) when tag_ids is an empty array', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });
            prisma.reviewTag.findMany.mockResolvedValue([]);
            jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'r1' } as any);

            await service.update(user, 'r1', { tag_ids: [] });

            expect(prisma.reviewTagAssignment.deleteMany).toHaveBeenCalledWith({ where: { review_id: 'r1' } });
            expect(prisma.reviewTagAssignment.createMany).not.toHaveBeenCalled();
        });

        it('returns the re-fetched review after tag updates', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });
            const refetched = { id: 'r1' };
            jest.spyOn(service, 'findOne').mockResolvedValue(refetched as any);

            const result = await service.update(user, 'r1', {});

            expect(prisma.review.update).not.toHaveBeenCalled();
            expect(result).toBe(refetched);
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the review does not exist', async () => {
            prisma.review.findUnique.mockResolvedValue(null);

            await expect(service.remove(user, 'r1')).rejects.toThrow(NotFoundException);
        });

        it('checks OWNER-only store access, deletes the review, and returns success', async () => {
            prisma.review.findUnique.mockResolvedValue({ id: 'r1', store_id: 'store1' });

            const result = await service.remove(user, 'r1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
            expect(prisma.review.delete).toHaveBeenCalledWith({ where: { id: 'r1' } });
            expect(result).toEqual({ success: true });
        });
    });

    describe('getPublicReviewConfig', () => {
        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.getPublicReviewConfig('slug1')).rejects.toThrow(NotFoundException);
        });

        it('throws NotFoundException when the store is inactive', async () => {
            prisma.store.findUnique.mockResolvedValue({ id: 'store1', is_active: false });

            await expect(service.getPublicReviewConfig('slug1')).rejects.toThrow(NotFoundException);
        });

        it('resolves translated category/question text and returns the review threshold', async () => {
            prisma.store.findUnique.mockResolvedValue({
                id: 'store1',
                is_active: true,
                primary_language: Language.EN,
                public_review_rating_threshold: 4,
            });
            prisma.reviewCategory.findMany.mockResolvedValue([
                { id: 'c1', name: { en: 'Service', el: 'Εξυπηρέτηση' }, sort_order: 1 },
            ]);
            prisma.feedbackQuestion.findMany.mockResolvedValue([
                { id: 'q1', question: { en: 'How was it?' }, type: 'RATING', sort_order: 1 },
            ]);

            const result = await service.getPublicReviewConfig('slug1', 'el');

            expect(result).toEqual({
                review_categories: [{ id: 'c1', name: 'Εξυπηρέτηση', sort_order: 1 }],
                feedback_questions: [{ id: 'q1', question: 'How was it?', type: 'RATING', sort_order: 1 }],
                public_review_rating_threshold: 4,
            });
        });
    });

    describe('createPublic', () => {
        const baseDto = { store_id: 'store1', rating: 5 } as any;
        const activeStore = {
            id: 'store1',
            is_active: true,
            public_review_rating_threshold: 4,
            public_review_redirect_url: 'https://google.com/review',
            primary_language: 'EN',
        };

        beforeEach(() => {
            prisma.store.findUnique.mockResolvedValue(activeStore);
            prisma.alertPreference.findUnique.mockResolvedValue(null);
        });

        it('throws NotFoundException when the store does not exist or is inactive', async () => {
            prisma.store.findUnique.mockResolvedValue(null);
            await expect(service.createPublic(baseDto)).rejects.toThrow(NotFoundException);

            prisma.store.findUnique.mockResolvedValue({ ...activeStore, is_active: false });
            await expect(service.createPublic(baseDto)).rejects.toThrow(NotFoundException);
        });

        it('throws BadRequestException when tip_id is given but does not belong to the store', async () => {
            prisma.tip.findFirst.mockResolvedValue(null);

            await expect(service.createPublic({ ...baseDto, tip_id: 'tip1' })).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when employee_id is given but does not belong to the store', async () => {
            prisma.employee.findFirst.mockResolvedValue(null);

            await expect(service.createPublic({ ...baseDto, employee_id: 'emp1' })).rejects.toThrow(BadRequestException);
        });

        it('resolves the customer user from customer_email, using the first word of customer_name', async () => {
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'user1' });
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            await service.createPublic({ ...baseDto, customer_email: 'a@b.com', customer_name: 'Jane Doe' });

            expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('a@b.com', { first_name: 'Jane' });
        });

        it('does not resolve a customer user when no customer_email is given', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            await service.createPublic(baseDto);

            expect(usersService.findOrCreateByEmail).not.toHaveBeenCalled();
        });

        it('throws BadRequestException when a category rating references a category outside the store', async () => {
            prisma.reviewCategory.findMany.mockResolvedValue([]);

            await expect(
                service.createPublic({ ...baseDto, category_ratings: [{ review_category_id: 'cat1', rating: 5 }] }),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when a feedback response references a question outside the store', async () => {
            prisma.feedbackQuestion.findMany.mockResolvedValue([]);

            await expect(
                service.createPublic({
                    ...baseDto,
                    feedback_responses: [{ feedback_question_id: 'q1', rating_value: 5 }],
                }),
            ).rejects.toThrow(BadRequestException);
        });

        it('buckets rating >= 4 as POSITIVE sentiment, marks it redirected when above threshold, and returns the redirect payload', async () => {
            const created = { id: 'r1' };
            prisma.review.create = jest.fn().mockResolvedValue(created);

            const result = await service.createPublic({ ...baseDto, rating: 5 });

            expect(prisma.review.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        sentiment: ReviewSentiment.POSITIVE,
                        redirected_to_public_platform: true,
                    }),
                }),
            );
            expect(result).toEqual({
                review: created,
                redirect: { should_redirect: true, url: 'https://google.com/review' },
                message: "We're glad you enjoyed your experience. Would you like to share your experience with others?",
            });
        });

        it('buckets rating === 3 as NEUTRAL sentiment and does not redirect', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            const result = await service.createPublic({ ...baseDto, rating: 3 });

            expect(prisma.review.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ sentiment: ReviewSentiment.NEUTRAL, redirected_to_public_platform: false }),
                }),
            );
            expect(result.redirect).toEqual({ should_redirect: false, url: 'https://google.com/review' });
            expect(result.message).toBe("We're sorry your experience wasn't perfect. Thank you for telling us — we'll use it to improve.");
        });

        it('buckets rating <= 2 as NEGATIVE sentiment', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            await service.createPublic({ ...baseDto, rating: 1 });

            expect(prisma.review.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ sentiment: ReviewSentiment.NEGATIVE }) }),
            );
        });

        it('does not redirect when the store has no public_review_redirect_url even above threshold', async () => {
            prisma.store.findUnique.mockResolvedValue({ ...activeStore, public_review_redirect_url: null });
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            const result = await service.createPublic({ ...baseDto, rating: 5 });

            expect(result.redirect).toEqual({ should_redirect: false, url: null });
        });

        it('creates category ratings and feedback responses inside the same transaction', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });
            prisma.reviewCategoryRating = { createMany: jest.fn() };
            prisma.feedbackResponse = { createMany: jest.fn() };
            prisma.reviewCategory.findMany.mockResolvedValue([{ id: 'cat1' }]);
            prisma.feedbackQuestion.findMany.mockResolvedValue([{ id: 'q1' }]);

            await service.createPublic({
                ...baseDto,
                category_ratings: [{ review_category_id: 'cat1', rating: 5 }],
                feedback_responses: [{ feedback_question_id: 'q1', rating_value: 5 }],
            });

            expect(prisma.reviewCategoryRating.createMany).toHaveBeenCalledWith({
                data: [{ review_id: 'r1', review_category_id: 'cat1', rating: 5 }],
            });
            expect(prisma.feedbackResponse.createMany).toHaveBeenCalledWith({
                data: [{ review_id: 'r1', feedback_question_id: 'q1', rating_value: 5, text_value: undefined }],
            });
        });

        it('creates a LOW_RATING_REVIEW alert for a rating <= 2 when no disabling preference exists', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });

            await service.createPublic({ ...baseDto, rating: 2, comment: 'meh' });

            expect(prisma.alert.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    store_id: 'store1',
                    type: AlertType.LOW_RATING_REVIEW,
                    message: 'A customer left a 2-star review: "meh"',
                }),
            });
        });

        it('does not create a LOW_RATING_REVIEW alert when the preference is disabled', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });
            prisma.alertPreference.findUnique.mockResolvedValue({ is_enabled: false });

            await service.createPublic({ ...baseDto, rating: 1 });

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });

        it('never lets an alert-trigger failure propagate out of createPublic', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });
            prisma.alertPreference.findUnique.mockRejectedValue(new Error('boom'));

            await expect(service.createPublic({ ...baseDto, rating: 1 })).resolves.toBeDefined();
        });

        it('creates a POSITIVE_COMPLIMENTS alert on the 10th, 20th, ... 4+-star review of the day for an employee', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });
            prisma.employee.findFirst.mockResolvedValue({ id: 'emp1', full_name: { en: 'Alex' } });
            prisma.review.count.mockResolvedValue(10);

            await service.createPublic({ ...baseDto, rating: 5, employee_id: 'emp1' });

            expect(prisma.alert.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    type: AlertType.POSITIVE_COMPLIMENTS,
                    message: 'Alex has received 10 customer compliments today.',
                }),
            });
        });

        it('does not create a POSITIVE_COMPLIMENTS alert when the compliment count is not a multiple of 10', async () => {
            prisma.review.create = jest.fn().mockResolvedValue({ id: 'r1' });
            prisma.employee.findFirst.mockResolvedValue({ id: 'emp1', full_name: { en: 'Alex' } });
            prisma.review.count.mockResolvedValue(7);

            await service.createPublic({ ...baseDto, rating: 5, employee_id: 'emp1' });

            expect(prisma.alert.create).not.toHaveBeenCalled();
        });
    });
});
