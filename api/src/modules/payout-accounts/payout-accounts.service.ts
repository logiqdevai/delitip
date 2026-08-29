import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { generateMockProviderAccountId } from '@/shared/utils/mock-payment/mock-payment.utils';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { UpdatePayoutAccountDto } from './dto/update-payout-account.dto';
import { OrganizationRole, PaymentProvider, PayoutAccountOwnerType, PayoutAccountStatus } from 'generated/prisma';

@Injectable()
export class PayoutAccountsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
    ) { }

    async createForStore(user: AuthUser, storeId: string, dto: CreatePayoutAccountDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

        const existing = await this.prisma.payoutAccount.findUnique({ where: { store_id: storeId } });
        if (existing) throw new ConflictException('This store already has a payout account');

        // No real payment processor is integrated — connecting an account is
        // simulated as instantly successful and ACTIVE.
        return this.prisma.payoutAccount.create({
            data: {
                owner_type: PayoutAccountOwnerType.STORE,
                store_id: storeId,
                provider: dto.provider ?? PaymentProvider.VIVA,
                provider_account_id: generateMockProviderAccountId(),
                status: PayoutAccountStatus.ACTIVE,
            },
        });
    }

    async findForStore(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId);

        const account = await this.prisma.payoutAccount.findUnique({ where: { store_id: storeId } });
        if (!account) throw new NotFoundException('No payout account for this store');
        return account;
    }

    async updateForStore(user: AuthUser, storeId: string, dto: UpdatePayoutAccountDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

        const account = await this.prisma.payoutAccount.findUnique({ where: { store_id: storeId } });
        if (!account) throw new NotFoundException('No payout account for this store');

        return this.prisma.payoutAccount.update({
            where: { store_id: storeId },
            data: {
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.provider !== undefined ? { provider: dto.provider } : {}),
            },
        });
    }

    async createForUser(user: AuthUser, dto: CreatePayoutAccountDto) {
        const existing = await this.prisma.payoutAccount.findUnique({ where: { user_id: user.id } });
        if (existing) throw new ConflictException('You already have a payout account');

        return this.prisma.payoutAccount.create({
            data: {
                owner_type: PayoutAccountOwnerType.USER,
                user_id: user.id,
                provider: dto.provider ?? PaymentProvider.VIVA,
                provider_account_id: generateMockProviderAccountId(),
                status: PayoutAccountStatus.ACTIVE,
            },
        });
    }

    async findForUser(user: AuthUser) {
        const account = await this.prisma.payoutAccount.findUnique({ where: { user_id: user.id } });
        if (!account) throw new NotFoundException('No payout account found');
        return account;
    }
}
