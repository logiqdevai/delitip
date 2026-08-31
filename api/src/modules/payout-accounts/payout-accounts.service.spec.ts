import { BadGatewayException, ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, PaymentProvider, PayoutAccountOwnerType, PayoutAccountStatus, PayoutMethod } from 'generated/prisma';
import { PayoutAccountsService } from './payout-accounts.service';

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
            payoutAccount: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        vivaBankTransfers = {
            linkBankAccount: jest.fn().mockResolvedValue({ bankAccountId: 'bank-1' }),
            updateBankAccount: jest.fn().mockResolvedValue({}),
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
});
