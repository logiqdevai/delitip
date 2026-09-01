import { BadGatewayException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, PaymentProvider, PayoutAccountOwnerType, PayoutAccountStatus, PayoutMethod } from 'generated/prisma';
import { PayoutAccountsService } from './payout-accounts.service';
import { VivaApiException } from '@/integrations/viva/http/viva-api.exception';

const VALID_IBAN = 'GR1601101250000000012300695';

describe('PayoutAccountsService', () => {
    let service: PayoutAccountsService;
    let prisma: any;
    let accessControl: any;
    let vivaBankTransfers: any;

    const user = { id: 'u1', role: AuthRole.USER };
    const createDto = (overrides: Partial<any> = {}) => ({
        iban: VALID_IBAN,
        beneficiary_name: 'Ada Lovelace',
        ...overrides,
    });

    beforeEach(() => {
        prisma = {
            payoutAccount: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
            employee: { findUnique: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        vivaBankTransfers = {
            linkBankAccount: jest.fn().mockResolvedValue({ bankAccountId: 'bank-1' }),
            updateBankAccount: jest.fn().mockResolvedValue({}),
            getBankAccount: jest.fn(),
        };
        service = new PayoutAccountsService(prisma, accessControl, vivaBankTransfers);
    });

    describe('createForStore', () => {
        it('requires OWNER-level store access', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            prisma.payoutAccount.create.mockResolvedValue({});

            await service.createForStore(user, 'store1', createDto());

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws ConflictException when the store already has a payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createForStore(user, 'store1', createDto())).rejects.toThrow(ConflictException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
            expect(vivaBankTransfers.linkBankAccount).not.toHaveBeenCalled();
        });

        it('links the IBAN with Viva and creates a PENDING payout account, never persisting the raw IBAN', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            const created = { id: 'pa1' };
            prisma.payoutAccount.create.mockResolvedValue(created);

            const result = await service.createForStore(user, 'store1', createDto());

            expect(vivaBankTransfers.linkBankAccount).toHaveBeenCalledWith({
                iban: VALID_IBAN,
                beneficiaryName: 'Ada Lovelace',
                friendlyName: undefined,
            });
            expect(result).toBe(created);
            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    owner_type: PayoutAccountOwnerType.STORE,
                    store_id: 'store1',
                    provider: PaymentProvider.VIVA,
                    bank_account_id: 'bank-1',
                    iban_last4: '0695',
                    beneficiary_name: 'Ada Lovelace',
                    payout_method: PayoutMethod.IBAN,
                    status: PayoutAccountStatus.PENDING,
                }),
            });
            const dataArg = prisma.payoutAccount.create.mock.calls[0][0].data;
            expect(JSON.stringify(dataArg)).not.toContain(VALID_IBAN);
        });

        it('wraps a Viva linking failure in BadGatewayException', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            vivaBankTransfers.linkBankAccount.mockRejectedValue(new Error('Viva rejected this IBAN'));

            await expect(service.createForStore(user, 'store1', createDto())).rejects.toThrow(BadGatewayException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
        });

        it.each(['BankAccountCreationValidationFailedAccountExists', 'BankAccountCreationValidationFailedAccountExistsArchived'])(
            'surfaces a friendly ConflictException instead of the raw Viva code for %s',
            async (vivaCode) => {
                prisma.payoutAccount.findUnique.mockResolvedValue(null);
                vivaBankTransfers.linkBankAccount.mockRejectedValue(
                    new VivaApiException(409, vivaCode, { message: vivaCode }),
                );

                await expect(service.createForStore(user, 'store1', createDto())).rejects.toThrow(ConflictException);
                expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
            },
        );
    });

    describe('findForStore', () => {
        it('requires store access (any role)', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1' });

            await service.findForStore(user, 'store1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1');
        });

        it('throws NotFoundException when the store has no payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.findForStore(user, 'store1')).rejects.toThrow(NotFoundException);
        });

        it('returns the account when found', async () => {
            const account = { id: 'pa1' };
            prisma.payoutAccount.findUnique.mockResolvedValue(account);

            await expect(service.findForStore(user, 'store1')).resolves.toBe(account);
        });
    });

    describe('updateForStore', () => {
        it('requires OWNER-level store access', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', bank_account_id: 'bank-1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', {});

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws NotFoundException when there is no existing payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.updateForStore(user, 'store1', {})).rejects.toThrow(NotFoundException);
            expect(prisma.payoutAccount.update).not.toHaveBeenCalled();
        });

        it('updates the beneficiary name locally and at Viva', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', bank_account_id: 'bank-1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', { beneficiary_name: 'New Name' });

            expect(vivaBankTransfers.updateBankAccount).toHaveBeenCalledWith('bank-1', expect.objectContaining({ beneficiaryName: 'New Name' }));
            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                data: { beneficiary_name: 'New Name' },
            });
        });

        it('writes no fields when the DTO is empty', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', bank_account_id: 'bank-1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', {});

            expect(vivaBankTransfers.updateBankAccount).not.toHaveBeenCalled();
            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                data: {},
            });
        });
    });

    describe('createForUser', () => {
        it('throws ConflictException when the user already has a payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createForUser(user, createDto())).rejects.toThrow(ConflictException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
        });

        it('links the IBAN and creates a PENDING payout account owned by the user', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            const created = { id: 'pa1' };
            prisma.payoutAccount.create.mockResolvedValue(created);

            const result = await service.createForUser(user, createDto());

            expect(result).toBe(created);
            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    owner_type: PayoutAccountOwnerType.USER,
                    user_id: 'u1',
                    provider: PaymentProvider.VIVA,
                    status: PayoutAccountStatus.PENDING,
                }),
            });
        });
    });

    describe('findForUser', () => {
        it('throws NotFoundException when the user has no payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.findForUser(user)).rejects.toThrow(NotFoundException);
        });

        it('returns the account when found', async () => {
            const account = { id: 'pa1' };
            prisma.payoutAccount.findUnique.mockResolvedValue(account);

            await expect(service.findForUser(user)).resolves.toBe(account);
            expect(prisma.payoutAccount.findUnique).toHaveBeenCalledWith({ where: { user_id: 'u1' } });
        });
    });

    describe('createForEmployee', () => {
        it('requires OWNER-level access to the employee\'s store', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            prisma.payoutAccount.create.mockResolvedValue({});

            await service.createForEmployee(user, 'e1', createDto());

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws NotFoundException when the employee does not exist', async () => {
            prisma.employee.findUnique.mockResolvedValue(null);

            await expect(service.createForEmployee(user, 'missing', createDto())).rejects.toThrow(NotFoundException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
        });

        it('throws BadRequestException when the employee has no linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: null });

            await expect(service.createForEmployee(user, 'e1', createDto())).rejects.toThrow(BadRequestException);
            expect(vivaBankTransfers.linkBankAccount).not.toHaveBeenCalled();
        });

        it('links the IBAN and creates a PENDING payout account owned by the employee\'s linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            const created = { id: 'pa1' };
            prisma.payoutAccount.create.mockResolvedValue(created);

            const result = await service.createForEmployee(user, 'e1', createDto());

            expect(result).toBe(created);
            expect(prisma.payoutAccount.findUnique).toHaveBeenCalledWith({ where: { user_id: 'linked-user' } });
            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    owner_type: PayoutAccountOwnerType.USER,
                    user_id: 'linked-user',
                    status: PayoutAccountStatus.PENDING,
                }),
            });
        });

        it('throws ConflictException when that user already has a payout account', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createForEmployee(user, 'e1', createDto())).rejects.toThrow(ConflictException);
            expect(vivaBankTransfers.linkBankAccount).not.toHaveBeenCalled();
        });
    });

    describe('findForEmployee', () => {
        it('throws NotFoundException when the employee has no linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: null });

            await expect(service.findForEmployee(user, 'e1')).rejects.toThrow(NotFoundException);
        });

        it('returns the linked user\'s payout account', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            const account = { id: 'pa1' };
            prisma.payoutAccount.findUnique.mockResolvedValue(account);

            await expect(service.findForEmployee(user, 'e1')).resolves.toBe(account);
            expect(prisma.payoutAccount.findUnique).toHaveBeenCalledWith({ where: { user_id: 'linked-user' } });
        });
    });

    describe('updateForEmployee', () => {
        it('throws BadRequestException when the employee has no linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: null });

            await expect(service.updateForEmployee(user, 'e1', {})).rejects.toThrow(BadRequestException);
        });

        it('updates the beneficiary name for the employee\'s linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', bank_account_id: 'bank-1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForEmployee(user, 'e1', { beneficiary_name: 'New Name' });

            expect(vivaBankTransfers.updateBankAccount).toHaveBeenCalledWith('bank-1', expect.objectContaining({ beneficiaryName: 'New Name' }));
            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { user_id: 'linked-user' },
                data: { beneficiary_name: 'New Name' },
            });
        });
    });

    describe('refreshStatusForEmployee', () => {
        it('throws NotFoundException when the employee has no linked user', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: null });

            await expect(service.refreshStatusForEmployee(user, 'e1')).rejects.toThrow(NotFoundException);
        });

        it('checks Viva and promotes when eligible', async () => {
            prisma.employee.findUnique.mockResolvedValue({ id: 'e1', store_id: 'store1', user_id: 'linked-user' });
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' });
            vivaBankTransfers.getBankAccount.mockResolvedValue({ isArchived: false });
            prisma.payoutAccount.update.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE });

            const result = await service.refreshStatusForEmployee(user, 'e1');

            expect(result.status).toBe(PayoutAccountStatus.ACTIVE);
        });
    });

    describe('promoteIfVerified', () => {
        it('leaves a non-PENDING account untouched', async () => {
            const account = { id: 'pa1', status: PayoutAccountStatus.ACTIVE, bank_account_id: 'bank-1' };

            const result = await service.promoteIfVerified(account as any);

            expect(result).toBe(account);
            expect(vivaBankTransfers.getBankAccount).not.toHaveBeenCalled();
        });

        it('leaves a PENDING account with no bank_account_id untouched', async () => {
            const account = { id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: null };

            const result = await service.promoteIfVerified(account as any);

            expect(result).toBe(account);
            expect(vivaBankTransfers.getBankAccount).not.toHaveBeenCalled();
        });

        it('promotes a PENDING account to ACTIVE when Viva reports it is not archived', async () => {
            const account = { id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' };
            vivaBankTransfers.getBankAccount.mockResolvedValue({ isArchived: false });
            prisma.payoutAccount.update.mockResolvedValue({ ...account, status: PayoutAccountStatus.ACTIVE });

            const result = await service.promoteIfVerified(account as any);

            expect(vivaBankTransfers.getBankAccount).toHaveBeenCalledWith('bank-1');
            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { id: 'pa1' },
                data: { status: PayoutAccountStatus.ACTIVE },
            });
            expect(result.status).toBe(PayoutAccountStatus.ACTIVE);
        });

        it('leaves the account PENDING when Viva reports it is archived', async () => {
            const account = { id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' };
            vivaBankTransfers.getBankAccount.mockResolvedValue({ isArchived: true });

            const result = await service.promoteIfVerified(account as any);

            expect(result).toBe(account);
            expect(prisma.payoutAccount.update).not.toHaveBeenCalled();
        });

        it('leaves the account PENDING when the Viva lookup fails', async () => {
            const account = { id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' };
            vivaBankTransfers.getBankAccount.mockRejectedValue(new Error('network error'));

            const result = await service.promoteIfVerified(account as any);

            expect(result).toBe(account);
        });
    });

    describe('refreshStatusForStore', () => {
        it('requires OWNER-level store access', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE, bank_account_id: 'bank-1' });

            await service.refreshStatusForStore(user, 'store1');

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws NotFoundException when there is no payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.refreshStatusForStore(user, 'store1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('refreshStatusForUser', () => {
        it('throws NotFoundException when the user has no payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.refreshStatusForUser(user)).rejects.toThrow(NotFoundException);
        });

        it('checks Viva and promotes when eligible', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' });
            vivaBankTransfers.getBankAccount.mockResolvedValue({ isArchived: false });
            prisma.payoutAccount.update.mockResolvedValue({ id: 'pa1', status: PayoutAccountStatus.ACTIVE });

            const result = await service.refreshStatusForUser(user);

            expect(result.status).toBe(PayoutAccountStatus.ACTIVE);
        });
    });

    describe('sweepPendingAccounts', () => {
        it('only queries PENDING accounts that have a linked bank account', async () => {
            prisma.payoutAccount.findMany.mockResolvedValue([]);

            await service.sweepPendingAccounts();

            expect(prisma.payoutAccount.findMany).toHaveBeenCalledWith({
                where: { status: PayoutAccountStatus.PENDING, bank_account_id: { not: null } },
            });
        });

        it('re-verifies every pending account against Viva and reports how many were promoted', async () => {
            const stillPending = { id: 'pa1', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-1' };
            const nowActive = { id: 'pa2', status: PayoutAccountStatus.PENDING, bank_account_id: 'bank-2' };
            prisma.payoutAccount.findMany.mockResolvedValue([stillPending, nowActive]);
            vivaBankTransfers.getBankAccount.mockImplementation((bankAccountId: string) =>
                Promise.resolve({ isArchived: bankAccountId === 'bank-1' }),
            );
            prisma.payoutAccount.update.mockResolvedValue({ ...nowActive, status: PayoutAccountStatus.ACTIVE });

            const result = await service.sweepPendingAccounts();

            expect(vivaBankTransfers.getBankAccount).toHaveBeenCalledWith('bank-1');
            expect(vivaBankTransfers.getBankAccount).toHaveBeenCalledWith('bank-2');
            expect(prisma.payoutAccount.update).toHaveBeenCalledTimes(1);
            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { id: 'pa2' },
                data: { status: PayoutAccountStatus.ACTIVE },
            });
            expect(result).toEqual({ checked: 2, promoted: 1 });
        });

        it('reports zero promotions when nothing is pending', async () => {
            prisma.payoutAccount.findMany.mockResolvedValue([]);

            const result = await service.sweepPendingAccounts();

            expect(result).toEqual({ checked: 0, promoted: 0 });
        });
    });
});
