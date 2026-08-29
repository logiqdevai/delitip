import { NotFoundException } from '@nestjs/common';
import { AuthRole, AlertType } from 'generated/prisma';
import { AlertsService } from './alerts.service';

describe('AlertsService', () => {
    let service: AlertsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            alert: {
                findMany: jest.fn(),
                count: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                updateMany: jest.fn(),
            },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new AlertsService(prisma, accessControl);
    });

    describe('findAll', () => {
        const baseQuery = { page: 1, limit: 20 };

        it('checks store access and paginates the result', async () => {
            prisma.alert.findMany.mockResolvedValue([{ id: 'a1' }]);
            prisma.alert.count.mockResolvedValue(1);

            const result = await service.findAll(user, 'store1', baseQuery as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(result).toEqual({
                data: [{ id: 'a1' }],
                pagination: { total: 1, page: 1, limit: 20, total_pages: 1, has_next: false, has_prev: false },
            });
        });

        it('always scopes the where clause to the store', async () => {
            prisma.alert.findMany.mockResolvedValue([]);
            prisma.alert.count.mockResolvedValue(0);

            await service.findAll(user, 'store1', baseQuery as any);

            expect(prisma.alert.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1' } }),
            );
        });

        it('adds is_read to the where clause only when defined', async () => {
            prisma.alert.findMany.mockResolvedValue([]);
            prisma.alert.count.mockResolvedValue(0);

            await service.findAll(user, 'store1', { ...baseQuery, is_read: false } as any);

            expect(prisma.alert.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', is_read: false } }),
            );
        });

        it('adds type to the where clause when provided', async () => {
            prisma.alert.findMany.mockResolvedValue([]);
            prisma.alert.count.mockResolvedValue(0);

            await service.findAll(user, 'store1', { ...baseQuery, type: AlertType.LOW_RATING_REVIEW } as any);

            expect(prisma.alert.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', type: AlertType.LOW_RATING_REVIEW } }),
            );
        });

        it('adds employee_id to the where clause when provided', async () => {
            prisma.alert.findMany.mockResolvedValue([]);
            prisma.alert.count.mockResolvedValue(0);

            await service.findAll(user, 'store1', { ...baseQuery, employee_id: 'emp1' } as any);

            expect(prisma.alert.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', employee_id: 'emp1' } }),
            );
        });

        it('applies pagination skip/take from the query', async () => {
            prisma.alert.findMany.mockResolvedValue([]);
            prisma.alert.count.mockResolvedValue(0);

            await service.findAll(user, 'store1', { page: 3, limit: 10 } as any);

            expect(prisma.alert.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 20, take: 10 }));
        });
    });

    describe('markRead', () => {
        it('throws NotFoundException when the alert does not exist', async () => {
            prisma.alert.findUnique.mockResolvedValue(null);

            await expect(service.markRead(user, 'a1')).rejects.toThrow(NotFoundException);
            expect(accessControl.assertStoreAccess).not.toHaveBeenCalled();
        });

        it('checks store access using the alert store_id, then marks it read', async () => {
            prisma.alert.findUnique.mockResolvedValue({ id: 'a1', store_id: 'store1' });
            prisma.alert.update.mockResolvedValue({ id: 'a1', is_read: true });

            const result = await service.markRead(user, 'a1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.alert.update).toHaveBeenCalledWith({ where: { id: 'a1' }, data: { is_read: true } });
            expect(result).toEqual({ id: 'a1', is_read: true });
        });
    });

    describe('markAllRead', () => {
        it('checks store access and marks every unread alert for the store as read', async () => {
            prisma.alert.updateMany.mockResolvedValue({ count: 4 });

            const result = await service.markAllRead(user, 'store1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.alert.updateMany).toHaveBeenCalledWith({
                where: { store_id: 'store1', is_read: false },
                data: { is_read: true },
            });
            expect(result).toEqual({ success: true, updated_count: 4 });
        });
    });
});
