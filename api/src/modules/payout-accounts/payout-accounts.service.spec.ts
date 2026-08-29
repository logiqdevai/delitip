import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthRole, OrganizationRole, PaymentProvider, PayoutAccountOwnerType, PayoutAccountStatus } from 'generated/prisma';
import { PayoutAccountsService } from './payout-accounts.service';

// No real payment processor is wired up — connecting an account is simulated
// as instantly successful and ACTIVE. Don't assume real Stripe/Viva calls.
describe('PayoutAccountsService', () => {
    let service: PayoutAccountsService;
    let prisma: any;
    let accessControl: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        prisma = {
            payoutAccount: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
        };
        accessControl = { assertStoreAccess: jest.fn() };
        service = new PayoutAccountsService(prisma, accessControl);
    });

    describe('createForStore', () => {
        it('requires OWNER-level store access', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            prisma.payoutAccount.create.mockResolvedValue({});

            await service.createForStore(user, 'store1', {});

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws ConflictException when the store already has a payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createForStore(user, 'store1', {})).rejects.toThrow(ConflictException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
        });

        it('creates an instantly-ACTIVE mocked payout account defaulting to VIVA', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            const created = { id: 'pa1' };
            prisma.payoutAccount.create.mockResolvedValue(created);

            const result = await service.createForStore(user, 'store1', {});

            expect(result).toBe(created);
            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    owner_type: PayoutAccountOwnerType.STORE,
                    store_id: 'store1',
                    provider: PaymentProvider.VIVA,
                    status: PayoutAccountStatus.ACTIVE,
                }),
            });
        });

        it('respects an explicitly requested provider', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            prisma.payoutAccount.create.mockResolvedValue({});

            await service.createForStore(user, 'store1', { provider: PaymentProvider.STRIPE });

            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({ provider: PaymentProvider.STRIPE }),
            });
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
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', {});

            expect(accessControl.assertStoreAccess).toHaveBeenCalledWith(user, 'store1', [OrganizationRole.OWNER]);
        });

        it('throws NotFoundException when there is no existing payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);

            await expect(service.updateForStore(user, 'store1', {})).rejects.toThrow(NotFoundException);
            expect(prisma.payoutAccount.update).not.toHaveBeenCalled();
        });

        it('only writes fields that are present in the DTO (partial-update semantics)', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', { status: PayoutAccountStatus.RESTRICTED });

            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                data: { status: PayoutAccountStatus.RESTRICTED },
            });
        });

        it('writes both fields when both are present', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', {
                status: PayoutAccountStatus.DISABLED,
                provider: PaymentProvider.PAYPAL,
            });

            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                data: { status: PayoutAccountStatus.DISABLED, provider: PaymentProvider.PAYPAL },
            });
        });

        it('writes no fields when the DTO is empty', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'pa1' });
            prisma.payoutAccount.update.mockResolvedValue({});

            await service.updateForStore(user, 'store1', {});

            expect(prisma.payoutAccount.update).toHaveBeenCalledWith({
                where: { store_id: 'store1' },
                data: {},
            });
        });
    });

    describe('createForUser', () => {
        it('throws ConflictException when the user already has a payout account', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.createForUser(user, {})).rejects.toThrow(ConflictException);
            expect(prisma.payoutAccount.create).not.toHaveBeenCalled();
        });

        it('creates an instantly-ACTIVE mocked payout account owned by the user', async () => {
            prisma.payoutAccount.findUnique.mockResolvedValue(null);
            const created = { id: 'pa1' };
            prisma.payoutAccount.create.mockResolvedValue(created);

            const result = await service.createForUser(user, {});

            expect(result).toBe(created);
            expect(prisma.payoutAccount.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    owner_type: PayoutAccountOwnerType.USER,
                    user_id: 'u1',
                    provider: PaymentProvider.VIVA,
                    status: PayoutAccountStatus.ACTIVE,
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
