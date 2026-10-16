import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { PlatformFinanceConfig } from '@/shared/config/platform-finance/platform-finance.config';
import { VivaConfig } from '@/integrations/viva/viva.config';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { GcsFolders } from '@/integrations/storage/gcs/config/gcs-folders.config';
import { PayoutsService } from '@/modules/payouts/services/payouts.service';
import {
  eligibleDistributionsWhere,
  groupDistributions,
  isPaidToStore,
  RecipientGroup,
  STORE_GROUP_KEY,
} from '@/modules/payouts/utils/payout-groups.utils';
import { MAX_UPLOAD_SIZE_BYTES } from '@/modules/documents/documents.controller';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import {
  DistributionPayoutMode,
  DistributionRecipientType,
  OrganizationRole,
  PayoutExecutionStatus,
  PayoutRequestStatus,
  PayoutStatus,
  Prisma,
  TipStatus,
} from 'generated/prisma';
import { CreatePayoutRequestDto } from '../dto/create-payout-request.dto';
import { ApprovePayoutRequestDto, RejectPayoutRequestDto } from '../dto/review-payout-request.dto';
import { PayoutRequestsQueryType } from '../dto/payout-requests-query.schema';
import { AdminPayoutRequestsQueryType } from '../dto/admin-payout-requests-query.schema';
import { InvoiceVerificationService, INVOICE_MIME_TYPES } from './invoice-verification.service';
import { PayoutRequestNotificationsService } from './payout-request-notifications.service';

const STORE_READ_ROLES = [OrganizationRole.OWNER, OrganizationRole.STORE_MANAGER, OrganizationRole.ACCOUNTANT];

const SIGNED_URL_MINUTES = 30;

// Rows that reach the Store's bank account: its own shares plus pooled
// VIA_STORE staff shares. Same routing rule as payout-groups.utils.
const storeMoneyWhere: Prisma.TipDistributionWhereInput = {
  OR: [
    { recipient_type: DistributionRecipientType.STORE },
    { recipient_type: DistributionRecipientType.EMPLOYEE, payout_mode: DistributionPayoutMode.VIA_STORE },
  ],
};

const requestListInclude = {
  invoice_document: { select: { id: true, mimetype: true, filename: true, size: true } },
  payout: { select: { id: true, status: true, executed_at: true, provider_transfer_id: true, failure_reason: true } },
} satisfies Prisma.PayoutRequestInclude;

const adminDetailInclude = {
  ...requestListInclude,
  store: {
    select: {
      id: true,
      name: true,
      slug: true,
      organization: {
        select: {
          id: true,
          name: true,
          legal_name: true,
          vat_number: true,
          doy: true,
          profession: true,
          address_line: true,
          city: true,
          postal_code: true,
          country: true,
        },
      },
      payout_account: { select: { status: true, payout_method: true, iban_last4: true, beneficiary_name: true } },
    },
  },
  requested_by: { select: { id: true, email: true, first_name: true, last_name: true } },
  reviewed_by: { select: { id: true, email: true, first_name: true, last_name: true } },
  distributions: {
    include: { tip: { select: { id: true, amount: true, paid_at: true, currency: true, status: true } } },
    orderBy: { tip: { paid_at: 'asc' as const } },
  },
} satisfies Prisma.PayoutRequestInclude;

interface LockedDistribution {
  id: string;
  amount: number;
  payout_status: PayoutStatus;
  payout_id: string | null;
  recipient_type: DistributionRecipientType;
  employee_id: string | null;
  payout_mode: DistributionPayoutMode;
  tip: { status: TipStatus; paid_at: Date | null; currency: string };
}

@Injectable()
export class PayoutRequestsService {
  private readonly logger = new Logger(PayoutRequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControl: AccessControlService,
    private readonly platformFinanceConfig: PlatformFinanceConfig,
    private readonly vivaConfig: VivaConfig,
    private readonly gcsService: GcsService,
    private readonly payoutsService: PayoutsService,
    private readonly invoiceVerification: InvoiceVerificationService,
    private readonly notifications: PayoutRequestNotificationsService,
  ) {}

  // ---------------------------------------------------------------- Store side

