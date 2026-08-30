import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
    let service: UsersService;
    let prisma: any;

    beforeEach(() => {
        prisma = {
            user: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            organizationMember: { findMany: jest.fn() },
            employee: { findMany: jest.fn() },
            tip: { findFirst: jest.fn() },
            review: { findFirst: jest.fn() },
        };
        service = new UsersService(prisma);
    });

    describe('findOrCreateByEmail', () => {
        it('returns the existing user without creating one when the email is already registered', async () => {
            const existing = { id: 'u1', email: 'a@b.com' };
            prisma.user.findUnique.mockResolvedValue(existing);

            const result = await service.findOrCreateByEmail('a@b.com');

            expect(result).toBe(existing);
            expect(prisma.user.create).not.toHaveBeenCalled();
        });

        it('creates a new user with the provided name/phone hints when none exists', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const created = { id: 'u2', email: 'new@b.com' };
            prisma.user.create.mockResolvedValue(created);

            const result = await service.findOrCreateByEmail('new@b.com', { first_name: 'Nikos', last_name: 'P', phone: '123' });

            expect(result).toBe(created);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: 'new@b.com', first_name: 'Nikos', last_name: 'P', phone: '123' },
            });
        });

        it('creates a new user with undefined optional fields when no hints are given', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue({ id: 'u3', email: 'bare@b.com' });

            await service.findOrCreateByEmail('bare@b.com');

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: 'bare@b.com', first_name: undefined, last_name: undefined, phone: undefined },
            });
        });
    });

    describe('getById', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.getById('missing')).rejects.toThrow(NotFoundException);
        });

        it('returns the user with the password field stripped', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hashed' });

            const result = await service.getById('u1');

            expect(result).toEqual({ id: 'u1', email: 'a@b.com' });
        });
    });

    describe('updateProfile', () => {
        it('updates the user and strips the password field from the result', async () => {
            prisma.user.update.mockResolvedValue({ id: 'u1', first_name: 'New', password: 'hashed' });

            const result = await service.updateProfile('u1', { first_name: 'New' } as any);

            expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { first_name: 'New' } });
            expect(result).toEqual({ id: 'u1', first_name: 'New' });
        });
    });

    describe('getMyAccounts', () => {
        it('reports has_customer_account: true when the user has a tip', async () => {
            prisma.organizationMember.findMany.mockResolvedValue([{ id: 'om1' }]);
            prisma.employee.findMany.mockResolvedValue([
                { id: 'e1', full_name: { en: 'Alice' }, store: { primary_language: 'EN' } },
            ]);
            prisma.tip.findFirst.mockResolvedValue({ id: 't1' });

            const result = await service.getMyAccounts('u1');

            expect(result).toEqual({
                organization_memberships: [{ id: 'om1' }],
                employee_accounts: [
                    {
                        id: 'e1',
                        full_name: 'Alice',
                        full_name_translations: { en: 'Alice' },
                        store: { primary_language: 'EN' },
                    },
                ],
                has_customer_account: true,
            });
            expect(prisma.review.findFirst).not.toHaveBeenCalled();
        });

        it('reports has_customer_account: true when the user has no tip but has a review', async () => {
            prisma.organizationMember.findMany.mockResolvedValue([]);
            prisma.employee.findMany.mockResolvedValue([]);
            prisma.tip.findFirst.mockResolvedValue(null);
            prisma.review.findFirst.mockResolvedValue({ id: 'r1' });

            const result = await service.getMyAccounts('u1');

            expect(result.has_customer_account).toBe(true);
            expect(prisma.review.findFirst).toHaveBeenCalledWith({ where: { customer_user_id: 'u1' }, select: { id: true } });
        });

        it('reports has_customer_account: false when there is neither a tip nor a review', async () => {
            prisma.organizationMember.findMany.mockResolvedValue([]);
            prisma.employee.findMany.mockResolvedValue([]);
            prisma.tip.findFirst.mockResolvedValue(null);
            prisma.review.findFirst.mockResolvedValue(null);

            const result = await service.getMyAccounts('u1');

            expect(result.has_customer_account).toBe(false);
        });
    });

    describe('findAll', () => {
        it('queries without a search filter when none is provided', async () => {
            prisma.user.findMany.mockResolvedValue([{ id: 'u1', password: 'hashed' }]);
            prisma.user.count.mockResolvedValue(1);

            const result = await service.findAll({ page: 1, limit: 20 } as any);

            expect(prisma.user.findMany).toHaveBeenCalledWith({
                where: {},
                skip: 0,
                take: 20,
                orderBy: { created_at: 'desc' },
            });
            expect(result.data).toEqual([{ id: 'u1' }]); // password stripped
            expect(result.pagination.total).toBe(1);
        });

        it('builds a case-insensitive OR search filter across email/first_name/last_name and paginates correctly', async () => {
            prisma.user.findMany.mockResolvedValue([]);
            prisma.user.count.mockResolvedValue(45);

            const result = await service.findAll({ page: 2, limit: 20, search: 'nik' } as any);

            expect(prisma.user.findMany).toHaveBeenCalledWith({
                where: {
                    OR: [
                        { email: { contains: 'nik', mode: 'insensitive' } },
                        { first_name: { contains: 'nik', mode: 'insensitive' } },
                        { last_name: { contains: 'nik', mode: 'insensitive' } },
                    ],
                },
                skip: 20,
                take: 20,
                orderBy: { created_at: 'desc' },
            });
            expect(result.pagination).toEqual({
                total: 45,
                page: 2,
                limit: 20,
                total_pages: 3,
                has_next: true,
                has_prev: true,
            });
        });

        it('strips the password field from every returned user', async () => {
            prisma.user.findMany.mockResolvedValue([
                { id: 'u1', password: 'a' },
                { id: 'u2', password: 'b' },
            ]);
            prisma.user.count.mockResolvedValue(2);

            const result = await service.findAll({ page: 1, limit: 20 } as any);

            expect(result.data).toEqual([{ id: 'u1' }, { id: 'u2' }]);
        });
    });
});
