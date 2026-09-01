import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { VivaTransactionsService } from '@/integrations/viva/services/viva-transactions.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { CreatePublicRefundRequestDto, CreateRefundDto } from '../dto/create-refund.dto';
import { UpdateRefundDto } from '../dto/update-refund.dto';
import { RefundsQueryType } from '../dto/refunds-query.schema';
import { PayoutStatus, RefundStatus, TipStatus } from 'generated/prisma';

@Injectable()
export class RefundsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
        private readonly vivaTransactions: VivaTransactionsService,
    ) { }

    private async loadTip(tipId: string) {
        const tip = await this.prisma.tip.findUnique({ where: { id: tipId } });
        if (!tip) throw new NotFoundException('Tip not found');
        return tip;
    }

    async createPublicRequest(tipId: string, dto: CreatePublicRefundRequestDto) {
        const tip = await this.loadTip(tipId);

        const requestedByUserId = dto.customer_email
            ? (await this.usersService.findOrCreateByEmail(dto.customer_email)).id
            : tip.customer_user_id || undefined;

        return this.prisma.refund.create({
            data: {
                tip_id: tip.id,
                amount: dto.amount ?? tip.amount,
                reason: dto.reason,
                requested_by_user_id: requestedByUserId,
            },
        });
    }

    async create(user: AuthUser, dto: CreateRefundDto) {
        const tip = await this.loadTip(dto.tip_id);
        await this.accessControl.assertStoreAccess(user, tip.store_id, ['OWNER', 'STORE_MANAGER', 'ACCOUNTANT']);

        return this.prisma.refund.create({
            data: {
                tip_id: tip.id,
                amount: dto.amount ?? tip.amount,
                reason: dto.reason,
                requested_by_user_id: user.id,
            },
        });
    }

    async findAll(user: AuthUser, storeId: string, query: RefundsQueryType) {
        await this.accessControl.assertStoreAccess(user, storeId, ['OWNER', 'STORE_MANAGER', 'ACCOUNTANT']);

        const where: any = { tip: { store_id: storeId } };
        if (query.status) where.status = query.status;
        if (query.date_from || query.date_to) {
            where.created_at = {};
            if (query.date_from) where.created_at.gte = new Date(query.date_from);
            if (query.date_to) where.created_at.lte = new Date(query.date_to);
        }

        const [items, total] = await Promise.all([
            this.prisma.refund.findMany({
                where,
                include: { tip: true, requested_by: true, processed_by: true },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.refund.count({ where }),
        ]);

        return paginate(items, total, query);
    }

    async findOne(user: AuthUser, id: string) {
        const refund = await this.prisma.refund.findUnique({
            where: { id },
            include: { tip: true, requested_by: true, processed_by: true },
        });
        if (!refund) throw new NotFoundException('Refund not found');

        await this.accessControl.assertStoreAccess(user, refund.tip.store_id, ['OWNER', 'STORE_MANAGER', 'ACCOUNTANT']);
        return refund;
    }

    async update(user: AuthUser, id: string, dto: UpdateRefundDto) {
        const refund = await this.prisma.refund.findUnique({
            where: { id },
            include: { tip: { include: { payment_transaction: true, distributions: true } } },
        });
        if (!refund) throw new NotFoundException('Refund not found');

        await this.accessControl.assertStoreAccess(user, refund.tip.store_id, ['OWNER', 'STORE_MANAGER', 'ACCOUNTANT']);

        if (refund.status === RefundStatus.COMPLETED || refund.status === RefundStatus.REJECTED) {
            throw new BadRequestException('This refund has already been finalized');
        }

        let providerReference: string | undefined;
        let alreadyPaidOut = false;

        if (dto.status === RefundStatus.COMPLETED) {
            const paymentTransaction = refund.tip.payment_transaction;
            if (!paymentTransaction?.provider_transaction_id) {
                throw new BadRequestException('This tip has no confirmed payment to refund');
            }

            alreadyPaidOut = refund.tip.distributions.some((d) => d.payout_status === PayoutStatus.PAID);

            const confirmedAt = paymentTransaction.confirmed_at ?? refund.tip.created_at;
            const isSameCalendarDay = this.isSameCalendarDay(confirmedAt, new Date());

            try {
                const response = isSameCalendarDay
                    ? await this.vivaTransactions.createFastRefund(paymentTransaction.provider_transaction_id, {
                        amount: refund.amount,
                        merchantTrns: refund.id,
                    })
                    : await this.vivaTransactions.createRebate(paymentTransaction.provider_transaction_id, {
                        amount: refund.amount,
                        merchantTrns: refund.id,
                    });
                providerReference = response.transactionId;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Unknown error';
                throw new BadGatewayException(`Unable to process this refund with the payment processor: ${message}`);
            }
        }

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.refund.update({
                where: { id },
                data: {
                    status: dto.status,
                    processed_by_user_id: user.id,
                    ...(dto.status === RefundStatus.COMPLETED
                        ? {
                            provider_reference: providerReference,
                            provider_status: 'REQUESTED',
                            requires_manual_reconciliation: alreadyPaidOut,
                        }
                        : {}),
                },
            });

            if (dto.status === RefundStatus.COMPLETED) {
                await tx.tip.update({ where: { id: refund.tip_id }, data: { status: TipStatus.REFUNDED } });

                // The tip was refunded, so any share of it that hasn't already been
                // paid out never will be — cancel it instead of leaving it PENDING
                // forever (which double-counts it in payout/earnings totals).
                await tx.tipDistribution.updateMany({
                    where: { tip_id: refund.tip_id, payout_status: PayoutStatus.PENDING },
                    data: { payout_status: PayoutStatus.CANCELLED },
                });
            }

            return updated;
        });
    }

    private isSameCalendarDay(a: Date, b: Date): boolean {
        return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
    }
}
