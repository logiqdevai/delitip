import { BadRequestException } from '@nestjs/common';
import { StripePaymentsService } from './stripe-payments.service';
import { StripePaymentContext } from '../interfaces/stripe-payments.interface';

describe('StripePaymentsService', () => {
    let service: StripePaymentsService;
    let stripe: any;
    let stripeConfig: any;

    beforeEach(() => {
        stripe = {
            checkout: { sessions: { create: jest.fn(), retrieve: jest.fn() } },
            paymentIntents: { retrieve: jest.fn() },
            charges: { retrieve: jest.fn() },
            transfers: { retrieve: jest.fn() },
            refunds: { create: jest.fn() },
            balanceTransactions: { retrieve: jest.fn() },
        };
        stripeConfig = { getStripeClient: jest.fn().mockReturnValue(stripe) };
        service = new StripePaymentsService(stripeConfig);
    });

    describe('createCheckoutSession', () => {
        const payload = {
            account_uuid: 'acc1',
            stripe_account_id: 'acct_1',
            price_id: 'price_1',
            booking_uuid: 'booking_1',
            client_email: 'a@b.com',
        };

        it('creates a checkout session with the platform-fee/transfer-destination payment_intent_data', async () => {
            stripe.checkout.sessions.create.mockResolvedValue({ id: 'cs_1' });

            const result = await service.createCheckoutSession({ ...payload, platform_fee: 100 });

            expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    customer_email: 'a@b.com',
                    line_items: [{ price: 'price_1', quantity: 1 }],
                    mode: 'payment',
                    payment_intent_data: expect.objectContaining({
                        application_fee_amount: 100,
                        transfer_data: { destination: 'acct_1' },
                        metadata: expect.objectContaining({ booking_uuid: 'booking_1', context: StripePaymentContext.BOOKING_PAYMENT }),
                    }),
                }),
            );
            expect(result).toEqual({ id: 'cs_1' });
        });

        it('omits application_fee_amount when no platform_fee is given', async () => {
            stripe.checkout.sessions.create.mockResolvedValue({ id: 'cs_1' });

            await service.createCheckoutSession(payload);

            expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    payment_intent_data: expect.objectContaining({ application_fee_amount: undefined }),
                }),
            );
        });

        it('applies a discount when a promotion code is provided', async () => {
            stripe.checkout.sessions.create.mockResolvedValue({ id: 'cs_1' });

            await service.createCheckoutSession({ ...payload, stripe_promotion_code_id: 'promo_1' });

            expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
                expect.objectContaining({ discounts: [{ promotion_code: 'promo_1' }] }),
            );
        });

        it('propagates a Stripe failure unwrapped (no try/catch around this call)', async () => {
            stripe.checkout.sessions.create.mockRejectedValue(new Error('boom'));

            await expect(service.createCheckoutSession(payload)).rejects.toThrow('boom');
        });
    });

    describe('getPaymentIntent', () => {
        it('maps a payment intent with its latest charge', async () => {
            stripe.paymentIntents.retrieve.mockResolvedValue({
                id: 'pi_1',
                status: 'succeeded',
                amount: 500,
                currency: 'eur',
                latest_charge: { id: 'ch_1', amount: 500, receipt_url: 'https://r', payment_method: 'pm_1' },
            });

            const result = await service.getPaymentIntent('pi_1');

            expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_1', { expand: ['charges'] });
            expect(result).toEqual({
                id: 'pi_1',
                status: 'succeeded',
                amount: 500,
                currency: 'eur',
                charges: [{ id: 'ch_1', amount: 500, receipt_url: 'https://r', payment_method: 'pm_1' }],
            });
        });

        it('returns an empty charges array when there is no latest_charge', async () => {
            stripe.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_1', status: 'requires_payment_method', amount: 500, currency: 'eur', latest_charge: null });

            const result = await service.getPaymentIntent('pi_1');

            expect(result.charges).toEqual([]);
        });

        it('wraps any failure in a generic BadRequestException', async () => {
            stripe.paymentIntents.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getPaymentIntent('pi_1')).rejects.toThrow(new BadRequestException('Failed to get payment intent'));
        });
    });

    describe('getSession', () => {
        it('maps the session and its payment intent', async () => {
            stripe.checkout.sessions.retrieve.mockResolvedValue({
                id: 'cs_1',
                status: 'complete',
                amount_total: 1000,
                currency: 'eur',
                customer: 'cus_1',
                payment_intent: {
                    id: 'pi_1',
                    status: 'succeeded',
                    amount: 1000,
                    currency: 'eur',
                    latest_charge: { id: 'ch_1', amount: 1000, receipt_url: 'https://r', payment_method: 'pm_1' },
                },
            });

            const result = await service.getSession('cs_1');

            expect(result.session).toEqual({
                id: 'cs_1',
                status: 'complete',
                amount_total: 1000,
                currency: 'eur',
                customer: 'cus_1',
                payment_intent_id: 'pi_1',
            });
            expect(result.paymentIntent.charges).toEqual([{ id: 'ch_1', amount: 1000, receipt_url: 'https://r', payment_method: 'pm_1' }]);
        });

        it('defaults amount_total/currency when missing', async () => {
            stripe.checkout.sessions.retrieve.mockResolvedValue({
                id: 'cs_1',
                status: 'open',
                amount_total: null,
                currency: null,
                customer: null,
                payment_intent: { id: 'pi_1', status: 'requires_payment_method', amount: 0, currency: 'usd', latest_charge: null },
            });

            const result = await service.getSession('cs_1');

            expect(result.session.amount_total).toBe(0);
            expect(result.session.currency).toBe('usd');
        });

        it('wraps (as a generic message) when the session has no payment_intent, swallowing the specific reason', async () => {
            stripe.checkout.sessions.retrieve.mockResolvedValue({ id: 'cs_1', payment_intent: null });

            await expect(service.getSession('cs_1')).rejects.toThrow(new BadRequestException('Failed to get session'));
        });

        it('wraps any Stripe failure in the same generic BadRequestException', async () => {
            stripe.checkout.sessions.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getSession('cs_1')).rejects.toThrow(new BadRequestException('Failed to get session'));
        });
    });

    describe('getCharge', () => {
        const rawCharge = {
            id: 'ch_1',
            amount: 500,
            amount_captured: 500,
            amount_refunded: 0,
            receipt_url: 'https://r',
            application_fee_amount: 10,
            balance_transaction: 'txn_1',
            currency: 'eur',
            created: 111,
            status: 'succeeded',
            payment_intent: 'pi_1',
            payment_method: 'pm_1',
        };

        it('maps the charge without a connected account', async () => {
            stripe.charges.retrieve.mockResolvedValue(rawCharge);

            const result = await service.getCharge('ch_1');

            expect(stripe.charges.retrieve).toHaveBeenCalledWith('ch_1', {}, undefined);
            expect(result.id).toBe('ch_1');
        });

        it('passes the connected account when given', async () => {
            stripe.charges.retrieve.mockResolvedValue(rawCharge);

            await service.getCharge('ch_1', 'acct_1');

            expect(stripe.charges.retrieve).toHaveBeenCalledWith('ch_1', {}, { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in a generic BadRequestException', async () => {
            stripe.charges.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getCharge('ch_1')).rejects.toThrow(new BadRequestException('Failed to get charge'));
        });
    });

    describe('getTransfer', () => {
        it('returns the raw transfer', async () => {
            stripe.transfers.retrieve.mockResolvedValue({ id: 'tr_1' });

            await expect(service.getTransfer('tr_1')).resolves.toEqual({ id: 'tr_1' });
            expect(stripe.transfers.retrieve).toHaveBeenCalledWith('tr_1', undefined);
        });

        it('passes the connected account when given', async () => {
            stripe.transfers.retrieve.mockResolvedValue({ id: 'tr_1' });

            await service.getTransfer('tr_1', 'acct_1');

            expect(stripe.transfers.retrieve).toHaveBeenCalledWith('tr_1', { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in a generic BadRequestException', async () => {
            stripe.transfers.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getTransfer('tr_1')).rejects.toThrow(new BadRequestException('Failed to get transfer'));
        });
    });

    describe('refundPayment', () => {
        it('creates a customer-requested refund for the charge', async () => {
            stripe.refunds.create.mockResolvedValue({ id: 're_1' });

            await expect(service.refundPayment('ch_1')).resolves.toEqual({ id: 're_1' });
            expect(stripe.refunds.create).toHaveBeenCalledWith({ charge: 'ch_1', reason: 'requested_by_customer' });
        });

        it('wraps a Stripe failure in a generic BadRequestException', async () => {
            stripe.refunds.create.mockRejectedValue(new Error('boom'));

            await expect(service.refundPayment('ch_1')).rejects.toThrow(new BadRequestException('Failed to refund payment'));
        });
    });

    describe('getStripeFee', () => {
        it('short-circuits to zero fee/net when no balance_transaction_id is given', async () => {
            await expect(service.getStripeFee('')).resolves.toEqual({ fee: 0, net: 0 });
            expect(stripe.balanceTransactions.retrieve).not.toHaveBeenCalled();
        });

        it('returns the fee/net from the retrieved balance transaction', async () => {
            stripe.balanceTransactions.retrieve.mockResolvedValue({ fee: 30, net: 470 });

            const result = await service.getStripeFee('txn_1');

            expect(stripe.balanceTransactions.retrieve).toHaveBeenCalledWith('txn_1', undefined);
            expect(result).toEqual({ fee: 30, net: 470 });
        });

        it('passes the connected account when given', async () => {
            stripe.balanceTransactions.retrieve.mockResolvedValue({ fee: 30, net: 470 });

            await service.getStripeFee('txn_1', 'acct_1');

            expect(stripe.balanceTransactions.retrieve).toHaveBeenCalledWith('txn_1', { stripeAccount: 'acct_1' });
        });

        it('silently swallows a Stripe failure and returns zeroes (no throw)', async () => {
            stripe.balanceTransactions.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getStripeFee('txn_1')).resolves.toEqual({ fee: 0, net: 0 });
        });
    });

    describe('getAccountChargeFees', () => {
        it('returns fee/net/amount from an expanded balance_transaction object', async () => {
            stripe.charges.retrieve.mockResolvedValue({ balance_transaction: { fee: 20, net: 480, amount: 500 } });

            const result = await service.getAccountChargeFees('ch_1');

            expect(stripe.charges.retrieve).toHaveBeenCalledWith('ch_1', { expand: ['balance_transaction'] });
            expect(result).toEqual({ fee: 20, net: 480, amount: 500 });
        });

        it('returns zeroes when balance_transaction is not an expanded object (e.g. a string id)', async () => {
            stripe.charges.retrieve.mockResolvedValue({ balance_transaction: 'txn_1' });

            await expect(service.getAccountChargeFees('ch_1')).resolves.toEqual({ fee: 0, net: 0, amount: 0 });
        });

        it('returns zeroes when balance_transaction is null', async () => {
            stripe.charges.retrieve.mockResolvedValue({ balance_transaction: null });

            await expect(service.getAccountChargeFees('ch_1')).resolves.toEqual({ fee: 0, net: 0, amount: 0 });
        });

        it('silently swallows a Stripe failure and returns zeroes (no throw)', async () => {
            stripe.charges.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getAccountChargeFees('ch_1')).resolves.toEqual({ fee: 0, net: 0, amount: 0 });
        });
    });

    describe('getBalanceTransaction', () => {
        it('retrieves by id when given a string', async () => {
            stripe.balanceTransactions.retrieve.mockResolvedValue({ fee: 10, net: 90, amount: 100 });

            const result = await service.getBalanceTransaction('txn_1');

            expect(stripe.balanceTransactions.retrieve).toHaveBeenCalledWith('txn_1');
            expect(result).toEqual({ fee: 10, net: 90, amount: 100 });
        });

        it('uses the object directly when already expanded, without calling Stripe again', async () => {
            const result = await service.getBalanceTransaction({ fee: 5, net: 95, amount: 100 });

            expect(stripe.balanceTransactions.retrieve).not.toHaveBeenCalled();
            expect(result).toEqual({ fee: 5, net: 95, amount: 100 });
        });

        it('defaults missing fee/net/amount fields to 0', async () => {
            const result = await service.getBalanceTransaction({});

            expect(result).toEqual({ fee: 0, net: 0, amount: 0 });
        });

        it('wraps a Stripe failure in a generic BadRequestException', async () => {
            stripe.balanceTransactions.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getBalanceTransaction('txn_1')).rejects.toThrow(new BadRequestException('Failed to get balance transaction'));
        });
    });
});
