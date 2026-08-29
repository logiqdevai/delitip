import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { UsersService } from '@/modules/users/services/users.service';
import { paginate } from '@/shared/utils/pagination/pagination-query.schema';
import { CreatePublicRefundRequestDto, CreateRefundDto } from '../dto/create-refund.dto';
import { UpdateRefundDto } from '../dto/update-refund.dto';
import { RefundsQueryType } from '../dto/refunds-query.schema';
import { RefundStatus, TipStatus } from 'generated/prisma';

@Injectable()
export class RefundsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly usersService: UsersService,
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
        const refund = await this.prisma.refund.findUnique({ where: { id }, include: { tip: true } });
        if (!refund) throw new NotFoundException('Refund not found');

        await this.accessControl.assertStoreAccess(user, refund.tip.store_id, ['OWNER', 'STORE_MANAGER', 'ACCOUNTANT']);

        if (refund.status === RefundStatus.COMPLETED || refund.status === RefundStatus.REJECTED) {
            throw new BadRequestException('This refund has already been finalized');
        }

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.refund.update({
                where: { id },
                data: { status: dto.status, processed_by_user_id: user.id },
            });

            if (dto.status === RefundStatus.COMPLETED) {
                await tx.tip.update({ where: { id: refund.tip_id }, data: { status: TipStatus.REFUNDED } });
            }

            return updated;
        });
    }
}
