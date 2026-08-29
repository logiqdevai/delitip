import { BadRequestException } from '@nestjs/common';
import { StripeCustomersService } from './stripe-customers.service';

describe('StripeCustomersService', () => {
    let service: StripeCustomersService;
    let stripe: any;
    let stripeConfig: any;

    beforeEach(() => {
        stripe = {
            customers: { create: jest.fn(), update: jest.fn(), retrieve: jest.fn(), del: jest.fn() },
            paymentIntents: { create: jest.fn() },
            billingPortal: { sessions: { create: jest.fn() } },
            paymentMethods: { list: jest.fn(), detach: jest.fn() },
            charges: { list: jest.fn() },
            invoices: { list: jest.fn() },
        };
        stripeConfig = { getStripeClient: jest.fn().mockReturnValue(stripe) };
        service = new StripeCustomersService(stripeConfig);
    });

    const rawCustomer = {
        id: 'cus_1',
        name: 'Alice',
        email: 'alice@example.com',
        phone: '123',
        metadata: { foo: 'bar' },
        invoice_settings: { default_payment_method: { id: 'pm_1' } },
    };

    describe('createCustomer', () => {
        it('creates and maps the customer', async () => {
            stripe.customers.create.mockResolvedValue(rawCustomer);

            const result = await service.createCustomer({ name: 'Alice', email: 'alice@example.com' });

            expect(stripe.customers.create).toHaveBeenCalledWith({
                name: 'Alice',
                email: 'alice@example.com',
                phone: undefined,
                metadata: undefined,
            });
            expect(result).toEqual({
                id: 'cus_1',
                name: 'Alice',
                email: 'alice@example.com',
                phone: '123',
                metadata: { foo: 'bar' },
                default_payment_method: 'pm_1',
            });
        });

        it('maps missing optional fields to undefined/empty defaults', async () => {
            stripe.customers.create.mockResolvedValue({ id: 'cus_2', name: null, email: null, phone: null, metadata: null, invoice_settings: null });

            const result = await service.createCustomer({});

            expect(result).toEqual({
                id: 'cus_2',
                name: undefined,
                email: undefined,
                phone: undefined,
                metadata: {},
                default_payment_method: undefined,
            });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.create.mockRejectedValue(new Error('boom'));

            await expect(service.createCustomer({})).rejects.toThrow(BadRequestException);
            await expect(service.createCustomer({})).rejects.toThrow('Failed to create Stripe customer: boom');
        });
    });

    describe('updateCustomer', () => {
        it('updates and maps the customer', async () => {
            stripe.customers.update.mockResolvedValue(rawCustomer);

            const result = await service.updateCustomer('cus_1', { name: 'Alice 2' });

            expect(stripe.customers.update).toHaveBeenCalledWith('cus_1', {
                name: 'Alice 2',
                email: undefined,
                phone: undefined,
                metadata: undefined,
            });
            expect(result.id).toBe('cus_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.update.mockRejectedValue(new Error('boom'));

            await expect(service.updateCustomer('cus_1', {})).rejects.toThrow('Failed to update Stripe customer: boom');
        });
    });

    describe('getCustomer', () => {
        it('retrieves and maps the customer', async () => {
            stripe.customers.retrieve.mockResolvedValue(rawCustomer);

            const result = await service.getCustomer('cus_1');

            expect(stripe.customers.retrieve).toHaveBeenCalledWith('cus_1', { expand: ['invoice_settings.default_payment_method'] });
            expect(result.id).toBe('cus_1');
        });

        it('throws (wrapped) when the customer has been deleted', async () => {
            stripe.customers.retrieve.mockResolvedValue({ deleted: true });

            await expect(service.getCustomer('cus_1')).rejects.toThrow(BadRequestException);
            await expect(service.getCustomer('cus_1')).rejects.toThrow('Failed to get Stripe customer: Customer has been deleted');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getCustomer('cus_1')).rejects.toThrow('Failed to get Stripe customer: boom');
        });
    });

    describe('deleteCustomer', () => {
        it('deletes the customer', async () => {
            stripe.customers.del.mockResolvedValue({});

            await service.deleteCustomer('cus_1');

            expect(stripe.customers.del).toHaveBeenCalledWith('cus_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.del.mockRejectedValue(new Error('boom'));

            await expect(service.deleteCustomer('cus_1')).rejects.toThrow('Failed to delete Stripe customer: boom');
        });
    });

    describe('createPaymentIntent', () => {
        it('creates a payment intent using the customer default payment method, converting amount to cents', async () => {
            stripe.customers.retrieve.mockResolvedValue(rawCustomer);
            stripe.paymentIntents.create.mockResolvedValue({ id: 'pi_1' });

            const result = await service.createPaymentIntent({
                account_uuid: 'acc1',
                customer_id: 'cus_1',
                amount: 10,
            });

            expect(stripe.paymentIntents.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    amount: 1000,
                    currency: 'eur',
                    customer: 'cus_1',
                    payment_method: 'pm_1',
                    confirm: true,
                    off_session: true,
                    metadata: { context: expect.anything(), account_uuid: 'acc1' },
                }),
            );
            expect(result).toEqual({ id: 'pi_1' });
        });

        it('defaults currency to eur when not provided, and respects an explicit currency', async () => {
            stripe.customers.retrieve.mockResolvedValue(rawCustomer);
            stripe.paymentIntents.create.mockResolvedValue({ id: 'pi_1' });

            await service.createPaymentIntent({ account_uuid: 'acc1', customer_id: 'cus_1', amount: 5, currency: 'usd' });

            expect(stripe.paymentIntents.create).toHaveBeenCalledWith(expect.objectContaining({ currency: 'usd' }));
        });

        it('wraps a failure to load the customer', async () => {
            stripe.customers.retrieve.mockRejectedValue(new Error('no customer'));

            await expect(
                service.createPaymentIntent({ account_uuid: 'acc1', customer_id: 'cus_1', amount: 5 }),
            ).rejects.toThrow(BadRequestException);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.retrieve.mockResolvedValue(rawCustomer);
            stripe.paymentIntents.create.mockRejectedValue(new Error('boom'));

            await expect(
                service.createPaymentIntent({ account_uuid: 'acc1', customer_id: 'cus_1', amount: 5 }),
            ).rejects.toThrow('boom');
        });
    });

    describe('createBillingPortalSession', () => {
        it('returns the session url', async () => {
            stripe.billingPortal.sessions.create.mockResolvedValue({ url: 'https://billing.example.com' });

            await expect(service.createBillingPortalSession('cus_1', 'https://return.example.com')).resolves.toEqual({
                url: 'https://billing.example.com',
            });
            expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({ customer: 'cus_1', return_url: 'https://return.example.com' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.billingPortal.sessions.create.mockRejectedValue(new Error('boom'));

            await expect(service.createBillingPortalSession('cus_1', 'url')).rejects.toThrow(
                'Failed to create Stripe billing portal session: boom',
            );
        });
    });

    describe('getPaymentMethods', () => {
        it('maps payment methods and flags the default one', async () => {
            stripe.paymentMethods.list.mockResolvedValue({
                data: [
                    { id: 'pm_1', card: { brand: 'visa', last4: '4242', exp_month: 1, exp_year: 2030 } },
                    { id: 'pm_2', card: { brand: 'mc', last4: '1111', exp_month: 2, exp_year: 2031 } },
                ],
            });
            stripe.customers.retrieve.mockResolvedValue(rawCustomer);

            const result = await service.getPaymentMethods('cus_1');

            expect(stripe.paymentMethods.list).toHaveBeenCalledWith({ customer: 'cus_1', type: 'card' });
            expect(result).toEqual([
                { id: 'pm_1', brand: 'visa', last4: '4242', default: true, exp_month: 1, exp_year: 2030 },
                { id: 'pm_2', brand: 'mc', last4: '1111', default: false, exp_month: 2, exp_year: 2031 },
            ]);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.paymentMethods.list.mockRejectedValue(new Error('boom'));

            await expect(service.getPaymentMethods('cus_1')).rejects.toThrow('Failed to get Stripe payment methods: boom');
        });
    });

    describe('setDefaultPaymentMethod', () => {
        it('updates the customer invoice settings', async () => {
            stripe.customers.update.mockResolvedValue({});

            await service.setDefaultPaymentMethod('cus_1', 'pm_1');

            expect(stripe.customers.update).toHaveBeenCalledWith('cus_1', { invoice_settings: { default_payment_method: 'pm_1' } });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.customers.update.mockRejectedValue(new Error('boom'));

            await expect(service.setDefaultPaymentMethod('cus_1', 'pm_1')).rejects.toThrow('Failed to set default payment method: boom');
        });
    });

    describe('deletePaymentMethod', () => {
        it('detaches the payment method', async () => {
            stripe.paymentMethods.detach.mockResolvedValue({});

            await service.deletePaymentMethod('pm_1');

            expect(stripe.paymentMethods.detach).toHaveBeenCalledWith('pm_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.paymentMethods.detach.mockRejectedValue(new Error('boom'));

            await expect(service.deletePaymentMethod('pm_1')).rejects.toThrow('Failed to delete payment method: boom');
        });
    });

    describe('getPayments', () => {
        it('maps charges to payments', async () => {
            stripe.charges.list.mockResolvedValue({
                data: [{ id: 'ch_1', amount: 500, currency: 'eur', status: 'succeeded', created: 111, description: 'desc' }],
            });

            const result = await service.getPayments('cus_1');

            expect(stripe.charges.list).toHaveBeenCalledWith({ customer: 'cus_1', limit: 10 });
            expect(result).toEqual([{ id: 'ch_1', amount: 500, currency: 'eur', status: 'succeeded', created: 111, description: 'desc' }]);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.charges.list.mockRejectedValue(new Error('boom'));

            await expect(service.getPayments('cus_1')).rejects.toThrow('Failed to get Stripe payments: boom');
        });
    });

    describe('getInvoices', () => {
        it('maps invoices', async () => {
            stripe.invoices.list.mockResolvedValue({
                data: [{ id: 'in_1', amount_due: 100, currency: 'eur', status: 'open', invoice_pdf: 'https://pdf' }],
            });

            const result = await service.getInvoices('cus_1');

            expect(stripe.invoices.list).toHaveBeenCalledWith({ customer: 'cus_1', limit: 10 });
            expect(result).toEqual([{ id: 'in_1', amount_due: 100, currency: 'eur', status: 'open', invoice_pdf: 'https://pdf' }]);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.invoices.list.mockRejectedValue(new Error('boom'));

            await expect(service.getInvoices('cus_1')).rejects.toThrow('Failed to get Stripe invoices: boom');
        });
    });
});
