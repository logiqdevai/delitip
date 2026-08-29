import { NotFoundException } from '@nestjs/common';
import { AuthRole, FeedbackQuestionType, Language, OrganizationRole } from 'generated/prisma';
import { FeedbackQuestionsService } from './feedback-questions.service';

describe('FeedbackQuestionsService', () => {
    let service: FeedbackQuestionsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const MANAGE_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];
    const store = { id: 'store1', primary_language: Language.EN, supported_languages: [Language.EN, Language.EL] };

    beforeEach(() => {
        prisma = {
            store: { findUnique: jest.fn() },
            feedbackQuestion: {
                create: jest.fn(),
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new FeedbackQuestionsService(prisma, accessControl);
    });

    describe('create', () => {
        it('asserts MANAGE_ROLES store access', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.feedbackQuestion.create.mockResolvedValue({ id: 'q1' });

            await service.create(user, 'store1', { question: 'How was your visit?' } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.create(user, 'store1', { question: 'How was your visit?' } as any)).rejects.toThrow(
                NotFoundException,
            );
            expect(prisma.feedbackQuestion.create).not.toHaveBeenCalled();
        });

        it('auto-translates the question, defaults type to RATING, and sort_order to 0', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.feedbackQuestion.create.mockResolvedValue({ id: 'q1' });

            await service.create(user, 'store1', { question: 'How was your visit?' } as any);

            expect(prisma.feedbackQuestion.create).toHaveBeenCalledWith({
                data: {
                    store_id: 'store1',
                    question: { en: 'How was your visit?', el: 'How was your visit?' },
                    type: FeedbackQuestionType.RATING,
                    sort_order: 0,
                },
            });
        });

        it('respects an explicit type and sort_order', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.feedbackQuestion.create.mockResolvedValue({ id: 'q1' });

            await service.create(user, 'store1', {
                question: 'Anything else?',
                type: FeedbackQuestionType.TEXT,
                sort_order: 3,
            } as any);

            expect(prisma.feedbackQuestion.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ type: FeedbackQuestionType.TEXT, sort_order: 3 }),
                }),
            );
        });
    });

    describe('findAll', () => {
        it('asserts store access (no role restriction) and orders by sort_order', async () => {
            prisma.feedbackQuestion.findMany.mockResolvedValue([{ id: 'q1' }]);

            const result = await service.findAll(user, 'store1', {} as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.feedbackQuestion.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                orderBy: { sort_order: 'asc' },
            });
            expect(result).toEqual([{ id: 'q1' }]);
        });

        it('applies the is_active filter when provided', async () => {
            prisma.feedbackQuestion.findMany.mockResolvedValue([]);

            await service.findAll(user, 'store1', { is_active: true } as any);

            expect(prisma.feedbackQuestion.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', is_active: true } }),
            );
        });
    });

    describe('update', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the question is missing', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue(null);

            await expect(service.update(user, 'store1', 'q1', {} as any)).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('only writes fields present on the DTO when the question text is not changing', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue({ id: 'q1', question: { en: 'Old?' } });
            prisma.feedbackQuestion.update.mockResolvedValue({ id: 'q1' });

            await service.update(user, 'store1', 'q1', { is_active: false } as any);

            expect(prisma.store.findUnique).not.toHaveBeenCalled();
            expect(prisma.feedbackQuestion.update).toHaveBeenCalledWith({ where: { id: 'q1' }, data: { is_active: false } });
        });

        it('throws NotFoundException when changing the question text but the store no longer exists', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue({ id: 'q1', question: { en: 'Old?' } });
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'store1', 'q1', { question: 'New?' } as any)).rejects.toThrow(NotFoundException);
            expect(prisma.feedbackQuestion.update).not.toHaveBeenCalled();
        });

        it('re-translates the question text (preserving existing overrides) when it changes', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue({ id: 'q1', question: { en: 'Old?', el: 'Custom Greek?' } });
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.feedbackQuestion.update.mockResolvedValue({ id: 'q1' });

            await service.update(user, 'store1', 'q1', { question: 'New?', type: FeedbackQuestionType.TEXT } as any);

            expect(prisma.feedbackQuestion.update).toHaveBeenCalledWith({
                where: { id: 'q1' },
                data: { question: { en: 'New?', el: 'Custom Greek?' }, type: FeedbackQuestionType.TEXT },
            });
        });
    });

    describe('remove', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the question is missing', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue(null);

            await expect(service.remove(user, 'store1', 'q1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.feedbackQuestion.delete).not.toHaveBeenCalled();
        });

        it('deletes the question and returns success', async () => {
            prisma.feedbackQuestion.findFirst.mockResolvedValue({ id: 'q1' });

            const result = await service.remove(user, 'store1', 'q1');

            expect(prisma.feedbackQuestion.delete).toHaveBeenCalledWith({ where: { id: 'q1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
