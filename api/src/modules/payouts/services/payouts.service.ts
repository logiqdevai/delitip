import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';
import { VivaConfig } from '@/integrations/viva/viva.config';
import { VivaBankTransfersService } from '@/integrations/viva/services/viva-bank-transfers.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { RunPayoutDto } from '../dto/run-payout.dto';
import { PayoutsQueryType } from '../dto/payouts-query.schema';
import {
  DistributionRecipientType,
  OrganizationRole,
  PayoutAccountStatus,
  PayoutExecutionStatus,
  PayoutStatus,
  TipStatus,
} from 'generated/prisma';

interface RecipientGroup {
  key: string;
  recipientType: DistributionRecipientType;
  storeId?: string;
  employeeId?: string;
  distributionIds: string[];
  amount: number;
  currency: string;
}

export interface SkippedRecipient {
  recipient_type: DistributionRecipientType;
  employee_id?: string;
  reason: 'NO_PAYOUT_ACCOUNT' | 'ACCOUNT_NOT_ACTIVE' | 'NO_LINKED_USER' | 'TRANSFER_FAILED';
}

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
    private readonly platformFinanceConfig: PlatformFinanceConfig,
    private readonly vivaConfig: VivaConfig,
    private readonly vivaBankTransfers: VivaBankTransfersService,
  ) {}

  async run(user: AuthUser, storeId: string, dto: RunPayoutDto) {
    await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

    const walletId = this.vivaConfig.getWalletId();
    if (!walletId) {
      throw new BadRequestException('VIVA_WALLET_ID is not configured — payouts cannot be executed yet');
    }

    const groups = await this.loadEligibleGroups(storeId, dto.employee_id);
    const payouts: any[] = [];
    const skipped: SkippedRecipient[] = [];

    for (const group of groups) {
      const account = await this.resolvePayoutAccount(group);
      if (!account.payoutAccount) {
        skipped.push({ recipient_type: group.recipientType, employee_id: group.employeeId, reason: account.reason! });
        continue;
      }

      const claimed = await this.claimGroup(group, account.payoutAccount.id, walletId);
      if (!claimed) continue;

      const executed = await this.executeTransfer(claimed, account.payoutAccount.bank_account_id!, walletId);
      payouts.push(executed);
      if (executed.status === PayoutExecutionStatus.FAILED) {
        skipped.push({ recipient_type: group.recipientType, employee_id: group.employeeId, reason: 'TRANSFER_FAILED' });
      }
    }

    return { payouts, skipped_recipients: skipped };
  }

  private async loadEligibleGroups(storeId: string, employeeIdFilter?: string): Promise<RecipientGroup[]> {
    const holdWindowHours = this.platformFinanceConfig.getPayoutHoldWindowHours();
    const holdCutoff = new Date(Date.now() - holdWindowHours * 60 * 60 * 1000);

    const distributions = await this.prisma.tipDistribution.findMany({
      where: {
        payout_id: null,
        payout_status: PayoutStatus.PENDING,
        ...(employeeIdFilter ? { employee_id: employeeIdFilter } : {}),
        tip: {
          store_id: storeId,
          status: TipStatus.COMPLETED,
          paid_at: { lte: holdCutoff },
          payment_transaction: { processor_fee_confirmed: true },
        },
      },
      include: { tip: true },
    });

    const groups = new Map<string, RecipientGroup>();
    for (const distribution of distributions) {
      const key = distribution.recipient_type === DistributionRecipientType.STORE ? 'STORE' : `EMPLOYEE:${distribution.employee_id}`;
      const existing = groups.get(key);
      if (existing) {
        existing.distributionIds.push(distribution.id);
        existing.amount += distribution.amount;
      } else {
        groups.set(key, {
          key,
          recipientType: distribution.recipient_type,
          storeId: distribution.recipient_type === DistributionRecipientType.STORE ? storeId : undefined,
          employeeId: distribution.employee_id ?? undefined,
          distributionIds: [distribution.id],
          amount: distribution.amount,
          currency: distribution.tip.currency,
        });
      }
    }

    return Array.from(groups.values());
  }

  private async resolvePayoutAccount(
    group: RecipientGroup,
  ): Promise<{ payoutAccount: { id: string; bank_account_id: string | null } | null; reason?: SkippedRecipient['reason'] }> {
    let payoutAccount;

    if (group.recipientType === DistributionRecipientType.STORE) {
      payoutAccount = await this.prisma.payoutAccount.findUnique({ where: { store_id: group.storeId } });
    } else {
      const employee = await this.prisma.employee.findUnique({ where: { id: group.employeeId } });
      if (!employee?.user_id) {
        return { payoutAccount: null, reason: 'NO_LINKED_USER' };
      }
      payoutAccount = await this.prisma.payoutAccount.findUnique({ where: { user_id: employee.user_id } });
    }

    if (!payoutAccount) {
      return { payoutAccount: null, reason: 'NO_PAYOUT_ACCOUNT' };
    }

    if (payoutAccount.status === PayoutAccountStatus.PENDING && payoutAccount.bank_account_id) {
      payoutAccount = await this.tryPromoteToActive(payoutAccount.id, payoutAccount.bank_account_id);
    }

    if (payoutAccount.status !== PayoutAccountStatus.ACTIVE || !payoutAccount.bank_account_id) {
      return { payoutAccount: null, reason: 'ACCOUNT_NOT_ACTIVE' };
    }

    return { payoutAccount: { id: payoutAccount.id, bank_account_id: payoutAccount.bank_account_id } };
  }

  // Viva's linked-bank-account response has no documented "verified" field
  // (see VivaBankAccount) — `isArchived === false` is the closest available
  // signal, so it's the pragmatic proxy used here pending confirmation from
  // Viva on the actual validation semantics (payment plan §19).
  private async tryPromoteToActive(payoutAccountId: string, bankAccountId: string) {
    try {
      const remote = await this.vivaBankTransfers.getBankAccount(bankAccountId);
      if (remote.isArchived) {
        return this.prisma.payoutAccount.findUniqueOrThrow({ where: { id: payoutAccountId } });
      }
      return await this.prisma.payoutAccount.update({
        where: { id: payoutAccountId },
        data: { status: PayoutAccountStatus.ACTIVE },
      });
    } catch (error) {
      this.logger.warn(`Could not verify bank account ${bankAccountId}: ${error instanceof Error ? error.message : error}`);
      return this.prisma.payoutAccount.findUniqueOrThrow({ where: { id: payoutAccountId } });
    }
  }

  private async claimGroup(group: RecipientGroup, payoutAccountId: string, _walletId: number) {
    return this.prisma.$transaction(async (tx) => {
      const payout = await tx.payout.create({
        data: {
          recipient_type: group.recipientType,
          store_id: group.storeId,
          employee_id: group.employeeId,
          payout_account_id: payoutAccountId,
          amount: group.amount,
          currency: group.currency as any,
          status: PayoutExecutionStatus.PROCESSING,
        },
      });

      const claim = await tx.tipDistribution.updateMany({
        where: { id: { in: group.distributionIds }, payout_id: null, payout_status: PayoutStatus.PENDING },
        data: { payout_id: payout.id, payout_status: PayoutStatus.PROCESSING },
      });

      if (claim.count === 0) {
        await tx.payout.delete({ where: { id: payout.id } });
        return null;
      }

      if (claim.count < group.distributionIds.length) {
        const actual = await tx.tipDistribution.aggregate({
          where: { payout_id: payout.id },
          _sum: { amount: true },
        });
        await tx.payout.update({ where: { id: payout.id }, data: { amount: actual._sum.amount ?? 0 } });
      }

      return tx.payout.findUniqueOrThrow({ where: { id: payout.id } });
    });
  }

  private async executeTransfer(payout: any, bankAccountId: string, walletId: number) {
    try {
      const instructionTypesResponse = await this.vivaBankTransfers.getInstructionTypes(bankAccountId, payout.amount);
      const instructionTypes = instructionTypesResponse.instructionTypes ?? [];
      if (instructionTypes.length === 0) {
        throw new Error('No supported bank transfer instruction types for this account');
      }

      const fee = await this.vivaBankTransfers.createBankTransferFee(bankAccountId, {
        amount: payout.amount,
        walletId,
        instructionType: instructionTypes,
      });

      const execution = await this.vivaBankTransfers.executeBankTransfer(bankAccountId, {
        amount: payout.amount,
        walletId,
        bankCommandId: fee.bankCommandId,
        description: 'Delitip tip payout',
      });

      return this.prisma.payout.update({
        where: { id: payout.id },
        data: { provider_transfer_id: execution.commandId ?? fee.bankCommandId },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Bank transfer failed for payout ${payout.id}: ${message}`);

      return this.prisma.$transaction(async (tx) => {
        const failed = await tx.payout.update({
          where: { id: payout.id },
          data: { status: PayoutExecutionStatus.FAILED, failure_reason: message },
        });
        await tx.tipDistribution.updateMany({
          where: { payout_id: payout.id },
          data: { payout_id: null, payout_status: PayoutStatus.PENDING },
        });
        return failed;
      });
    }
  }

  async findForStore(user: AuthUser, storeId: string, query: PayoutsQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER, OrganizationRole.ACCOUNTANT]);

    const where = { OR: [{ store_id: storeId }, { employee: { store_id: storeId } }] };
    const [items, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        include: { employee: true, payout_account: true },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payout.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  async findForEmployee(user: AuthUser, employeeId: string, query: PayoutsQueryType) {
    await this.accessControl.assertEmployeeSelfOrStoreAccess(user, employeeId);

    const where = { employee_id: employeeId };
    const [items, total] = await Promise.all([
      this.prisma.payout.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payout.count({ where }),
    ]);

    return paginate(items, total, query);
  }
}
