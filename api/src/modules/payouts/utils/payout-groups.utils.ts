import { DistributionPayoutMode, DistributionRecipientType, PayoutStatus, Prisma, TipStatus } from 'generated/prisma';

// One transfer's worth of distributions: everything a single bank account
// receives in a payout run. Under a VIA_STORE rule a Store's transfer carries
// its own share plus the shares it collected for its staff; the split is kept
// so the Store (and its accountant) can see which part isn't theirs to keep.
export interface RecipientGroup {
  key: string;
  recipientType: DistributionRecipientType;
  storeId?: string;
  employeeId?: string;
  distributionIds: string[];
  amount: number;
  ownShare: number;
  heldForStaff: number;
  currency: string;
}

export const STORE_GROUP_KEY = 'STORE';

// The single definition of "payable right now". Shared by the self-service
// payout run and by payout-request submission so the two can never drift:
// unclaimed, not locked into an invoice-backed request, tip settled, hold
// window elapsed, and Viva's real fee confirmed.
export function eligibleDistributionsWhere(
  storeId: string,
  holdCutoff: Date,
  employeeIdFilter?: string,
): Prisma.TipDistributionWhereInput {
  return {
    payout_id: null,
    payout_request_id: null,
    payout_status: PayoutStatus.PENDING,
    ...(employeeIdFilter ? { employee_id: employeeIdFilter } : {}),
    tip: {
      store_id: storeId,
      status: TipStatus.COMPLETED,
      paid_at: { lte: holdCutoff },
      payment_transaction: { processor_fee_confirmed: true },
    },
  };
}

export interface GroupableDistribution {
  id: string;
  recipient_type: DistributionRecipientType;
  employee_id: string | null;
  payout_mode: DistributionPayoutMode;
  amount: number;
  tip: { currency: string };
}

// A share earned under a VIA_STORE rule is transferred to the Store, not to
// the employee, even though the row still records who earned it — the Store
// hands it over off-platform and records that as a Settlement. That is the
// one routing decision in the payout path.
export function isPaidToStore(distribution: Pick<GroupableDistribution, 'recipient_type' | 'payout_mode'>): boolean {
  return (
    distribution.recipient_type === DistributionRecipientType.STORE ||
    (distribution.recipient_type === DistributionRecipientType.EMPLOYEE &&
      distribution.payout_mode === DistributionPayoutMode.VIA_STORE)
  );
}

export function groupDistributions(storeId: string, distributions: GroupableDistribution[]): RecipientGroup[] {
  const groups = new Map<string, RecipientGroup>();

  for (const distribution of distributions) {
    const pooled =
      distribution.recipient_type === DistributionRecipientType.EMPLOYEE &&
      distribution.payout_mode === DistributionPayoutMode.VIA_STORE;
    const paidToStore = isPaidToStore(distribution);

    const key = paidToStore ? STORE_GROUP_KEY : `EMPLOYEE:${distribution.employee_id}`;
    const existing = groups.get(key);
    if (existing) {
      existing.distributionIds.push(distribution.id);
      existing.amount += distribution.amount;
      if (pooled) existing.heldForStaff += distribution.amount;
      else existing.ownShare += distribution.amount;
    } else {
      groups.set(key, {
        key,
        recipientType: paidToStore ? DistributionRecipientType.STORE : DistributionRecipientType.EMPLOYEE,
        storeId: paidToStore ? storeId : undefined,
        employeeId: paidToStore ? undefined : (distribution.employee_id ?? undefined),
        distributionIds: [distribution.id],
        amount: distribution.amount,
        ownShare: pooled ? 0 : distribution.amount,
        heldForStaff: pooled ? distribution.amount : 0,
        currency: distribution.tip.currency,
      });
    }
  }

  return Array.from(groups.values());
}
