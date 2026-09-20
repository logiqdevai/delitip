import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { resolveTranslatedText, TranslatedText } from '@/shared/utils/translation/translation.utils';
import { buildSettlementsCsv } from '../utils/settlements-csv.utils';
import { CreateSettlementDto } from '../dto/create-settlement.dto';
import {
  OwedDistributionsQueryType,
  SettlementBalancesQueryType,
  SettlementsExportQueryType,
  SettlementsQueryType,
} from '../dto/settlements-query.schema';
import {
  Currency,
  DistributionPayoutMode,
  DistributionRecipientType,
  Language,
  OrganizationRole,
  PayoutStatus,
  Prisma,
  SettlementAdjustmentStatus,
  SettlementStatus,
} from 'generated/prisma';

// Handing over cash is a money-moving act a manager on shift performs, so the
// role set matches refund approval rather than the stricter payout-run set.
const RECORD_ROLES: OrganizationRole[] = [
  OrganizationRole.OWNER,
  OrganizationRole.ACCOUNTANT,
  OrganizationRole.STORE_MANAGER,
];

export interface EmployeeBalance {
  employee_id: string;
  name: string;
  currency: Currency;
  earned_amount: number;
  received_by_store_amount: number;
  settled_amount: number;
  outstanding_amount: number;
  pending_adjustments_amount: number;
  owed_shares_count: number;
}

