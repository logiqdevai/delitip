import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, ReviewSentiment } from 'generated/prisma';
import { ReviewTagsService } from './review-tags.service';

describe('ReviewTagsService', () => {
    let service: ReviewTagsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const MANAGE_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER];

    beforeEach(() => {
        prisma = {
            reviewTag: {
                create: jest.fn(),
                findUnique: jest.fn(),
                findMany: jest.fn(),
                findFirst: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new ReviewTagsService(prisma, accessControl);
    });

    describe('create', () => {
        it('asserts MANAGE_ROLES store access', async () => {
            prisma.reviewTag.findUnique.mockResolvedValue(null);
            prisma.reviewTag.create.mockResolvedValue({ id: 't1' });

            await service.create(user, 'store1', { name: 'Friendly service', sentiment: ReviewSentiment.POSITIVE } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('throws ConflictException when a tag with the same name already exists for the store', async () => {
            prisma.reviewTag.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(
                service.create(user, 'store1', { name: 'Friendly service', sentiment: ReviewSentiment.POSITIVE } as any),
            ).rejects.toThrow(ConflictException);
            expect(prisma.reviewTag.create).not.toHaveBeenCalled();
        });

        it('creates the tag scoped to the store with the given name/sentiment', async () => {
            prisma.reviewTag.findUnique.mockResolvedValue(null);
            prisma.reviewTag.create.mockResolvedValue({ id: 't1' });

            await service.create(user, 'store1', { name: 'Slow service', sentiment: ReviewSentiment.NEGATIVE } as any);

            expect(prisma.reviewTag.create).toHaveBeenCalledWith({
                data: { store_id: 'store1', name: 'Slow service', sentiment: ReviewSentiment.NEGATIVE },
            });
        });
    });

    describe('findAll', () => {
        it('asserts store access (no role restriction)', async () => {
            prisma.reviewTag.findMany.mockResolvedValue([]);

            await service.findAll(user, 'store1', {} as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.reviewTag.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                orderBy: { created_at: 'desc' },
            });
        });

        it('applies sentiment and is_active filters when provided', async () => {
            prisma.reviewTag.findMany.mockResolvedValue([]);

            await service.findAll(user, 'store1', { sentiment: ReviewSentiment.POSITIVE, is_active: true } as any);

            expect(prisma.reviewTag.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { store_id: 'store1', sentiment: ReviewSentiment.POSITIVE, is_active: true },
                }),
            );
        });
    });

    describe('update', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the tag is missing', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue(null);

            await expect(service.update(user, 'store1', 't1', {} as any)).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
        });

        it('does not re-check uniqueness when the name is unchanged', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue({ id: 't1', name: 'Same name' });
            prisma.reviewTag.update.mockResolvedValue({ id: 't1' });

            await service.update(user, 'store1', 't1', { name: 'Same name' } as any);

            expect(prisma.reviewTag.findUnique).not.toHaveBeenCalled();
        });

        it('throws ConflictException when renaming to a name already used by another tag in the store', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue({ id: 't1', name: 'Old name' });
            prisma.reviewTag.findUnique.mockResolvedValue({ id: 't2' });

            await expect(service.update(user, 'store1', 't1', { name: 'Taken name' } as any)).rejects.toThrow(ConflictException);
            expect(prisma.reviewTag.update).not.toHaveBeenCalled();
        });

        it('updates only the fields present on the DTO', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue({ id: 't1', name: 'Old name' });
            prisma.reviewTag.findUnique.mockResolvedValue(null);
            prisma.reviewTag.update.mockResolvedValue({ id: 't1' });

            await service.update(user, 'store1', 't1', { name: 'New name', is_active: false } as any);

            expect(prisma.reviewTag.update).toHaveBeenCalledWith({
                where: { id: 't1' },
                data: { name: 'New name', is_active: false },
            });
        });
    });

    describe('remove', () => {
        it('asserts MANAGE_ROLES access and throws NotFoundException when the tag is missing', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue(null);

            await expect(service.remove(user, 'store1', 't1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', MANAGE_ROLES);
            expect(prisma.reviewTag.delete).not.toHaveBeenCalled();
        });

        it('deletes the tag and returns success', async () => {
            prisma.reviewTag.findFirst.mockResolvedValue({ id: 't1' });

            const result = await service.remove(user, 'store1', 't1');

            expect(prisma.reviewTag.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
