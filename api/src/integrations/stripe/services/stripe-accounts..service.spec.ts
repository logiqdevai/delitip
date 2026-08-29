import { BadRequestException } from '@nestjs/common';
import { StripeAccountsService } from './stripe-accounts..service';

describe('StripeAccountsService', () => {
    let service: StripeAccountsService;
    let stripe: any;
    let stripeConfig: any;
    let configService: any;

    beforeEach(() => {
        stripe = {
            accounts: { create: jest.fn(), retrieve: jest.fn(), createLoginLink: jest.fn(), del: jest.fn() },
            accountLinks: { create: jest.fn() },
            balance: { retrieve: jest.fn() },
            balanceTransactions: { list: jest.fn() },
            charges: { list: jest.fn() },
            payouts: { list: jest.fn() },
        };
        stripeConfig = { getStripeClient: jest.fn().mockReturnValue(stripe) };
        configService = { get: jest.fn().mockReturnValue('https://app.example.com') };
        service = new StripeAccountsService(stripeConfig, configService);
    });

    describe('createConnectAccount', () => {
        const payload = {
            account_uuid: 'acc1',
            email: 'a@b.com',
            phone: '123',
            first_name: 'A',
            last_name: 'B',
            country: 'US',
            city: 'NYC',
            address: '1 Main St',
        } as any;

        it('maps the created account, including derived onboarding/capability flags', async () => {
            stripe.accounts.create.mockResolvedValue({
                id: 'acct_1',
                charges_enabled: true,
                details_submitted: true,
                payouts_enabled: true,
                capabilities: { transfers: 'active', card_payments: 'inactive' },
            });

            const result = await service.createConnectAccount(payload);

            expect(result).toEqual({
                account_id: 'acct_1',
                charges_enabled: true,
                details_submitted: true,
                payouts_enabled: true,
                finished_onboarding: true,
                capabilities: { transfers: true, card_payments: false },
            });
        });

        it('marks onboarding unfinished when charges or payouts are still disabled', async () => {
            stripe.accounts.create.mockResolvedValue({
                id: 'acct_1',
                charges_enabled: true,
                details_submitted: true,
                payouts_enabled: false,
                capabilities: {},
            });

            const result = await service.createConnectAccount(payload);

            expect(result.finished_onboarding).toBe(false);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.accounts.create.mockRejectedValue(new Error('stripe down'));

            await expect(service.createConnectAccount(payload)).rejects.toThrow(BadRequestException);
            await expect(service.createConnectAccount(payload)).rejects.toThrow(/Failed to create Stripe Connect account: stripe down/);
        });
    });

    describe('generateOnboardingLink', () => {
        it('returns the onboarding link fields', async () => {
            stripe.accountLinks.create.mockResolvedValue({
                object: 'account_link',
                created: 111,
                expires_at: 222,
                url: 'https://stripe.com/onboard',
            });

            const result = await service.generateOnboardingLink('acct_1');

            expect(result).toEqual({ object: 'account_link', created: 111, expires_at: 222, url: 'https://stripe.com/onboard' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.accountLinks.create.mockRejectedValue(new Error('boom'));

            await expect(service.generateOnboardingLink('acct_1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getConnectAccount', () => {
        it('maps the retrieved account', async () => {
            stripe.accounts.retrieve.mockResolvedValue({
                id: 'acct_1',
                charges_enabled: true,
                details_submitted: true,
                payouts_enabled: true,
                individual: { id: 'ind_1' },
                company: null,
                external_accounts: { data: [] },
                business_profile: null,
                requirements: {},
                capabilities: { transfers: 'active', card_payments: 'active' },
            });

            const result = await service.getConnectAccount('acct_1');

            expect(result.account_id).toBe('acct_1');
            expect(result.finished_onboarding).toBe(true);
            expect(result.capabilities).toEqual({ transfers: true, card_payments: true });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.accounts.retrieve.mockRejectedValue(new Error('not found'));

            await expect(service.getConnectAccount('acct_1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('getAccountLoginLink', () => {
        it('returns the login link url', async () => {
            stripe.accounts.createLoginLink.mockResolvedValue({ url: 'https://stripe.com/login' });

            await expect(service.getAccountLoginLink('acct_1')).resolves.toBe('https://stripe.com/login');
        });

        it('wraps a missing url as BadRequestException', async () => {
            stripe.accounts.createLoginLink.mockResolvedValue({ url: '' });

            await expect(service.getAccountLoginLink('acct_1')).rejects.toThrow(BadRequestException);
            await expect(service.getAccountLoginLink('acct_1')).rejects.toThrow(/Could not get login link/);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.accounts.createLoginLink.mockRejectedValue(new Error('boom'));

            await expect(service.getAccountLoginLink('acct_1')).rejects.toThrow(BadRequestException);
        });
    });

    describe('deleteConnectAccount', () => {
        it('is a no-op when no account id is given', async () => {
            await service.deleteConnectAccount('');

            expect(stripe.accounts.del).not.toHaveBeenCalled();
        });

        it('deletes the account', async () => {
            stripe.accounts.del.mockResolvedValue({});

            await service.deleteConnectAccount('acct_1');

            expect(stripe.accounts.del).toHaveBeenCalledWith('acct_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.accounts.del.mockRejectedValue(new Error('boom'));

            await expect(service.deleteConnectAccount('acct_1')).rejects.toThrow(BadRequestException);
        });
    });

    // NOTE: getConnectedBalance/listBalanceTransactions/listCharges/listPayouts all share
    // `try { return this.stripe.X.list(...); } catch (error) { throw new error; }` with no
    // `await` before the SDK call — see api/TEST_COVERAGE_PLAN.md Findings for
    // stripe-accounts..service.ts. Because the SDK call is never awaited inside the try block,
    // a rejected promise from it is returned as-is to the caller; the `catch` (and its own bug,
    // `throw new error` — throwing the caught Error instance via `new`, which would itself
    // throw a TypeError "error is not a constructor") never actually runs for async rejections.
    // Net effect: the ORIGINAL Stripe error propagates unchanged, unwrapped. These tests assert
    // that CURRENT behavior on purpose — not what the method "should" do — so a future fix
    // (e.g. adding `await`, fixing the typo) is visible as a test change, not a silent regression.
    describe('getConnectedBalance', () => {
        it('returns the balance for the connected account', async () => {
            stripe.balance.retrieve.mockResolvedValue({ available: [], pending: [] });

            const result = await service.getConnectedBalance('acct_1');

            expect(stripe.balance.retrieve).toHaveBeenCalledWith({}, { stripeAccount: 'acct_1' });
            expect(result).toEqual({ available: [], pending: [] });
        });

        it('propagates the original (unwrapped) error on rejection — the catch block is unreachable dead code, see note above', async () => {
            stripe.balance.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getConnectedBalance('acct_1')).rejects.toThrow('boom');
        });
    });

    describe('listBalanceTransactions', () => {
        it('lists balance transactions with the default limit', async () => {
            stripe.balanceTransactions.list.mockResolvedValue({ data: [] });

            await service.listBalanceTransactions('acct_1');

            expect(stripe.balanceTransactions.list).toHaveBeenCalledWith({ limit: 50 }, { stripeAccount: 'acct_1' });
        });

        it('propagates the original (unwrapped) error on rejection — the catch block is unreachable dead code, see note above', async () => {
            stripe.balanceTransactions.list.mockRejectedValue(new Error('boom'));

            await expect(service.listBalanceTransactions('acct_1')).rejects.toThrow('boom');
        });
    });

    describe('listCharges', () => {
        it('lists charges with the default limit', async () => {
            stripe.charges.list.mockResolvedValue({ data: [] });

            await service.listCharges('acct_1');

            expect(stripe.charges.list).toHaveBeenCalledWith({ limit: 50 }, { stripeAccount: 'acct_1' });
        });

        it('propagates the original (unwrapped) error on rejection — the catch block is unreachable dead code, see note above', async () => {
            stripe.charges.list.mockRejectedValue(new Error('boom'));

            await expect(service.listCharges('acct_1')).rejects.toThrow('boom');
        });
    });

    describe('listPayouts', () => {
        it('lists payouts with the default limit', async () => {
            stripe.payouts.list.mockResolvedValue({ data: [] });

            await service.listPayouts('acct_1');

            expect(stripe.payouts.list).toHaveBeenCalledWith({ limit: 50 }, { stripeAccount: 'acct_1' });
        });

        it('propagates the original (unwrapped) error on rejection — the catch block is unreachable dead code, see note above', async () => {
            stripe.payouts.list.mockRejectedValue(new Error('boom'));

            await expect(service.listPayouts('acct_1')).rejects.toThrow('boom');
        });
    });
});