@Injectable()
export class SettlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
  ) {}

  private dateRange(from?: string, to?: string) {
    if (!from && !to) return undefined;
    return {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    };
  }

  private async storeLanguage(storeId: string): Promise<Language> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { primary_language: true },
    });
    return store?.primary_language ?? Language.EN;
  }

  private employeeName(fullName: unknown, language: Language): string {
    return resolveTranslatedText(fullName as TranslatedText, undefined, language) || 'Employee';
  }

  // Every share a Store is holding on an employee's behalf, settled or not.
  // CANCELLED rows are excluded everywhere: a refunded tip was never owed.
  private pooledSharesFilter(storeId: string, createdAt?: Prisma.DateTimeFilter): Prisma.TipDistributionWhereInput {
    return {
      recipient_type: DistributionRecipientType.EMPLOYEE,
      payout_mode: DistributionPayoutMode.VIA_STORE,
      settlement_status: { in: [SettlementStatus.OWED, SettlementStatus.SETTLED] },
      tip: { store_id: storeId },
      ...(createdAt ? { created_at: createdAt } : {}),
    };
  }

  async balances(user: AuthUser, storeId: string, query: SettlementBalancesQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    const createdAt = this.dateRange(query.date_from, query.date_to);
    const baseFilter = this.pooledSharesFilter(storeId, createdAt);

    const [byStatus, receivedByStore, adjustments, language] = await Promise.all([
      this.prisma.tipDistribution.groupBy({
        by: ['employee_id', 'settlement_status'],
        where: baseFilter,
        _sum: { amount: true },
        _count: { _all: true },
      }),
      // What has actually reached the Store's bank so far. The rest is money
      // the Store may still be fronting out of its own pocket.
      this.prisma.tipDistribution.groupBy({
        by: ['employee_id'],
        where: { ...baseFilter, payout_status: PayoutStatus.PAID },
        _sum: { amount: true },
      }),
      this.prisma.settlementAdjustment.groupBy({
        by: ['employee_id'],
        where: { store_id: storeId, status: SettlementAdjustmentStatus.PROPOSED },
        _sum: { amount: true },
      }),
      this.storeLanguage(storeId),
    ]);

    const employeeIds = Array.from(
      new Set(
        [...byStatus, ...adjustments]
          .map((row) => row.employee_id)
          .filter((id): id is string => !!id),
      ),
    );

    if (employeeIds.length === 0) return { currency: null, data: [] };

    const [employees, store] = await Promise.all([
      this.prisma.employee.findMany({
        where: { id: { in: employeeIds } },
        select: { id: true, full_name: true },
      }),
      this.prisma.store.findUnique({ where: { id: storeId }, select: { currency: true } }),
    ]);
    const nameById = new Map(employees.map((employee) => [employee.id, employee.full_name]));

    const sumFor = (employeeId: string, status: SettlementStatus) =>
      byStatus
        .filter((row) => row.employee_id === employeeId && row.settlement_status === status)
        .reduce((total, row) => total + (row._sum.amount ?? 0), 0);

    const rows: EmployeeBalance[] = employeeIds.map((employeeId) => {
      const outstanding = sumFor(employeeId, SettlementStatus.OWED);
      const settled = sumFor(employeeId, SettlementStatus.SETTLED);

      return {
        employee_id: employeeId,
        name: this.employeeName(nameById.get(employeeId), language),
        currency: store?.currency ?? Currency.EUR,
        earned_amount: outstanding + settled,
        received_by_store_amount:
          receivedByStore.find((row) => row.employee_id === employeeId)?._sum.amount ?? 0,
        settled_amount: settled,
        outstanding_amount: outstanding,
        pending_adjustments_amount:
          adjustments.find((row) => row.employee_id === employeeId)?._sum.amount ?? 0,
        owed_shares_count: byStatus
          .filter((row) => row.employee_id === employeeId && row.settlement_status === SettlementStatus.OWED)
          .reduce((total, row) => total + row._count._all, 0),
      };
    });

    const visible = query.include_settled
      ? rows
      : rows.filter((row) => row.outstanding_amount !== 0 || row.pending_adjustments_amount !== 0);

    return {
      currency: store?.currency ?? Currency.EUR,
      data: visible.sort((a, b) => b.outstanding_amount - a.outstanding_amount),
    };
  }

  // The picker behind "Record payment": the individual shares a Store can
  // choose to settle. A share is settleable as soon as its tip completed —
  // waiting for our bank transfer would stop a Store paying staff the same
  // night, which is the whole point of doing it in cash.
  async owedDistributions(user: AuthUser, storeId: string, query: OwedDistributionsQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    const where: Prisma.TipDistributionWhereInput = {
      employee_id: query.employee_id,
      recipient_type: DistributionRecipientType.EMPLOYEE,
      payout_mode: DistributionPayoutMode.VIA_STORE,
      settlement_status: SettlementStatus.OWED,
      tip: { store_id: storeId },
      ...(this.dateRange(query.date_from, query.date_to)
        ? { created_at: this.dateRange(query.date_from, query.date_to) }
        : {}),
    };

    const [items, total, totals] = await Promise.all([
      this.prisma.tipDistribution.findMany({
        where,
        include: { tip: { select: { id: true, amount: true, currency: true, created_at: true, paid_at: true } } },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'asc' },
      }),
      this.prisma.tipDistribution.count({ where }),
      this.prisma.tipDistribution.aggregate({ where, _sum: { amount: true } }),
    ]);

    const data = items.map((item) => ({
      id: item.id,
      amount: item.amount,
      percentage: item.percentage,
      currency: item.tip.currency,
      created_at: item.created_at,
      tip: item.tip,
      // Whether our transfer for this share has landed in the Store's account
      // yet. It can settle either way — this only tells the Store whether it's
      // handing over money it already has.
      received_by_store: item.payout_status === PayoutStatus.PAID,
    }));

    return { ...paginate(data, total, query), total_owed_amount: totals._sum.amount ?? 0 };
  }

  async proposedAdjustments(user: AuthUser, storeId: string, employeeId: string) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    return this.prisma.settlementAdjustment.findMany({
      where: {
        store_id: storeId,
        employee_id: employeeId,
        status: SettlementAdjustmentStatus.PROPOSED,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async create(user: AuthUser, storeId: string, dto: CreateSettlementDto) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    const distributionIds = Array.from(new Set(dto.distribution_ids));
    const adjustmentIds = Array.from(new Set(dto.adjustment_ids ?? []));

    const [distributions, adjustments, employee, language] = await Promise.all([
      this.prisma.tipDistribution.findMany({
        where: {
          id: { in: distributionIds },
          employee_id: dto.employee_id,
          recipient_type: DistributionRecipientType.EMPLOYEE,
          payout_mode: DistributionPayoutMode.VIA_STORE,
          settlement_status: SettlementStatus.OWED,
          tip: { store_id: storeId },
        },
        include: { tip: { select: { currency: true } } },
      }),
      adjustmentIds.length
        ? this.prisma.settlementAdjustment.findMany({
            where: {
              id: { in: adjustmentIds },
              store_id: storeId,
              employee_id: dto.employee_id,
              status: SettlementAdjustmentStatus.PROPOSED,
            },
          })
        : Promise.resolve([]),
      this.prisma.employee.findFirst({
        where: { id: dto.employee_id, store_id: storeId },
        select: { id: true, full_name: true },
      }),
      this.storeLanguage(storeId),
    ]);

    if (!employee) throw new NotFoundException('Employee not found in this store');

    if (distributions.length !== distributionIds.length) {
      throw new BadRequestException(
        'Some of those shares are no longer owed — they may have been settled already or their tip refunded. Reload and try again.',
      );
    }

    if (adjustments.length !== adjustmentIds.length) {
      throw new BadRequestException('Some of those deductions are no longer available. Reload and try again.');
    }

    const currencies = new Set(distributions.map((distribution) => distribution.tip.currency));
    if (currencies.size > 1) {
      throw new BadRequestException('Those shares are in different currencies — settle each currency separately');
    }

    const distributionTotal = distributions.reduce((total, distribution) => total + distribution.amount, 0);
    const adjustmentTotal = adjustments.reduce((total, adjustment) => total + adjustment.amount, 0);
    const amount = distributionTotal + adjustmentTotal;

    if (amount < 0) {
      throw new BadRequestException(
        'The deductions come to more than the shares selected. Select more shares or leave some deductions for next time.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const settlement = await tx.settlement.create({
        data: {
          store_id: storeId,
          employee_id: employee.id,
          employee_name_snapshot: this.employeeName(employee.full_name, language),
          amount,
          currency: [...currencies][0] ?? Currency.EUR,
          settled_at: dto.settled_at ? new Date(dto.settled_at) : new Date(),
          note: dto.note,
          reference: dto.reference,
          recorded_by_user_id: user.id,
        },
      });

      // Conditional on still being OWED, the same way a payout run claims its
      // rows — two people recording the same handover can't settle it twice.
      const claimed = await tx.tipDistribution.updateMany({
        where: { id: { in: distributionIds }, settlement_status: SettlementStatus.OWED },
        data: {
          settlement_status: SettlementStatus.SETTLED,
          settlement_id: settlement.id,
          settled_at: settlement.settled_at,
        },
      });

      if (claimed.count !== distributionIds.length) {
        throw new ConflictException(
          'Someone recorded a handover for some of those shares at the same time. Reload and try again.',
        );
      }

      if (adjustmentIds.length) {
        await tx.settlementAdjustment.updateMany({
          where: { id: { in: adjustmentIds }, status: SettlementAdjustmentStatus.PROPOSED },
          data: { status: SettlementAdjustmentStatus.APPLIED, settlement_id: settlement.id },
        });
      }

      return tx.settlement.findUnique({
        where: { id: settlement.id },
        include: { distributions: true, adjustments: true },
      });
    });
  }

  // Undo, not delete: a financial record stays, flagged, with its shares
  // returned to owed so they can be settled properly.
  async reverse(user: AuthUser, id: string) {
    const settlement = await this.prisma.settlement.findUnique({ where: { id } });
    if (!settlement) throw new NotFoundException('Settlement not found');

    await this.accessControl.assertStoreAccess(user, settlement.store_id, RECORD_ROLES);

    if (settlement.reversed_at) throw new ConflictException('This handover was already reversed');

    return this.prisma.$transaction(async (tx) => {
      await tx.tipDistribution.updateMany({
        where: { settlement_id: id },
        data: {
          settlement_status: SettlementStatus.OWED,
          settlement_id: null,
          settled_at: null,
        },
      });

      await tx.settlementAdjustment.updateMany({
        where: { settlement_id: id },
        data: { status: SettlementAdjustmentStatus.PROPOSED, settlement_id: null },
      });

      return tx.settlement.update({
        where: { id },
        data: { reversed_at: new Date(), reversed_by_user_id: user.id },
      });
    });
  }

  // The employee's own acknowledgement. Deliberately not something the Store
  // can do on their behalf — that's the entire value of the record.
  async confirm(user: AuthUser, id: string) {
    const settlement = await this.prisma.settlement.findUnique({ where: { id } });
    if (!settlement) throw new NotFoundException('Settlement not found');
    if (!settlement.employee_id) throw new NotFoundException('Settlement not found');

    const { isSelf } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, settlement.employee_id);
    if (!isSelf) {
      throw new ForbiddenException('Only the employee who received it can confirm a handover');
    }

    if (settlement.reversed_at) throw new ConflictException('This handover was reversed');
    if (settlement.confirmed_by_employee_at) return settlement;

    return this.prisma.settlement.update({
      where: { id },
      data: { confirmed_by_employee_at: new Date() },
    });
  }

  async findForStore(user: AuthUser, storeId: string, query: SettlementsQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    const where: Prisma.SettlementWhereInput = {
      store_id: storeId,
      ...(query.employee_id ? { employee_id: query.employee_id } : {}),
      ...(query.unconfirmed_only ? { confirmed_by_employee_at: null, reversed_at: null } : {}),
      ...(this.dateRange(query.date_from, query.date_to)
        ? { settled_at: this.dateRange(query.date_from, query.date_to) }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.settlement.findMany({
        where,
        include: { distributions: { select: { id: true, amount: true } }, adjustments: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { settled_at: 'desc' },
      }),
      this.prisma.settlement.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  async findForEmployee(user: AuthUser, employeeId: string, query: SettlementsQueryType) {
    await this.accessControl.assertEmployeeSelfOrStoreAccess(user, employeeId);

    const where: Prisma.SettlementWhereInput = { employee_id: employeeId };
    const [items, total] = await Promise.all([
      this.prisma.settlement.findMany({
        where,
        include: { distributions: { select: { id: true, amount: true } }, adjustments: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { settled_at: 'desc' },
      }),
      this.prisma.settlement.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  // What an employee is still owed, for their own portal. Same numbers the
  // Store sees, so neither side can be surprised by the other's version.
  async employeeBalance(user: AuthUser, employeeId: string) {
    const { employee } = await this.accessControl.assertEmployeeSelfOrStoreAccess(user, employeeId);

    const [byStatus, received, store] = await Promise.all([
      this.prisma.tipDistribution.groupBy({
        by: ['settlement_status'],
        where: {
          employee_id: employeeId,
          recipient_type: DistributionRecipientType.EMPLOYEE,
          payout_mode: DistributionPayoutMode.VIA_STORE,
          settlement_status: { in: [SettlementStatus.OWED, SettlementStatus.SETTLED] },
        },
        _sum: { amount: true },
      }),
      this.prisma.settlement.aggregate({
        where: { employee_id: employeeId, reversed_at: null },
        _sum: { amount: true },
        _count: { _all: true },
      }),
      this.prisma.store.findUnique({ where: { id: employee.store_id }, select: { currency: true } }),
    ]);

    const sumFor = (status: SettlementStatus) =>
      byStatus.find((row) => row.settlement_status === status)?._sum.amount ?? 0;

    return {
      currency: store?.currency ?? Currency.EUR,
      outstanding_amount: sumFor(SettlementStatus.OWED),
      settled_amount: sumFor(SettlementStatus.SETTLED),
      earned_amount: sumFor(SettlementStatus.OWED) + sumFor(SettlementStatus.SETTLED),
      settlements_count: received._count._all,
    };
  }

  async exportCsv(user: AuthUser, storeId: string, query: SettlementsExportQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, RECORD_ROLES);

    const createdAt = this.dateRange(query.date_from, query.date_to);
    const [shares, language, store] = await Promise.all([
      this.prisma.tipDistribution.findMany({
        where: {
          ...this.pooledSharesFilter(storeId, createdAt),
          ...(query.employee_id ? { employee_id: query.employee_id } : {}),
        },
        include: {
          employee: { select: { id: true, full_name: true } },
          tip: { select: { id: true, amount: true, currency: true, created_at: true, payment_transaction: true } },
          settlement: { select: { id: true, settled_at: true, reference: true, confirmed_by_employee_at: true } },
        },
        orderBy: { created_at: 'asc' },
      }),
      this.storeLanguage(storeId),
      this.prisma.store.findUnique({ where: { id: storeId }, select: { name: true } }),
    ]);

    const csv = buildSettlementsCsv(
      shares.map((share) => ({
        tip_id: share.tip.id,
        earned_at: share.created_at,
        employee_name: this.employeeName(share.employee?.full_name, language),
        tip_amount: share.tip.amount,
        share_percentage: Number(share.percentage),
        net_earned: share.amount,
        currency: share.tip.currency,
        received_by_store: share.payout_status === PayoutStatus.PAID,
        settled_at: share.settlement?.settled_at ?? null,
        settlement_reference: share.settlement?.reference ?? null,
        confirmed_by_employee: !!share.settlement?.confirmed_by_employee_at,
      })),
    );

    const slug = (store?.name ?? 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return { csv, filename: `${slug}-staff-balances-${new Date().toISOString().slice(0, 10)}.csv` };
  }
}
