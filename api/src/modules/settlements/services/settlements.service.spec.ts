import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  AuthRole,
  DistributionPayoutMode,
  DistributionRecipientType,
  OrganizationRole,
  PayoutStatus,
  SettlementAdjustmentStatus,
  SettlementStatus,
} from 'generated/prisma';
import { SettlementsService } from './settlements.service';

describe('SettlementsService', () => {
  let service: SettlementsService;
  let prisma: any;
  let accessControl: any;

  const user = { id: 'u1', role: AuthRole.USER };
  const RECORD_ROLES = [OrganizationRole.OWNER, OrganizationRole.ACCOUNTANT, OrganizationRole.STORE_MANAGER];

  const owedShare = (overrides: Partial<any> = {}) => ({
    id: 'dist1',
    employee_id: 'emp1',
    amount: 500,
    percentage: 70,
    payout_status: PayoutStatus.PENDING,
    settlement_status: SettlementStatus.OWED,
    created_at: new Date('2026-09-01'),
    tip: { id: 'tip1', amount: 1000, currency: 'EUR', created_at: new Date('2026-09-01'), paid_at: null },
    ...overrides,
  });

  // balances() issues two groupBy calls on the same delegate; keying off the
  // `by` shape keeps the mocks stable when a test calls it more than once.
  const mockBalanceGroupBy = (byStatus: any[], receivedByStore: any[]) => {
    prisma.tipDistribution.groupBy.mockImplementation(({ by }: any) =>
      Promise.resolve(by.includes('settlement_status') ? byStatus : receivedByStore),
    );
  };

  beforeEach(() => {
    prisma = {
      tipDistribution: {
        findMany: jest.fn().mockResolvedValue([]),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        groupBy: jest.fn().mockResolvedValue([]),
        aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 0 } }),
        count: jest.fn().mockResolvedValue(0),
      },
      settlement: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn(),
        count: jest.fn().mockResolvedValue(0),
        aggregate: jest.fn().mockResolvedValue({ _sum: { amount: 0 }, _count: { _all: 0 } }),
      },
      settlementAdjustment: {
        findMany: jest.fn().mockResolvedValue([]),
        groupBy: jest.fn().mockResolvedValue([]),
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      employee: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn() },
      store: { findUnique: jest.fn().mockResolvedValue({ primary_language: 'EN', currency: 'EUR', name: 'Kafeneio' }) },
      $transaction: jest.fn((fn) => fn(prisma)),
    };
    accessControl = {
      assertStoreAccess: jest.fn(),
      assertEmployeeSelfOrStoreAccess: jest.fn().mockResolvedValue({
        employee: { id: 'emp1', store_id: 'store1' },
        isSelf: true,
      }),
    };
    service = new SettlementsService(prisma, accessControl);
  });

  describe('balances', () => {
    it('lets a Store Manager see balances, not just the Owner', async () => {
      await service.balances(user, 'store1', {} as any);

      expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', RECORD_ROLES);
    });

    it('splits what an employee earned into what is settled and what is still outstanding', async () => {
      mockBalanceGroupBy(
        [
          { employee_id: 'emp1', settlement_status: SettlementStatus.OWED, _sum: { amount: 700 }, _count: { _all: 2 } },
          { employee_id: 'emp1', settlement_status: SettlementStatus.SETTLED, _sum: { amount: 300 }, _count: { _all: 1 } },
        ],
        [{ employee_id: 'emp1', _sum: { amount: 400 } }],
      );
      prisma.settlementAdjustment.groupBy.mockResolvedValue([{ employee_id: 'emp1', _sum: { amount: -50 } }]);
      prisma.employee.findMany.mockResolvedValue([{ id: 'emp1', full_name: { en: 'Maria' } }]);

      const result = await service.balances(user, 'store1', {} as any);

      expect(result.data).toEqual([
        expect.objectContaining({
          employee_id: 'emp1',
          name: 'Maria',
          earned_amount: 1000,
          settled_amount: 300,
          outstanding_amount: 700,
          // Only part of it has actually reached the Store's bank — the rest
          // it would be fronting.
          received_by_store_amount: 400,
          pending_adjustments_amount: -50,
          owed_shares_count: 2,
        }),
      ]);
    });

    it('hides employees who are square unless asked for', async () => {
      mockBalanceGroupBy(
        [{ employee_id: 'emp1', settlement_status: SettlementStatus.SETTLED, _sum: { amount: 300 }, _count: { _all: 1 } }],
        [],
      );
      prisma.employee.findMany.mockResolvedValue([{ id: 'emp1', full_name: { en: 'Maria' } }]);

      expect((await service.balances(user, 'store1', {} as any)).data).toEqual([]);
      expect((await service.balances(user, 'store1', { include_settled: true } as any)).data).toHaveLength(1);
    });
  });

  describe('owedDistributions', () => {
    it('flags which shares have actually reached the Store and which it would front', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([
        owedShare({ id: 'arrived', payout_status: PayoutStatus.PAID }),
        owedShare({ id: 'not-yet', payout_status: PayoutStatus.PENDING }),
      ]);
      prisma.tipDistribution.count.mockResolvedValue(2);
      prisma.tipDistribution.aggregate.mockResolvedValue({ _sum: { amount: 1000 } });

      const result = await service.owedDistributions(user, 'store1', {
        employee_id: 'emp1',
        page: 1,
        limit: 20,
      } as any);

      expect(result.data.map((row: any) => row.received_by_store)).toEqual([true, false]);
      expect(result.total_owed_amount).toBe(1000);
      // A share is settleable as soon as its tip completed, so payout_status
      // is reported but never filtered on.
      expect(prisma.tipDistribution.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            settlement_status: SettlementStatus.OWED,
            payout_mode: DistributionPayoutMode.VIA_STORE,
            recipient_type: DistributionRecipientType.EMPLOYEE,
          }),
        }),
      );
      expect(prisma.tipDistribution.findMany.mock.calls[0][0].where.payout_status).toBeUndefined();
    });
  });

  describe('create', () => {
    const dto = { employee_id: 'emp1', distribution_ids: ['dist1', 'dist2'] } as any;

    beforeEach(() => {
      prisma.employee.findFirst.mockResolvedValue({ id: 'emp1', full_name: { en: 'Maria' } });
      prisma.settlement.create.mockResolvedValue({ id: 'set1', settled_at: new Date('2026-09-20') });
      prisma.settlement.findUnique.mockResolvedValue({ id: 'set1' });
    });

    it('derives the amount from the selected shares rather than trusting the client', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([
        owedShare({ id: 'dist1', amount: 500 }),
        owedShare({ id: 'dist2', amount: 250 }),
      ]);
      prisma.tipDistribution.updateMany.mockResolvedValue({ count: 2 });

      await service.create(user, 'store1', { ...dto, amount: 99999 });

      expect(prisma.settlement.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ amount: 750, employee_name_snapshot: 'Maria', recorded_by_user_id: 'u1' }),
        }),
      );
    });

    it('subtracts applied deductions from the handover', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([owedShare({ id: 'dist1', amount: 500 }), owedShare({ id: 'dist2', amount: 250 })]);
      prisma.settlementAdjustment.findMany.mockResolvedValue([{ id: 'adj1', amount: -100 }]);
      prisma.tipDistribution.updateMany.mockResolvedValue({ count: 2 });

      await service.create(user, 'store1', { ...dto, adjustment_ids: ['adj1'] });

      expect(prisma.settlement.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ amount: 650 }) }),
      );
      expect(prisma.settlementAdjustment.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['adj1'] }, status: SettlementAdjustmentStatus.PROPOSED },
        data: { status: SettlementAdjustmentStatus.APPLIED, settlement_id: 'set1' },
      });
    });

    it('rejects deductions that come to more than the shares selected', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([owedShare({ id: 'dist1', amount: 100 }), owedShare({ id: 'dist2', amount: 100 })]);
      prisma.settlementAdjustment.findMany.mockResolvedValue([{ id: 'adj1', amount: -900 }]);

      await expect(service.create(user, 'store1', { ...dto, adjustment_ids: ['adj1'] })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rejects a share that is no longer owed', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([owedShare({ id: 'dist1' })]);

      await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
      expect(prisma.settlement.create).not.toHaveBeenCalled();
    });

    it('rolls back when another handover claimed the same shares first', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([owedShare({ id: 'dist1' }), owedShare({ id: 'dist2' })]);
      prisma.tipDistribution.updateMany.mockResolvedValue({ count: 1 });

      await expect(service.create(user, 'store1', dto)).rejects.toThrow(ConflictException);
    });

    it('refuses to mix currencies in one handover', async () => {
      prisma.tipDistribution.findMany.mockResolvedValue([
        owedShare({ id: 'dist1', tip: { ...owedShare().tip, currency: 'EUR' } }),
        owedShare({ id: 'dist2', tip: { ...owedShare().tip, currency: 'GBP' } }),
      ]);

      await expect(service.create(user, 'store1', dto)).rejects.toThrow(BadRequestException);
    });

    it('404s when the employee does not belong to this store', async () => {
      prisma.employee.findFirst.mockResolvedValue(null);
      prisma.tipDistribution.findMany.mockResolvedValue([owedShare({ id: 'dist1' }), owedShare({ id: 'dist2' })]);

      await expect(service.create(user, 'store1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reverse', () => {
    it('returns the shares to owed and releases the deductions, keeping the record', async () => {
      prisma.settlement.findUnique.mockResolvedValue({ id: 'set1', store_id: 'store1', reversed_at: null });

      await service.reverse(user, 'set1');

      expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
        where: { settlement_id: 'set1' },
        data: { settlement_status: SettlementStatus.OWED, settlement_id: null, settled_at: null },
      });
      expect(prisma.settlementAdjustment.updateMany).toHaveBeenCalledWith({
        where: { settlement_id: 'set1' },
        data: { status: SettlementAdjustmentStatus.PROPOSED, settlement_id: null },
      });
      expect(prisma.settlement.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ reversed_by_user_id: 'u1' }) }),
      );
    });

    it('refuses to reverse the same handover twice', async () => {
      prisma.settlement.findUnique.mockResolvedValue({ id: 'set1', store_id: 'store1', reversed_at: new Date() });

      await expect(service.reverse(user, 'set1')).rejects.toThrow(ConflictException);
    });
  });

  describe('confirm', () => {
    it('lets the employee acknowledge they received it', async () => {
      prisma.settlement.findUnique.mockResolvedValue({ id: 'set1', employee_id: 'emp1', reversed_at: null });

      await service.confirm(user, 'set1');

      expect(prisma.settlement.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ confirmed_by_employee_at: expect.any(Date) }) }),
      );
    });

    it('does not let the Store confirm on the employee behalf', async () => {
      prisma.settlement.findUnique.mockResolvedValue({ id: 'set1', employee_id: 'emp1', reversed_at: null });
      accessControl.assertEmployeeSelfOrStoreAccess.mockResolvedValue({
        employee: { id: 'emp1', store_id: 'store1' },
        isSelf: false,
      });

      await expect(service.confirm(user, 'set1')).rejects.toThrow(ForbiddenException);
      expect(prisma.settlement.update).not.toHaveBeenCalled();
    });

    it('is idempotent once confirmed', async () => {
      prisma.settlement.findUnique.mockResolvedValue({
        id: 'set1',
        employee_id: 'emp1',
        reversed_at: null,
        confirmed_by_employee_at: new Date(),
      });

      await service.confirm(user, 'set1');

      expect(prisma.settlement.update).not.toHaveBeenCalled();
    });
  });
});
