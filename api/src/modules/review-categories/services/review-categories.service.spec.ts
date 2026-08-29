import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, Language, OrganizationRole } from 'generated/prisma';
import { ReviewCategoriesService } from './review-categories.service';

describe('ReviewCategoriesService', () => {
    let service: ReviewCategoriesService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const MANAGE_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];
    const store = { id: 'store1', primary_language: Language.EN, supported_languages: [Language.EN, Language.EL] };

    beforeEach(() => {
        prisma = {
            store: { findUnique: jest.fn() },
            reviewCategory: {
                create: jest.fn(),
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new ReviewCategoriesService(prisma, accessControl);
    });

    describe('create', () => {
        it('asserts MANAGE_ROLES store access', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.reviewCategory.create.mockResolvedValue({ id: 'c1' });

            await service.create(user, 'store1', { name: 'Friendliness' } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('throws NotFoundException when the store does not exist', async () => {
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.create(user, 'store1', { name: 'Friendliness' } as any)).rejects.toThrow(NotFoundException);
            expect(prisma.reviewCategory.create).not.toHaveBeenCalled();
        });

        it('auto-translates the name across supported languages and defaults sort_order to 0', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.reviewCategory.create.mockResolvedValue({ id: 'c1' });

            await service.create(user, 'store1', { name: 'Friendliness' } as any);

            expect(prisma.reviewCategory.create).toHaveBeenCalledWith({
                data: {
                    store_id: 'store1',
                    name: { en: 'Friendliness', el: 'Friendliness' },
                    sort_order: 0,
                },
            });
        });

        it('respects an explicit sort_order', async () => {
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.reviewCategory.create.mockResolvedValue({ id: 'c1' });

            await service.create(user, 'store1', { name: 'Friendliness', sort_order: 5 } as any);

            expect(prisma.reviewCategory.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ sort_order: 5 }) }),
            );
        });
    });

    describe('findAll', () => {
        it('asserts store access (no role restriction) and orders by sort_order', async () => {
            prisma.reviewCategory.findMany.mockResolvedValue([{ id: 'c1' }]);

            const result = await service.findAll(user, 'store1', {} as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.reviewCategory.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                orderBy: { sort_order: 'asc' },
            });
            expect(result).toEqual([{ id: 'c1' }]);
        });

        it('applies the is_active filter when provided', async () => {
            prisma.reviewCategory.findMany.mockResolvedValue([]);

            await service.findAll(user, 'store1', { is_active: false } as any);

            expect(prisma.reviewCategory.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', is_active: false } }),
            );
        });
    });

    describe('update', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the category is missing', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue(null);

            await expect(service.update(user, 'store1', 'c1', {} as any)).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('only writes fields present on the DTO when name is not changing', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue({ id: 'c1', name: { en: 'Old' } });
            prisma.reviewCategory.update.mockResolvedValue({ id: 'c1' });

            await service.update(user, 'store1', 'c1', { is_active: false } as any);

            expect(prisma.store.findUnique).not.toHaveBeenCalled();
            expect(prisma.reviewCategory.update).toHaveBeenCalledWith({ where: { id: 'c1' }, data: { is_active: false } });
        });

        it('throws NotFoundException when changing the name but the store no longer exists', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue({ id: 'c1', name: { en: 'Old' } });
            prisma.store.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'store1', 'c1', { name: 'New' } as any)).rejects.toThrow(NotFoundException);
            expect(prisma.reviewCategory.update).not.toHaveBeenCalled();
        });

        it('re-translates the name (preserving existing overrides) when name changes', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue({ id: 'c1', name: { en: 'Old', el: 'Custom Greek' } });
            prisma.store.findUnique.mockResolvedValue(store);
            prisma.reviewCategory.update.mockResolvedValue({ id: 'c1' });

            await service.update(user, 'store1', 'c1', { name: 'New', sort_order: 2 } as any);

            expect(prisma.reviewCategory.update).toHaveBeenCalledWith({
                where: { id: 'c1' },
                data: { name: { en: 'New', el: 'Custom Greek' }, sort_order: 2 },
            });
        });
    });

    describe('remove', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the category is missing', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue(null);

            await expect(service.remove(user, 'store1', 'c1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.reviewCategory.delete).not.toHaveBeenCalled();
        });

        it('deletes the category and returns success', async () => {
            prisma.reviewCategory.findFirst.mockResolvedValue({ id: 'c1' });

            const result = await service.remove(user, 'store1', 'c1');

            expect(prisma.reviewCategory.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
