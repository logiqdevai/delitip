import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole } from 'generated/prisma';
import { SpotsService } from './spots.service';

describe('SpotsService', () => {
    let service: SpotsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            spot: {
                create: jest.fn(),
                findMany: jest.fn(),
                count: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new SpotsService(prisma, accessControl);
    });

    describe('create', () => {
        it('asserts OWNER/STORE_MANAGER store access and creates the spot', async () => {
            const created = { id: 'spot1', store_id: 'store1', name: 'Table 12' };
            prisma.spot.create.mockResolvedValue(created);

            const result = await service.create(user, 'store1', { name: 'Table 12' } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(prisma.spot.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Table 12' } });
            expect(result).toBe(created);
        });

        it('propagates the ForbiddenException from access-control without creating anything', async () => {
            accessControl.assertStoreAccess.mockRejectedValue(new ForbiddenException());

            await expect(service.create(user, 'store1', { name: 'x' } as any)).rejects.toThrow(ForbiddenException);
            expect(prisma.spot.create).not.toHaveBeenCalled();
        });
    });

    describe('findAllForStore', () => {
        it('asserts store access (no role restriction) and paginates without an is_active filter', async () => {
            prisma.spot.findMany.mockResolvedValue([{ id: 's1' }]);
            prisma.spot.count.mockResolvedValue(1);

            const result = await service.findAllForStore(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.spot.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                skip: 0,
                take: 20,
                orderBy: { created_at: 'desc' },
            });
            expect(result).toEqual({
                data: [{ id: 's1' }],
                pagination: { total: 1, page: 1, limit: 20, total_pages: 1, has_next: false, has_prev: false },
            });
        });

        it('applies the is_active filter when provided', async () => {
            prisma.spot.findMany.mockResolvedValue([]);
            prisma.spot.count.mockResolvedValue(0);

            await service.findAllForStore(user, 'store1', { page: 2, limit: 10, is_active: true } as any);

            expect(prisma.spot.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1', is_active: true },
                skip: 10,
                take: 10,
                orderBy: { created_at: 'desc' },
            });
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the spot does not exist', async () => {
            prisma.spot.findUnique.mockResolvedValue(null);

            await expect(service.findOne(user, 'spot1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).not.toHaveBeenCalled();
        });

        it('asserts store access using the spot store_id and returns the spot', async () => {
            const spot = { id: 'spot1', store_id: 'store1' };
            prisma.spot.findUnique.mockResolvedValue(spot);

            const result = await service.findOne(user, 'spot1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toBe(spot);
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the spot does not exist', async () => {
            prisma.spot.findUnique.mockResolvedValue(null);

            await expect(service.update(user, 'spot1', { name: 'x' } as any)).rejects.toThrow(NotFoundException);
        });

        it('asserts OWNER/STORE_MANAGER access and updates the spot', async () => {
            const spot = { id: 'spot1', store_id: 'store1' };
            prisma.spot.findUnique.mockResolvedValue(spot);
            const updated = { ...spot, name: 'New name' };
            prisma.spot.update.mockResolvedValue(updated);

            const result = await service.update(user, 'spot1', { name: 'New name' } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(prisma.spot.update).toHaveBeenCalledWith({ where: { id: 'spot1' }, data: { name: 'New name' } });
            expect(result).toBe(updated);
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the spot does not exist', async () => {
            prisma.spot.findUnique.mockResolvedValue(null);

            await expect(service.remove(user, 'spot1')).rejects.toThrow(NotFoundException);
            expect(prisma.spot.delete).not.toHaveBeenCalled();
        });

        it('asserts OWNER/STORE_MANAGER access, deletes the spot, and returns success', async () => {
            const spot = { id: 'spot1', store_id: 'store1' };
            prisma.spot.findUnique.mockResolvedValue(spot);

            const result = await service.remove(user, 'spot1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(prisma.spot.delete).toHaveBeenCalledWith({ where: { id: 'spot1' } });
            expect(result).toEqual({ success: true });
        });
    });
});
