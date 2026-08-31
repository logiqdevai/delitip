import { BadGatewayException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { VivaBankTransfersService } from '@/integrations/viva/services/viva-bank-transfers.service';
import { maskIban } from '@/shared/utils/iban/iban.util';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { UpdatePayoutAccountDto } from './dto/update-payout-account.dto';
import { OrganizationRole, PaymentProvider, PayoutAccountOwnerType, PayoutAccountStatus, PayoutMethod } from 'generated/prisma';

@Injectable()
export class PayoutAccountsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly accessControl: AccessControlService,
        private readonly vivaBankTransfers: VivaBankTransfersService,
    ) { }

    private async linkIban(dto: CreatePayoutAccountDto) {
        try {
            return await this.vivaBankTransfers.linkBankAccount({
                iban: dto.iban,
                beneficiaryName: dto.beneficiary_name,
                friendlyName: dto.friendly_name,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new BadGatewayException(`Unable to link this IBAN with the payment processor: ${message}`);
        }
    }

    async createForStore(user: AuthUser, storeId: string, dto: CreatePayoutAccountDto) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

        const existing = await this.prisma.payoutAccount.findUnique({ where: { store_id: storeId } });
        if (existing) throw new ConflictException('This store already has a payout account');

        const linked = await this.linkIban(dto);

        // The raw IBAN is never persisted — only Viva's own bankAccountId
        // reference and a masked last-4 are kept (payment plan §16).
        return this.prisma.payoutAccount.create({
            data: {
                owner_type: PayoutAccountOwnerType.STORE,
                store_id: storeId,
                provider: PaymentProvider.VIVA,
                provider_account_id: linked.bankAccountId ?? '',
                bank_account_id: linked.bankAccountId,
                iban_last4: maskIban(dto.iban),
                beneficiary_name: dto.beneficiary_name,
                payout_method: PayoutMethod.IBAN,
                status: PayoutAccountStatus.PENDING,
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

        if ((dto.beneficiary_name || dto.friendly_name) && account.bank_account_id) {
            await this.vivaBankTransfers.updateBankAccount(account.bank_account_id, {
                archive: false,
                beneficiaryName: dto.beneficiary_name,
                friendlyName: dto.friendly_name,
            });
        }

        return this.prisma.payoutAccount.update({
            where: { store_id: storeId },
            data: {
                ...(dto.beneficiary_name !== undefined ? { beneficiary_name: dto.beneficiary_name } : {}),
            },
        });
    }

    async createForUser(user: AuthUser, dto: CreatePayoutAccountDto) {
        const existing = await this.prisma.payoutAccount.findUnique({ where: { user_id: user.id } });
        if (existing) throw new ConflictException('You already have a payout account');

        const linked = await this.linkIban(dto);

        return this.prisma.payoutAccount.create({
            data: {
                owner_type: PayoutAccountOwnerType.USER,
                user_id: user.id,
                provider: PaymentProvider.VIVA,
                provider_account_id: linked.bankAccountId ?? '',
                bank_account_id: linked.bankAccountId,
                iban_last4: maskIban(dto.iban),
                beneficiary_name: dto.beneficiary_name,
                payout_method: PayoutMethod.IBAN,
                status: PayoutAccountStatus.PENDING,
            },
        });
    }

    async findForUser(user: AuthUser) {
        const account = await this.prisma.payoutAccount.findUnique({ where: { user_id: user.id } });
        if (!account) throw new NotFoundException('No payout account found');
        return account;
    }
}
