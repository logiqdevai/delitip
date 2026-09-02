import { BadRequestException } from '@nestjs/common';
import { DistributionRecipientType, OrganizationRole, PayoutAccountStatus, PayoutExecutionStatus, PayoutStatus, TipStatus } from 'generated/prisma';
import { PayoutsService } from './payouts.service';

const user = { id: 'owner1', role: 'USER' };

describe('PayoutsService', () => {
    let service: PayoutsService;
    let prisma: any;
    let accessControl: any;
    let platformFinanceConfig: any;
    let vivaConfig: any;
    let vivaBankTransfers: any;
    let payoutAccountsService: any;

    beforeEach(() => {
        prisma = {
            tipDistribution: {
                findMany: jest.fn().mockResolvedValue([]),
                updateMany: jest.fn(),
                aggregate: jest.fn(),
                count: jest.fn().mockResolvedValue(0),
            },
            payoutAccount: { findUnique: jest.fn(), update: jest.fn(), findUniqueOrThrow: jest.fn() },
            employee: { findUnique: jest.fn() },
            store: { findUnique: jest.fn().mockResolvedValue({ primary_language: 'EN' }) },
            payout: { create: jest.fn(), delete: jest.fn(), update: jest.fn(), findUniqueOrThrow: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            $transaction: jest.fn((fn) => fn(prisma)),
        };
        accessControl = { assertStoreAccess: jest.fn() };
        platformFinanceConfig = { getPayoutHoldWindowHours: jest.fn().mockReturnValue(48) };
        vivaConfig = { getWalletId: jest.fn().mockReturnValue(999) };
        vivaBankTransfers = {
            getBankAccount: jest.fn(),
            getInstructionTypes: jest.fn().mockResolvedValue({ instructionTypes: [1] }),
            createBankTransferFee: jest.fn().mockResolvedValue({ bankCommandId: 'fee-cmd-1' }),
            executeBankTransfer: jest.fn().mockResolvedValue({ commandId: 'exec-cmd-1' }),
        };
        payoutAccountsService = {
            // Default: pass the account through unchanged, matching
            // PayoutAccountsService.promoteIfVerified's no-op behavior when
            // the account isn't PENDING.
            promoteIfVerified: jest.fn((account: any) => Promise.resolve(account)),
        };

        service = new PayoutsService(
            prisma,
            accessControl,
            platformFinanceConfig,
            vivaConfig,
            vivaBankTransfers,
            payoutAccountsService,
        );
    });

    const storeDistribution = (overrides: Partial<any> = {}) => ({
        id: 'dist1',
        recipient_type: DistributionRecipientType.STORE,
        employee_id: null,
        amount: 500,
        tip: { currency: 'EUR' },
        ...overrides,
    });

    it('requires OWNER-level store access', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([]);

        await service.run(user, 'store1', {});

        expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
    });

    it('throws BadRequestException when VIVA_WALLET_ID is not configured', async () => {
        vivaConfig.getWalletId.mockReturnValue(undefined);

        await expect(service.run(user, 'store1', {})).rejects.toThrow(BadRequestException);
    });

    it('skips the store recipient with NO_PAYOUT_ACCOUNT when none exists', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([storeDistribution()]);
        prisma.payoutAccount.findUnique.mockResolvedValue(null);

        const result = await service.run(user, 'store1', {});

        expect(result.skipped_recipients).toEqual([
            { recipient_type: DistributionRecipientType.STORE, employee_id: undefined, reason: 'NO_PAYOUT_ACCOUNT' },
        ]);
        expect(prisma.payout.create).not.toHaveBeenCalled();
    });

    it('skips an employee recipient with NO_LINKED_USER when the Employee has no user_id', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([
            storeDistribution({ id: 'dist2', recipient_type: DistributionRecipientType.EMPLOYEE, employee_id: 'emp1' }),
        ]);
        prisma.employee.findUnique.mockResolvedValue({ id: 'emp1', user_id: null });

        const result = await service.run(user, 'store1', {});

        expect(result.skipped_recipients).toEqual([
            { recipient_type: DistributionRecipientType.EMPLOYEE, employee_id: 'emp1', reason: 'NO_LINKED_USER' },
        ]);
    });

    it('skips the recipient with ACCOUNT_NOT_ACTIVE when the payout account is RESTRICTED', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([storeDistribution()]);
        prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.RESTRICTED, bank_account_id: 'bank1' });

        const result = await service.run(user, 'store1', {});

        expect(result.skipped_recipients[0].reason).toBe('ACCOUNT_NOT_ACTIVE');
    });

    it('claims eligible distributions, executes the bank transfer, and returns the created Payout', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([storeDistribution()]);
        prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE, bank_account_id: 'bank1' });
        prisma.payout.create.mockResolvedValue({ id: 'payout1', amount: 500, currency: 'EUR' });
        prisma.tipDistribution.updateMany.mockResolvedValue({ count: 1 });
        prisma.payout.findUniqueOrThrow.mockResolvedValue({ id: 'payout1', amount: 500 });
        prisma.payout.update.mockImplementation(async ({ data }: any) => ({ id: 'payout1', ...data }));

        const result = await service.run(user, 'store1', {});

        expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith({
            where: { id: { in: ['dist1'] }, payout_id: null, payout_status: PayoutStatus.PENDING },
            data: { payout_id: 'payout1', payout_status: PayoutStatus.PROCESSING },
        });
        expect(vivaBankTransfers.createBankTransferFee).toHaveBeenCalledWith('bank1', expect.objectContaining({ amount: 500, walletId: 999 }));
        expect(vivaBankTransfers.executeBankTransfer).toHaveBeenCalledWith('bank1', expect.objectContaining({ bankCommandId: 'fee-cmd-1' }));
        expect(result.payouts).toHaveLength(1);
        expect(result.payouts[0]).toEqual(expect.objectContaining({ provider_transfer_id: 'exec-cmd-1' }));
        expect(result.skipped_recipients).toEqual([]);
    });

    it('deletes the just-created Payout and skips the group when the claim loses a race (count 0)', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([storeDistribution()]);
        prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE, bank_account_id: 'bank1' });
        prisma.payout.create.mockResolvedValue({ id: 'payout1' });
        prisma.tipDistribution.updateMany.mockResolvedValue({ count: 0 });

        const result = await service.run(user, 'store1', {});

        expect(prisma.payout.delete).toHaveBeenCalledWith({ where: { id: 'payout1' } });
        expect(vivaBankTransfers.executeBankTransfer).not.toHaveBeenCalled();
        expect(result.payouts).toHaveLength(0);
    });

    it('marks the Payout FAILED and releases the claim back to PENDING when the bank transfer fails', async () => {
        prisma.tipDistribution.findMany.mockResolvedValue([storeDistribution()]);
        prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE, bank_account_id: 'bank1' });
        prisma.payout.create.mockResolvedValue({ id: 'payout1', amount: 500, currency: 'EUR' });
        prisma.tipDistribution.updateMany.mockResolvedValue({ count: 1 });
        prisma.payout.findUniqueOrThrow.mockResolvedValue({ id: 'payout1', amount: 500 });
        vivaBankTransfers.executeBankTransfer.mockRejectedValue(new Error('bank rejected transfer'));
        prisma.payout.update.mockImplementation(async ({ data }: any) => ({ id: 'payout1', ...data }));

        const result = await service.run(user, 'store1', {});

        expect(prisma.payout.update).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ status: PayoutExecutionStatus.FAILED }) }),
        );
        expect(prisma.tipDistribution.updateMany).toHaveBeenCalledWith(
            expect.objectContaining({ where: { payout_id: 'payout1' }, data: { payout_id: null, payout_status: PayoutStatus.PENDING } }),
        );
        expect(result.skipped_recipients[0].reason).toBe('TRANSFER_FAILED');
    });

    it('filters eligibility by store, COMPLETED tip, confirmed fee, PENDING/unclaimed, and the hold window', async () => {
        await service.run(user, 'store1', {});

        expect(prisma.tipDistribution.findMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    payout_id: null,
                    payout_status: PayoutStatus.PENDING,
                    tip: expect.objectContaining({
                        store_id: 'store1',
                        status: TipStatus.COMPLETED,
                        payment_transaction: { processor_fee_confirmed: true },
                    }),
                }),
            }),
        );
    });

    describe('findForStore / findForEmployee', () => {
        it('scopes a store\'s payout history to its own and its employees\' payouts', async () => {
            prisma.payout.findMany.mockResolvedValue([]);
            prisma.payout.count.mockResolvedValue(0);

            await service.findForStore(user, 'store1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER, OrganizationRole.ACCOUNTANT]);
            expect(prisma.payout.findMany).toHaveBeenCalledWith(
                expect.objectContaining({ where: { OR: [{ store_id: 'store1' }, { employee: { store_id: 'store1' } }] } }),
            );
        });

        it('checks self-or-store access for an employee\'s payout history', async () => {
            accessControl.assertEmployeeSelfOrStoreAccess = jest.fn().mockResolvedValue({ isSelf: true });
            prisma.payout.findMany.mockResolvedValue([]);
            prisma.payout.count.mockResolvedValue(0);

            await service.findForEmployee(user, 'emp1', { page: 1, limit: 20 } as any);

            expect(accessControl.assertEmployeeSelfOrStoreAccess).toHaveBeenCalledWith(user, 'emp1');
            expect(prisma.payout.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { employee_id: 'emp1' } }));
        });
    });

    describe('findDistributionsForStore', () => {
        it('resolves employee full_name from the translation map before returning', async () => {
            prisma.tipDistribution.findMany.mockResolvedValue([
                {
                    id: 'dist1',
                    recipient_type: DistributionRecipientType.EMPLOYEE,
                    payout_status: PayoutStatus.PENDING,
                    employee: { id: 'emp1', full_name: { en: 'Maria Papadopoulou' } },
                    tip: {
                        status: TipStatus.COMPLETED,
                        paid_at: new Date('2020-01-01'),
                        payment_transaction: { processor_fee_confirmed: true },
                    },
                },
            ]);
            prisma.tipDistribution.count.mockResolvedValue(1);
            prisma.tipDistribution.aggregate
                .mockResolvedValueOnce({ _sum: { amount: 10 } })
                .mockResolvedValueOnce({ _sum: { amount: 10 } });
            prisma.store.findUnique.mockResolvedValue({ primary_language: 'EN' });

            const result = await service.findDistributionsForStore(user, 'store1', {
                page: 1,
                limit: 20,
            } as any);

            expect(result.data[0].employee).toEqual({
                id: 'emp1',
                full_name: 'Maria Papadopoulou',
            });
        });
    });
});