  // Everything the Store needs before it issues an invoice: the exact figure,
  // the tips it covers, who to invoice, and whether something is already open.
  async preview(user: AuthUser, storeId: string) {
    await this.accessControl.assertStoreAccess(user, storeId, STORE_READ_ROLES);

    const holdWindowHours = await this.platformFinanceConfig.getPayoutHoldWindowHours();
    const holdCutoff = new Date(Date.now() - holdWindowHours * 60 * 60 * 1000);

    const [storeGroup, policyRequired, invoiceDetails, paidAggregate, lastPaid, openRequest, payoutAccount] =
      await Promise.all([
        this.loadStoreGroup(storeId, holdCutoff),
        this.platformFinanceConfig.isPayoutInvoiceRequired(),
        this.platformFinanceConfig.getPlatformInvoiceDetails(),
        this.prisma.tipDistribution.aggregate({
          where: { tip: { store_id: storeId }, payout_status: PayoutStatus.PAID, ...storeMoneyWhere },
          _sum: { amount: true },
        }),
        this.prisma.tipDistribution.findFirst({
          where: { tip: { store_id: storeId }, payout_status: PayoutStatus.PAID, ...storeMoneyWhere },
          orderBy: { paid_out_at: 'desc' },
          select: { paid_out_at: true },
        }),
        this.prisma.payoutRequest.findFirst({
          where: { store_id: storeId, status: PayoutRequestStatus.PENDING_REVIEW },
          select: { id: true, amount: true, currency: true, created_at: true, failure_reason: true, check_status: true, check_verdict: true },
        }),
        this.prisma.payoutAccount.findUnique({ where: { store_id: storeId }, select: { status: true } }),
      ]);

    const { instructions, ...invoice_to } = invoiceDetails;

    return {
      policy_required: policyRequired,
      amount: storeGroup?.group.amount ?? 0,
      own_share_amount: storeGroup?.group.ownShare ?? 0,
      held_for_staff_amount: storeGroup?.group.heldForStaff ?? 0,
      currency: storeGroup?.group.currency ?? null,
      distribution_count: storeGroup?.group.distributionIds.length ?? 0,
      period_from: storeGroup?.periodFrom ?? null,
      period_to: storeGroup?.periodTo ?? null,
      hold_cutoff_at: holdCutoff,
      hold_window_hours: holdWindowHours,
      already_paid_total_amount: paidAggregate._sum.amount ?? 0,
      last_paid_out_at: lastPaid?.paid_out_at ?? null,
      open_request: openRequest,
      payout_account_status: payoutAccount?.status ?? null,
      invoice_to,
      instructions,
    };
  }

  async create(user: AuthUser, storeId: string, dto: CreatePayoutRequestDto) {
    await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

    if (!(await this.platformFinanceConfig.isPayoutInvoiceRequired())) {
      throw new BadRequestException('Payout requests are not enabled — use Pay out now instead');
    }

    const open = await this.prisma.payoutRequest.findFirst({
      where: { store_id: storeId, status: PayoutRequestStatus.PENDING_REVIEW },
      select: { id: true },
    });
    if (open) throw new ConflictException('This store already has a payout request awaiting review');

    await this.assertInvoiceDocument(user.id, dto.invoice_document_id);

    const holdWindowHours = await this.platformFinanceConfig.getPayoutHoldWindowHours();
    const holdCutoff = new Date(Date.now() - holdWindowHours * 60 * 60 * 1000);
    const storeGroup = await this.loadStoreGroup(storeId, holdCutoff);
    if (!storeGroup || storeGroup.group.amount <= 0) {
      throw new BadRequestException('Nothing is payable to the store right now');
    }

    const request = await this.prisma.$transaction(async (tx) => {
      const created = await tx.payoutRequest.create({
        data: {
          store_id: storeId,
          requested_by_user_id: user.id,
          amount: storeGroup.group.amount,
          own_share_amount: storeGroup.group.ownShare,
          held_for_staff_amount: storeGroup.group.heldForStaff,
          currency: storeGroup.group.currency as any,
          distribution_count: storeGroup.group.distributionIds.length,
          period_from: storeGroup.periodFrom,
          period_to: storeGroup.periodTo,
          hold_cutoff_at: holdCutoff,
          invoice_document_id: dto.invoice_document_id,
          invoice_number: dto.invoice_number?.trim() || null,
          store_note: dto.store_note?.trim() || null,
        },
      });

      // The lock. Only rows nobody else has touched since the preview are
      // taken; the where-clause makes a concurrent run or second request
      // lose cleanly instead of double-counting.
      const lock = await tx.tipDistribution.updateMany({
        where: {
          id: { in: storeGroup.group.distributionIds },
          payout_id: null,
          payout_request_id: null,
          payout_status: PayoutStatus.PENDING,
        },
        data: { payout_request_id: created.id },
      });

      if (lock.count === 0) {
        throw new ConflictException('These tips were just claimed by another payout — please refresh and try again');
      }

      if (lock.count < storeGroup.group.distributionIds.length) {
        // Part of the preview moved under us; re-snapshot from what we hold.
        const locked = await tx.tipDistribution.findMany({
          where: { payout_request_id: created.id },
          include: { tip: { select: { paid_at: true, currency: true } } },
        });
        const regrouped = groupDistributions(storeId, locked as any).find((g) => g.key === STORE_GROUP_KEY)!;
        const paidAts = locked.map((d) => d.tip.paid_at!).filter(Boolean);
        return tx.payoutRequest.update({
          where: { id: created.id },
          data: {
            amount: regrouped.amount,
            own_share_amount: regrouped.ownShare,
            held_for_staff_amount: regrouped.heldForStaff,
            distribution_count: locked.length,
            period_from: new Date(Math.min(...paidAts.map((d) => d.getTime()))),
            period_to: new Date(Math.max(...paidAts.map((d) => d.getTime()))),
          },
          include: requestListInclude,
        });
      }

      return tx.payoutRequest.findUniqueOrThrow({ where: { id: created.id }, include: requestListInclude });
    });

    setImmediate(async () => {
      try {
        await this.invoiceVerification.verify(request.id);
        await this.notifications.notifyAdminsSubmitted(request.id);
      } catch (error) {
        this.logger.error(`Post-submission work failed for payout request ${request.id}: ${error?.message ?? error}`);
      }
    });

    return request;
  }

