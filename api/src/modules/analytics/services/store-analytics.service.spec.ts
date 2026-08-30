import { AuthRole, TipStatus } from 'generated/prisma';
import { StoreAnalyticsService } from './store-analytics.service';
import { bucketKey } from '../utils/period.utils';

describe('StoreAnalyticsService', () => {
    let service: StoreAnalyticsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            tip: { findMany: jest.fn() },
            employee: { findMany: jest.fn() },
            store: { findUnique: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new StoreAnalyticsService(prisma, accessControl);
    });

    describe('tips', () => {
        it('checks store access and scopes the query to COMPLETED tips for the store', async () => {
            prisma.tip.findMany.mockResolvedValue([]);

            await service.tips(user, 'store1', { group_by: 'day' } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { store_id: 'store1', status: TipStatus.COMPLETED } }),
            );
        });

        it('adds date_from/date_to to the where clause when provided', async () => {
            prisma.tip.findMany.mockResolvedValue([]);

            await service.tips(user, 'store1', {
                group_by: 'day',
                date_from: '2026-01-01',
                date_to: '2026-01-31',
            } as any);

            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        store_id: 'store1',
                        status: TipStatus.COMPLETED,
                        created_at: { gte: new Date('2026-01-01'), lte: new Date('2026-01-31') },
                    },
                }),
            );
        });

        it('adds employee_id and qr_code_id to the where clause when provided', async () => {
            prisma.tip.findMany.mockResolvedValue([]);

            await service.tips(user, 'store1', { group_by: 'day', employee_id: 'e1', qr_code_id: 'qr1' } as any);

            expect(prisma.tip.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { store_id: 'store1', status: TipStatus.COMPLETED, employee_id: 'e1', qr_code_id: 'qr1' },
                }),
            );
        });

        it('computes total_amount, count, and a rounded average_amount', async () => {
            prisma.tip.findMany.mockResolvedValue([
                { id: 't1', amount: 100, created_at: new Date(), employee_id: 'e1' },
                { id: 't2', amount: 201, created_at: new Date(), employee_id: 'e1' },
            ]);
            prisma.employee.findMany.mockResolvedValue([{ id: 'e1', full_name: { en: 'Alice' } }]);
            prisma.store.findUnique.mockResolvedValue({ primary_language: 'EN' });

            const result = await service.tips(user, 'store1', { group_by: 'employee' } as any);

            expect(result.total_amount).toBe(301);
            expect(result.count).toBe(2);
            expect(result.average_amount).toBe(151); // round(301/2)
        });

        it('returns average_amount 0 when there are no tips', async () => {
            prisma.tip.findMany.mockResolvedValue([]);

            const result = await service.tips(user, 'store1', { group_by: 'day' } as any);

            expect(result).toEqual({ total_amount: 0, count: 0, average_amount: 0, breakdown: [] });
        });

        describe('breakdown grouping', () => {
            it('group_by=employee: groups by employee, labels unattributed tips, and looks up employee names', async () => {
                prisma.tip.findMany.mockResolvedValue([
                    { id: 't1', amount: 100, created_at: new Date(), employee_id: 'e1' },
                    { id: 't2', amount: 50, created_at: new Date(), employee_id: null },
                ]);
                prisma.employee.findMany.mockResolvedValue([{ id: 'e1', full_name: { en: 'Alice' } }]);
                prisma.store.findUnique.mockResolvedValue({ primary_language: 'EN' });

                const result = await service.tips(user, 'store1', { group_by: 'employee' } as any);

                expect(result.breakdown).toEqual(
                    expect.arrayContaining([
                        { key: 'e1', label: 'Alice', amount: 100, count: 1 },
                        { key: 'unattributed', label: 'Unattributed', amount: 50, count: 1 },
                    ]),
                );
                expect(prisma.employee.findMany).toHaveBeenCalledWith({
                    where: { id: { in: ['e1'] } },
                    select: { id: true, full_name: true },
                });
            });

            it('group_by=employee: labels an employee "Unknown" if the employee record is missing', async () => {
                prisma.tip.findMany.mockResolvedValue([
                    { id: 't1', amount: 100, created_at: new Date(), employee_id: 'deleted-emp' },
                ]);
                prisma.employee.findMany.mockResolvedValue([]);

                const result = await service.tips(user, 'store1', { group_by: 'employee' } as any);

                expect(result.breakdown).toEqual([{ key: 'deleted-emp', label: 'Unknown', amount: 100, count: 1 }]);
            });

            it('group_by=store: returns a single breakdown row for the whole store', async () => {
                prisma.tip.findMany.mockResolvedValue([
                    { id: 't1', amount: 100, created_at: new Date(), employee_id: null },
                    { id: 't2', amount: 50, created_at: new Date(), employee_id: null },
                ]);
                prisma.store.findUnique.mockResolvedValue({ name: 'Main St' });

                const result = await service.tips(user, 'store1', { group_by: 'store' } as any);

                expect(result.breakdown).toEqual([{ key: 'store1', label: 'Main St', amount: 150, count: 2 }]);
            });

            it('group_by=store: labels "Unknown" if the store lookup somehow returns nothing', async () => {
                prisma.tip.findMany.mockResolvedValue([]);
                prisma.store.findUnique.mockResolvedValue(null);

                const result = await service.tips(user, 'store1', { group_by: 'store' } as any);

                expect(result.breakdown).toEqual([{ key: 'store1', label: 'Unknown', amount: 0, count: 0 }]);
            });

            it('group_by=day/week/month: buckets by date using bucketKey', async () => {
                const d1 = new Date('2026-06-15T09:00:00Z');
                prisma.tip.findMany.mockResolvedValue([
                    { id: 't1', amount: 100, created_at: d1, employee_id: null },
                    { id: 't2', amount: 50, created_at: d1, employee_id: null },
                ]);

                const result = await service.tips(user, 'store1', { group_by: 'day' } as any);

                expect(result.breakdown).toEqual([{ bucket: bucketKey(d1, 'day'), amount: 150, count: 2 }]);
            });
        });
    });
});
