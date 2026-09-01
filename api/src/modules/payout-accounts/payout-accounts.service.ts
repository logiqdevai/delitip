import { BadGatewayException, BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

    // Shared by a User's own self-service flow (users/me/payout-account) and
    // a Store Owner managing an Employee's account on their behalf — both
    // ultimately create/read/update the same USER-owned PayoutAccount, just
    // reached via a different `userId` resolution + access-control path.
    private async createUserPayoutAccount(userId: string, dto: CreatePayoutAccountDto) {
        const existing = await this.prisma.payoutAccount.findUnique({ where: { user_id: userId } });
        if (existing) throw new ConflictException('A payout account is already linked for this person');

        const linked = await this.linkIban(dto);

        return this.prisma.payoutAccount.create({
            data: {
                owner_type: PayoutAccountOwnerType.USER,
                user_id: userId,
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

    private async getUserPayoutAccountOrThrow(userId: string) {
        const account = await this.prisma.payoutAccount.findUnique({ where: { user_id: userId } });
        if (!account) throw new NotFoundException('No payout account found');
        return account;
    }

    private async updateUserPayoutAccount(userId: string, dto: UpdatePayoutAccountDto) {
        const account = await this.getUserPayoutAccountOrThrow(userId);

        if ((dto.beneficiary_name || dto.friendly_name) && account.bank_account_id) {
            await this.vivaBankTransfers.updateBankAccount(account.bank_account_id, {
                archive: false,
                beneficiaryName: dto.beneficiary_name,
                friendlyName: dto.friendly_name,
            });
        }

        return this.prisma.payoutAccount.update({
            where: { user_id: userId },
            data: {
                ...(dto.beneficiary_name !== undefined ? { beneficiary_name: dto.beneficiary_name } : {}),
            },
        });
    }

    // Resolves the Employee and confirms the acting user OWNS the Store that
    // employs them — this is a Store Owner managing someone else's payout
    // details, so it deliberately requires more than generic store access.
    private async resolveEmployeeOwnedByCaller(user: AuthUser, employeeId: string) {
        const employee = await this.prisma.employee.findUnique({ where: { id: employeeId } });
        if (!employee) throw new NotFoundException('Employee not found');

        await this.accessControl.assertStoreAccess(user, employee.store_id, [OrganizationRole.OWNER]);
        return employee;
    }

    // A payout account is keyed to a User, not an Employee record (payment plan
    // §5.2) — an Employee with no linked login (`user_id` is nullable) has
    // nothing to attach an account to yet.
    private requireLinkedUser(employee: { id: string; user_id: string | null }): string {
        if (!employee.user_id) {
            throw new BadRequestException(
                'This employee has no linked login yet — they need to sign in at least once before a payout account can be added for them.',
            );
        }
        return employee.user_id;
    }

    async createForUser(user: AuthUser, dto: CreatePayoutAccountDto) {
        return this.createUserPayoutAccount(user.id, dto);
    }

    async findForUser(user: AuthUser) {
        return this.getUserPayoutAccountOrThrow(user.id);
    }

    async createForEmployee(user: AuthUser, employeeId: string, dto: CreatePayoutAccountDto) {
        const employee = await this.resolveEmployeeOwnedByCaller(user, employeeId);
        const userId = this.requireLinkedUser(employee);
        return this.createUserPayoutAccount(userId, dto);
    }

    async findForEmployee(user: AuthUser, employeeId: string) {
        const employee = await this.resolveEmployeeOwnedByCaller(user, employeeId);
        if (!employee.user_id) throw new NotFoundException('No payout account for this employee');
        return this.getUserPayoutAccountOrThrow(employee.user_id);
    }

    async updateForEmployee(user: AuthUser, employeeId: string, dto: UpdatePayoutAccountDto) {
        const employee = await this.resolveEmployeeOwnedByCaller(user, employeeId);
        const userId = this.requireLinkedUser(employee);
        return this.updateUserPayoutAccount(userId, dto);
    }

    async refreshStatusForEmployee(user: AuthUser, employeeId: string) {
        const employee = await this.resolveEmployeeOwnedByCaller(user, employeeId);
        if (!employee.user_id) throw new NotFoundException('No payout account for this employee');
        const account = await this.getUserPayoutAccountOrThrow(employee.user_id);
        return this.promoteIfVerified(account);
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
        const account = await this.getUserPayoutAccountOrThrow(user.id);
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

    // Background safety net for the same check the manual "Check status"
    // action and the opportunistic payout-run promotion already do — so an
    // account left PENDING is still eventually promoted even if no owner
    // clicks the button and no payout run ever touches it. Every account is
    // still re-verified against Viva individually (never trusted from a
    // cached/local flag), same as the on-demand paths.
    @Cron(CronExpression.EVERY_10_MINUTES)
    async sweepPendingAccounts(): Promise<{ checked: number; promoted: number }> {
        const pending = await this.prisma.payoutAccount.findMany({
            where: { status: PayoutAccountStatus.PENDING, bank_account_id: { not: null } },
        });

        let promoted = 0;
        for (const account of pending) {
            const result = await this.promoteIfVerified(account);
            if (result.status === PayoutAccountStatus.ACTIVE) promoted += 1;
        }

        if (promoted > 0) {
            this.logger.log(`Payout account sweep promoted ${promoted}/${pending.length} pending account(s) to ACTIVE`);
        }

        return { checked: pending.length, promoted };
    }
}