  async findForStore(user: AuthUser, storeId: string, query: PayoutRequestsQueryType) {
    await this.accessControl.assertStoreAccess(user, storeId, STORE_READ_ROLES);

    const where: Prisma.PayoutRequestWhereInput = { store_id: storeId, ...(query.status ? { status: query.status } : {}) };
    const [items, total] = await Promise.all([
      this.prisma.payoutRequest.findMany({
        where,
        include: requestListInclude,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payoutRequest.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  async findOneForStore(user: AuthUser, storeId: string, id: string) {
    await this.accessControl.assertStoreAccess(user, storeId, STORE_READ_ROLES);
    const request = await this.prisma.payoutRequest.findFirst({ where: { id, store_id: storeId }, include: requestListInclude });
    if (!request) throw new NotFoundException('Payout request not found');
    return request;
  }

  async getInvoiceUrlForStore(user: AuthUser, storeId: string, id: string) {
    await this.accessControl.assertStoreAccess(user, storeId, STORE_READ_ROLES);
    const request = await this.prisma.payoutRequest.findFirst({
      where: { id, store_id: storeId },
      include: { invoice_document: { select: { filename: true, mimetype: true } } },
    });
    if (!request) throw new NotFoundException('Payout request not found');
    return this.signInvoiceUrl(request.invoice_document);
  }

  async cancel(user: AuthUser, storeId: string, id: string) {
    await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);
    const request = await this.prisma.payoutRequest.findFirst({ where: { id, store_id: storeId } });
    if (!request) throw new NotFoundException('Payout request not found');
    if (request.status !== PayoutRequestStatus.PENDING_REVIEW) {
      throw new ConflictException('Only a request awaiting review can be cancelled');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payoutRequest.update({
        where: { id },
        data: { status: PayoutRequestStatus.CANCELLED },
        include: requestListInclude,
      });
      await this.releaseDistributions(tx, id);
      return updated;
    });
  }

  // ---------------------------------------------------------------- Admin side

  async findAllAdmin(query: AdminPayoutRequestsQueryType) {
    const where: Prisma.PayoutRequestWhereInput = {};
    if (query.store_id) where.store_id = query.store_id;
    if (query.status) where.status = query.status;
    if (query.verdict) where.check_verdict = query.verdict;
    if (query.date_from || query.date_to) {
      where.created_at = {};
      if (query.date_from) where.created_at.gte = new Date(query.date_from);
      if (query.date_to) where.created_at.lte = new Date(query.date_to);
    }
    if (query.search) {
      where.OR = [
        { id: { contains: query.search, mode: 'insensitive' } },
        { invoice_number: { contains: query.search, mode: 'insensitive' } },
        { store: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.payoutRequest.findMany({
        where,
        include: { ...requestListInclude, store: { select: { id: true, name: true, slug: true } } },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.payoutRequest.count({ where }),
    ]);

    return paginate(items, total, query);
  }

  async pendingCountAdmin() {
    const count = await this.prisma.payoutRequest.count({ where: { status: PayoutRequestStatus.PENDING_REVIEW } });
    return { count };
  }

  async findOneAdmin(id: string) {
    const request = await this.prisma.payoutRequest.findUnique({ where: { id }, include: adminDetailInclude });
    if (!request) throw new NotFoundException('Payout request not found');
    return { ...request, integrity: this.computeIntegrity(request) };
  }

  async getInvoiceUrlAdmin(id: string) {
    const request = await this.prisma.payoutRequest.findUnique({
      where: { id },
      include: { invoice_document: { select: { filename: true, mimetype: true } } },
    });
    if (!request) throw new NotFoundException('Payout request not found');
    return this.signInvoiceUrl(request.invoice_document);
  }

  // Approve = pay. Reuses PayoutsService's claim + transfer so an approved
  // request produces exactly the same Payout a self-service run would, just
  // scoped to the rows this request locked.
  async approve(admin: AuthUser, id: string, dto: ApprovePayoutRequestDto) {
    const request = await this.prisma.payoutRequest.findUnique({ where: { id }, include: adminDetailInclude });
    if (!request) throw new NotFoundException('Payout request not found');
    if (request.status !== PayoutRequestStatus.PENDING_REVIEW) {
      throw new ConflictException('Only a request awaiting review can be approved');
    }

    const integrity = this.computeIntegrity(request);
    if (integrity.is_stale) {
      throw new ConflictException(
        'Some tips in this request changed since it was submitted (e.g. refunded). Reject it so the store can request the corrected amount.',
      );
    }

    const walletId = this.vivaConfig.getWalletId();
    if (!walletId) {
      throw new BadRequestException('VIVA_WALLET_ID is not configured — payouts cannot be executed yet');
    }

    const group = this.buildGroup(request.store_id, request.distributions);
    if (group.amount !== request.amount) {
      throw new ConflictException('The locked tips no longer add up to the requested amount');
    }

    const account = await this.payoutsService.resolvePayoutAccount(group);
    if (!account.payoutAccount) {
      throw new BadRequestException(
        account.reason === 'NO_PAYOUT_ACCOUNT'
          ? 'The store has no payout account linked yet'
          : 'The store payout account is not active yet',
      );
    }

    const claimed = await this.payoutsService.claimGroup(group, account.payoutAccount.id, walletId, request.id);
    if (!claimed) {
      throw new ConflictException('This request is already being processed');
    }

    const payout = await this.payoutsService.executeTransfer(claimed, account.payoutAccount, walletId);

    if (payout.status === PayoutExecutionStatus.FAILED) {
      // executeTransfer already put the distributions back to PENDING; they
      // are still locked to this request, so the admin can retry later.
      const failed = await this.prisma.payoutRequest.update({
        where: { id },
        data: { failure_reason: payout.failure_reason ?? 'Bank transfer failed' },
        include: adminDetailInclude,
      });
      return { ...failed, integrity: this.computeIntegrity(failed), payout };
    }

    const approved = await this.prisma.payoutRequest.update({
      where: { id },
      data: {
        status: PayoutRequestStatus.APPROVED,
        payout_id: payout.id,
        reviewed_by_user_id: admin.id,
        reviewed_at: new Date(),
        admin_note: dto.admin_note?.trim() || null,
        failure_reason: null,
      },
      include: adminDetailInclude,
    });

    setImmediate(() => void this.notifications.notifyStoreReviewed(id, 'APPROVED'));

    return { ...approved, integrity: this.computeIntegrity(approved), payout };
  }

  async reject(admin: AuthUser, id: string, dto: RejectPayoutRequestDto) {
    const request = await this.prisma.payoutRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Payout request not found');
    if (request.status !== PayoutRequestStatus.PENDING_REVIEW) {
      throw new ConflictException('Only a request awaiting review can be rejected');
    }

    const rejected = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.payoutRequest.update({
        where: { id },
        data: {
          status: PayoutRequestStatus.REJECTED,
          reviewed_by_user_id: admin.id,
          reviewed_at: new Date(),
          admin_note: dto.admin_note.trim(),
        },
        include: adminDetailInclude,
      });
      await this.releaseDistributions(tx, id);
      return updated;
    });

    setImmediate(() => void this.notifications.notifyStoreReviewed(id, 'REJECTED'));

    return { ...rejected, integrity: this.computeIntegrity(rejected) };
  }

  async recheck(id: string) {
    const request = await this.prisma.payoutRequest.findUnique({ where: { id }, select: { id: true } });
    if (!request) throw new NotFoundException('Payout request not found');
    await this.invoiceVerification.verify(id);
    return this.findOneAdmin(id);
  }

  // ---------------------------------------------------------------- Internals

  private async loadStoreGroup(storeId: string, holdCutoff: Date) {
    const distributions = await this.prisma.tipDistribution.findMany({
      where: eligibleDistributionsWhere(storeId, holdCutoff),
      include: { tip: { select: { paid_at: true, currency: true } } },
    });

    const group = groupDistributions(storeId, distributions as any).find((g) => g.key === STORE_GROUP_KEY);
    if (!group) return null;

    const storeRows = distributions.filter((d) => isPaidToStore(d));
    const paidAts = storeRows.map((d) => d.tip.paid_at?.getTime()).filter((t): t is number => typeof t === 'number');

    return {
      group,
      periodFrom: new Date(Math.min(...paidAts)),
      periodTo: new Date(Math.max(...paidAts)),
    };
  }

  private buildGroup(storeId: string, rows: LockedDistribution[]): RecipientGroup {
    const groups = groupDistributions(storeId, rows as any);
    const storeGroup = groups.find((g) => g.key === STORE_GROUP_KEY);
    if (!storeGroup || groups.length !== 1) {
      throw new ConflictException('The locked tips are not all payable to the store');
    }
    return storeGroup;
  }

  // Live check of the frozen snapshot: a refund can CANCEL a locked row after
  // submission, in which case the invoice no longer matches what we'd pay.
  private computeIntegrity(request: { status: PayoutRequestStatus; amount: number; distributions: LockedDistribution[] }) {
    if (request.status !== PayoutRequestStatus.PENDING_REVIEW) {
      return { locked_count: request.distributions.length, stale_count: 0, live_amount: request.amount, is_stale: false };
    }
    const stale = request.distributions.filter(
      (d) => d.payout_status !== PayoutStatus.PENDING || d.payout_id !== null || d.tip.status !== TipStatus.COMPLETED,
    );
    const liveAmount = request.distributions.filter((d) => !stale.includes(d)).reduce((sum, d) => sum + d.amount, 0);
    return {
      locked_count: request.distributions.length,
      stale_count: stale.length,
      live_amount: liveAmount,
      is_stale: stale.length > 0 || liveAmount !== request.amount,
    };
  }

  private async releaseDistributions(tx: Prisma.TransactionClient, requestId: string) {
    await tx.tipDistribution.updateMany({ where: { payout_request_id: requestId }, data: { payout_request_id: null } });
  }

  private async assertInvoiceDocument(userId: string, documentId: string) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) throw new NotFoundException('Invoice document not found');
    if (document.user_uuid !== userId) throw new ForbiddenException('The invoice must be uploaded by the requesting user');
    if (!INVOICE_MIME_TYPES.includes(document.mimetype)) {
      throw new BadRequestException('The invoice must be a PDF, JPEG or PNG file');
    }
    if (document.size > MAX_UPLOAD_SIZE_BYTES) throw new BadRequestException('The invoice must be 10 MB or smaller');
    const alreadyUsed = await this.prisma.payoutRequest.findUnique({ where: { invoice_document_id: documentId }, select: { id: true } });
    if (alreadyUsed) throw new ConflictException('This invoice is already attached to another payout request');
  }

  // The bucket is private, so Document.url is not viewable directly. Stored
  // filenames look like "<folder>/<timestamp>-<name>" and the adapter adds
  // the folder itself, so split it off before signing.
  private async signInvoiceUrl(document: { filename: string; mimetype: string }) {
    const slash = document.filename.indexOf('/');
    const folder = slash > 0 ? document.filename.slice(0, slash) : GcsFolders.documents;
    const objectName = slash > 0 ? document.filename.slice(slash + 1) : document.filename;
    const url = await this.gcsService.getSignedUrl(objectName, folder, SIGNED_URL_MINUTES);
    return { url, mimetype: document.mimetype, expires_at: new Date(Date.now() + SIGNED_URL_MINUTES * 60 * 1000) };
  }
}
