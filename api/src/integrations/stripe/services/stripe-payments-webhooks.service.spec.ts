import { BadRequestException } from '@nestjs/common';
import { StripePaymentsWebhooksService } from './stripe-payments-webhooks.service';
import { StripePaymentContext } from '../interfaces/stripe-payments.interface';

// This service's `handleStripeWebhook` switch statement is largely commented-out scaffold
// code carried over from a different project (bookings/credits). It used to be missing a
// trailing `break` on two cases (see api/TEST_COVERAGE_PLAN.md Findings), causing real
// fallthrough — most notably 'charge.failed' falling into 'charge.updated' and unintentionally
// triggering its live fee-calculation call. Both missing `break`s have since been fixed; these
// tests assert that each case is now properly isolated.
describe('StripePaymentsWebhooksService', () => {
    let service: StripePaymentsWebhooksService;
    let stripe: any;
    let stripeConfig: any;
    let configService: any;
    let prisma: any;
    let stripePaymentsService: any;

    beforeEach(() => {
        stripe = {
            webhooks: { constructEvent: jest.fn() },
            paymentIntents: { retrieve: jest.fn() },
        };
        stripeConfig = {
            getStripeClient: jest.fn().mockReturnValue(stripe),
            getRelativeEvents: jest.fn().mockReturnValue(new Set(['charge.succeeded'])),
        };
        configService = { get: jest.fn().mockReturnValue('whsec_test') };
        prisma = {};
        stripePaymentsService = { getBalanceTransaction: jest.fn().mockResolvedValue({ fee: 0, net: 0, amount: 0 }) };
        service = new StripePaymentsWebhooksService(stripeConfig, configService, prisma, stripePaymentsService);
    });

    const buildEvent = (type: string, object: any) => ({ type, data: { object } });

    describe('signature verification', () => {
        it('wraps a signature verification failure in BadRequestException', async () => {
            stripe.webhooks.constructEvent.mockImplementation(() => {
                throw new Error('invalid signature');
            });

            await expect(service.handleStripeWebhook('body', 'sig')).rejects.toThrow(
                new BadRequestException('Webhook Error: invalid signature'),
            );
        });

        it('uses the configured webhook secret and the raw body/signature to verify', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('unhandled.event', {}));

            await service.handleStripeWebhook('raw-body', 'sig-header');

            expect(stripe.webhooks.constructEvent).toHaveBeenCalledWith('raw-body', 'sig-header', 'whsec_test');
        });
    });

    describe('unhandled event types', () => {
        it('resolves without throwing for an event type with no case (default branch)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('some.unknown.event', {}));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });
    });

    describe('checkout.session.completed', () => {
        it('does nothing when the session has no booking_uuid metadata', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('checkout.session.completed', { mode: 'payment', metadata: {} }),
            );

            await service.handleStripeWebhook('body', 'sig');

            expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
        });

        it('does nothing when the session mode is not "payment"', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('checkout.session.completed', { mode: 'setup', metadata: { booking_uuid: 'b1' } }),
            );

            await service.handleStripeWebhook('body', 'sig');

            expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
        });

        it('retrieves the expanded payment intent for a completed payment session (no further persisted side effect — commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('checkout.session.completed', {
                    mode: 'payment',
                    metadata: { booking_uuid: 'b1' },
                    payment_intent: 'pi_1',
                }),
            );
            stripe.paymentIntents.retrieve.mockResolvedValue({ status: 'succeeded' });

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();

            expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_1', { expand: ['latest_charge.balance_transaction'] });
        });
    });

    describe('charge.updated', () => {
        it('computes fees via getBalanceTransaction and exits early when there is no booking_uuid', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.updated', { balance_transaction: 'txn_1', application_fee_amount: 10, amount_captured: 500, metadata: {} }),
            );
            stripePaymentsService.getBalanceTransaction.mockResolvedValue({ fee: 20, net: 470, amount: 500 });

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();

            expect(stripePaymentsService.getBalanceTransaction).toHaveBeenCalledWith('txn_1');
        });

        it('completes without throwing when a booking_uuid is present (remaining persistence logic is commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.updated', {
                    balance_transaction: 'txn_1',
                    application_fee_amount: 10,
                    amount_captured: 500,
                    metadata: { booking_uuid: 'b1' },
                }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });

        it('propagates (after logging) a failure from getBalanceTransaction', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.updated', { balance_transaction: 'txn_1', metadata: {} }),
            );
            stripePaymentsService.getBalanceTransaction.mockRejectedValue(new Error('boom'));

            await expect(service.handleStripeWebhook('body', 'sig')).rejects.toThrow('boom');
        });
    });

    describe('charge.failed', () => {
        it('does nothing when the charge has no payment_intent', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('charge.failed', { payment_intent: null }));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
            expect(stripePaymentsService.getBalanceTransaction).not.toHaveBeenCalled();
        });

        it('exits cleanly for a PROVIDER_PAYMENT charge.failed with no account_uuid (inner break, no fallthrough)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.failed', {
                    payment_intent: 'pi_1',
                    metadata: { context: StripePaymentContext.PROVIDER_PAYMENT },
                }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
            expect(stripePaymentsService.getBalanceTransaction).not.toHaveBeenCalled();
        });

        it('does not fall through into charge.updated when context is not PROVIDER_PAYMENT (break now present)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.failed', {
                    payment_intent: 'pi_1',
                    balance_transaction: 'txn_1',
                    metadata: {}, // no context
                }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();

            expect(stripePaymentsService.getBalanceTransaction).not.toHaveBeenCalled();
        });
    });

    describe('customer.updated (body is commented out, so it is currently a no-op)', () => {
        it('resolves without throwing when a default_payment_method is present', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('customer.updated', { invoice_settings: { default_payment_method: 'pm_1' } }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });

        it('resolves without throwing when there is no default_payment_method (early break, no fallthrough)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('customer.updated', { invoice_settings: {} }));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });
    });

    describe('payment_method.detached', () => {
        it('resolves without throwing (body is commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('payment_method.detached', { id: 'pm_1' }));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });
    });

    describe('charge.succeeded', () => {
        it('resolves without throwing regardless of payment context (all bodies are commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('charge.succeeded', {
                    payment_intent: 'pi_1',
                    customer: 'cus_1',
                    payment_method: 'pm_1',
                    metadata: { context: StripePaymentContext.PROVIDER_PAYMENT, account_uuid: 'acc1' },
                }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });

        it('resolves without throwing when there is no payment_intent (early break)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('charge.succeeded', { payment_intent: null }));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });
    });

    describe('charge.refunded / payment_intent.payment_failed', () => {
        it('resolves without throwing for charge.refunded (body is commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(buildEvent('charge.refunded', { id: 'ch_1' }));

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });

        it('resolves without throwing for payment_intent.payment_failed (body is commented out)', async () => {
            stripe.webhooks.constructEvent.mockReturnValue(
                buildEvent('payment_intent.payment_failed', {
                    metadata: { context: StripePaymentContext.BOOKING_PAYMENT, booking_uuid: 'b1' },
                }),
            );

            await expect(service.handleStripeWebhook('body', 'sig')).resolves.toBeUndefined();
        });
    });
});
