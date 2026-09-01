import { BadGatewayException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AccessControlService, AuthUser } from '@/shared/services/access-control/access-control.service';
import { VivaBankTransfersService } from '@/integrations/viva/services/viva-bank-transfers.service';
import { VivaApiException } from '@/integrations/viva/http/viva-api.exception';
import { maskIban } from '@/shared/utils/iban/iban.util';
import { CreatePayoutAccountDto } from './dto/create-payout-account.dto';
import { UpdatePayoutAccountDto } from './dto/update-payout-account.dto';
import { OrganizationRole, PaymentProvider, PayoutAccount, PayoutAccountOwnerType, PayoutAccountStatus, PayoutMethod } from 'generated/prisma';

@Injectable()
export class PayoutAccountsService {
    private readonly logger = new Logger(PayoutAccountsService.name);

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
            if (error instanceof VivaApiException && this.isIbanAlreadyLinkedError(error)) {
                throw new ConflictException(
                    'This IBAN has already been linked before and cannot be linked again — Viva does not allow re-linking the same IBAN, even if it was removed. Please use a different IBAN.',
                );
            }

            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new BadGatewayException(`Unable to link this IBAN with the payment processor: ${message}`);
        }
    }

    // Viva permanently blocks re-linking an IBAN once it's been submitted
    // under this merchant before — active or archived, there's no delete —
    // so this is a routine, expected conflict worth a clear message rather
    // than surfacing Viva's raw error code.
    private isIbanAlreadyLinkedError(error: VivaApiException): boolean {
        const code = error.vivaResponse?.message ?? '';
        return code.startsWith('BankAccountCreationValidationFailedAccountExists');
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

    // On-demand version of the same check PayoutsService otherwise only
    // runs opportunistically during a "Pay out now" run — without this, a
    // freshly-linked account with no eligible distributions yet (e.g. no
    // completed tips) would have no way to ever leave PENDING.
    async refreshStatusForStore(user: AuthUser, storeId: string) {
        await this.accessControl.assertStoreAccess(user, storeId, [OrganizationRole.OWNER]);

        const account = await this.prisma.payoutAccount.findUnique({ where: { store_id: storeId } });
        if (!account) throw new NotFoundException('No payout account for this store');
        return this.promoteIfVerified(account);
    }

    async refreshStatusForUser(user: AuthUser) {
        const account = await this.prisma.payoutAccount.findUnique({ where: { user_id: user.id } });
        if (!account) throw new NotFoundException('No payout account found');
        return this.promoteIfVerified(account);
    }

    // Shared by the manual "check status" actions above and PayoutsService's
    // opportunistic promotion during a payout run — single source of truth
    // for the PENDING -> ACTIVE transition. Viva's linked-bank-account
    // response has no documented "verified" field — `isArchived === false`
    // is the closest available signal, pending direct confirmation from
    // Viva on the actual validation semantics (payment plan §19).
    async promoteIfVerified(account: PayoutAccount): Promise<PayoutAccount> {
        if (account.status !== PayoutAccountStatus.PENDING || !account.bank_account_id) {
            return account;
        }

        try {
            const remote = await this.vivaBankTransfers.getBankAccount(account.bank_account_id);
            if (remote.isArchived) return account;

            return await this.prisma.payoutAccount.update({
                where: { id: account.id },
                data: { status: PayoutAccountStatus.ACTIVE },
            });
        } catch (error) {
            this.logger.warn(
                `Could not verify bank account ${account.bank_account_id}: ${error instanceof Error ? error.message : error}`,
            );
            return account;
        }
    }
}
