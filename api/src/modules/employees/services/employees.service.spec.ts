import { NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, PayoutStatus } from 'generated/prisma';
import { EmployeesService } from './employees.service';

describe('EmployeesService', () => {
    let service: EmployeesService;
    let prisma: any;
    let accessControl: any;
    let usersService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            employee: { create: jest.fn(), findMany: jest.fn(), count: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
            tipDistribution: { findMany: jest.fn(), count: jest.fn() },
            review: { aggregate: jest.fn(), count: jest.fn(), findMany: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn(), assertEmployeeSelfOrStoreAccess: jest.fn() };
        usersService = { findOrCreateByEmail: jest.fn() };
        service = new EmployeesService(prisma, accessControl, usersService);
    });

    describe('create', () => {
        it('asserts OWNER/STORE_MANAGER access, links/creates the user by email, and creates the employee', async () => {
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'linked-user' });
            const created = { id: 'emp1' };
            prisma.employee.create.mockResolvedValue(created);

            const dto = { full_name: 'Maria Papadopoulou', email: 'maria@example.com', position: 'Waiter', photo_document_id: 'doc1' } as any;
            const result = await service.create(user, 'store1', dto);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('maria@example.com', { first_name: 'Maria' });
            expect(prisma.employee.create).toHaveBeenCalledWith({
                data: {
                    store_id: 'store1',
                    user_id: 'linked-user',
                    full_name: 'Maria Papadopoulou',
                    email: 'maria@example.com',
                    position: 'Waiter',
                    photo_document_id: 'doc1',
                },
            });
            expect(result).toBe(created);
        });

        it('derives the first name from a single-word full_name', async () => {
            usersService.findOrCreateByEmail.mockResolvedValue({ id: 'u2' });
            prisma.employee.create.mockResolvedValue({});

            await service.create(user, 'store1', { full_name: '  Nikos  ', email: 'n@example.com' } as any);

            expect(usersService.findOrCreateByEmail).toHaveBeenCalledWith('n@example.com', { first_name: 'Nikos' });
        });
    });

    describe('findAllForStore', () => {
        it('asserts store access and paginates', async () => {
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1' }]);
            prisma.employee.count.mockResolvedValue(1);

            const result = await service.findAllForStore(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.employee.findMany).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                skip: 0,
                take: 20,
                orderBy: { created_at: 'desc' },
                include: { photo_document: true },
            });
            expect(result.data).toEqual([{ id: 'e1' }]);
        });

        it('applies the is_active filter when provided', async () => {
            prisma.employee.findMany.mockResolvedValue([]);
            prisma.employee.count.mockResolvedValue(0);

            await service.findAllForStore(user, 'store1', { page: 1, limit: 20, is_active: false } as any);

            expect(prisma.employee.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', is_active: false } }),
            );
        });
    });

    describe('findOne', () => {
        it('delegates access resolution to assertEmployeeSelfOrStoreAccess and fetches the full record', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({ employee: { id: 'emp1' }, isSelf: true });
            const full = { id: 'emp1', photo_document: null };
            prisma.employee.findUnique.mockResolvedValue(full);

            const result = await service.findOne(user, 'emp1');

            expect(accessControl.assertEmployeeSelfOrStoreAccess).toHaveBeenCalledWith(user, 'emp1');
            expect(prisma.employee.findUnique).toHaveBeenCalledWith({
                where: { id: 'emp1' },
                include: { photo_document: true },
            });
            expect(result).toBe(full);
        });
    });

    describe('update', () => {
        it('delegates access resolution to assertEmployeeSelfOrStoreAccess', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({
                employee: { id: 'emp1', store_id: 'store1' },
                isSelf: false,
            });
            const updated = { id: 'emp1', position: 'Manager' };
            prisma.employee.update.mockResolvedValue(updated);

            const result = await service.update(user, 'emp1', { position: 'Manager' } as any);

            expect(accessControl.assertEmployeeSelfOrStoreAccess).toHaveBeenCalledWith(user, 'emp1', [
                OrganizationRole.OWNER,
                OrganizationRole.STORE_MANAGER,
            ]);
            expect(prisma.employee.update).toHaveBeenCalledWith({ where: { id: 'emp1' }, data: { position: 'Manager' } });
            expect(result).toBe(updated);
        });

        it('restricts a self-service update to only photo_document_id', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({
                employee: { id: 'emp1', store_id: 'store1' },
                isSelf: true,
            });
            prisma.employee.update.mockResolvedValue({ id: 'emp1', photo_document_id: 'doc1' });

            await service.update(user, 'emp1', { photo_document_id: 'doc1', position: 'Manager' } as any);

            expect(prisma.employee.update).toHaveBeenCalledWith({ where: { id: 'emp1' }, data: { photo_document_id: 'doc1' } });
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the employee does not exist', async () => {
            prisma.employee.findUnique.mockResolvedValue(null);

            await expect(service.remove(user, 'emp1')).rejects.toThrow(NotFoundException);
            expect(prisma.employee.delete).not.toHaveBeenCalled();
        });

        it('asserts OWNER/STORE_MANAGER access and deletes the employee', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'emp1', store_id: 'store1' });

            const result = await service.remove(user, 'emp1');

            expect(prisma.employee.delete).toHaveBeenCalledWith({ where: { id: 'emp1' } });
            expect(result).toEqual({ success: true });
        });
    });

    describe('dashboard', () => {
        it('aggregates this month\'s tip distributions, review stats, and recent feedback', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({ employee: { id: 'emp1' }, isSelf: true });
            prisma.tipDistribution.findMany.mockResolvedValue([
                { amount: 500, tip: { distribution_rule: { name: 'Standard Split' } } },
                { amount: 300, tip: { distribution_rule: { name: 'Standard Split' } } },
                { amount: 200, tip: { distribution_rule: null } },
            ]);
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });
            prisma.review.count.mockResolvedValue(7);
            prisma.review.findMany.mockResolvedValue([{ comment: 'Great!', rating: 5, created_at: new Date('2026-01-01') }]);

            const result = await service.dashboard(user, 'emp1');

            expect(result.tips_this_month.total_amount).toBe(1000);
            expect(result.tips_this_month.by_distribution_rule).toEqual(
                expect.arrayContaining([
                    { rule_name: 'Standard Split', total_amount: 800 },
                    { rule_name: 'No rule', total_amount: 200 },
                ]),
            );
            expect(result.average_rating).toBe(4.5);
            expect(result.reviews_count).toBe(7);
            expect(result.customer_recognition_count).toBe(7);
            expect(result.recent_feedback).toHaveLength(1);
        });

        it('handles zero distributions this month without throwing', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({ employee: { id: 'emp1' }, isSelf: true });
            prisma.tipDistribution.findMany.mockResolvedValue([]);
            prisma.review.aggregate.mockResolvedValue({ _avg: { rating: null } });
            prisma.review.count.mockResolvedValue(0);
            prisma.review.findMany.mockResolvedValue([]);

            const result = await service.dashboard(user, 'emp1');

            expect(result.tips_this_month).toEqual({ total_amount: 0, by_distribution_rule: [] });
            expect(result.average_rating).toBeNull();
        });
    });

    describe('tips', () => {
        it('delegates access resolution and paginates the employee\'s tip distributions', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({ employee: { id: 'emp1' }, isSelf: false });
            prisma.tipDistribution.findMany.mockResolvedValue([{ id: 'td1' }]);
            prisma.tipDistribution.count.mockResolvedValue(1);

            const result = await service.tips(user, 'emp1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertEmployeeSelfOrStoreAccess).toHaveBeenCalledWith(user, 'emp1');
            expect(prisma.tipDistribution.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { employee_id: 'emp1', payout_status: { not: PayoutStatus.CANCELLED } },
                }),
            );
            expect(result.data).toEqual([{ id: 'td1' }]);
        });
    });

    describe('reviews', () => {
        it('delegates access resolution and paginates the employee\'s reviews', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({ employee: { id: 'emp1' }, isSelf: true });
            prisma.review.findMany.mockResolvedValue([{ id: 'r1' }]);
            prisma.review.count.mockResolvedValue(1);

            const result = await service.reviews(user, 'emp1', { page: 1, limit: 20 } as any);

            expect(prisma.review.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { employee_id: 'emp1' } }));
            expect(result.data).toEqual([{ id: 'r1' }]);
        });
    });
});
