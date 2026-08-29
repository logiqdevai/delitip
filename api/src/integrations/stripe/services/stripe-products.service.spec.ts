import { BadRequestException } from '@nestjs/common';
import { StripeProductsService } from './stripe-products.service';

describe('StripeProductsService', () => {
    let service: StripeProductsService;
    let stripe: any;
    let stripeConfig: any;

    const stripeService = { name: 'Haircut', description: 'A nice cut', account_uuid: 'acc1', uuid: 'svc1', price: 25 };

    beforeEach(() => {
        stripe = {
            products: { create: jest.fn(), update: jest.fn(), del: jest.fn(), retrieve: jest.fn(), list: jest.fn() },
            prices: { create: jest.fn(), update: jest.fn(), retrieve: jest.fn(), list: jest.fn() },
        };
        stripeConfig = { getStripeClient: jest.fn().mockReturnValue(stripe) };
        service = new StripeProductsService(stripeConfig);
    });

    describe('createProduct', () => {
        it('creates a product with merged metadata and maps the response', async () => {
            stripe.products.create.mockResolvedValue({
                id: 'prod_1',
                name: 'Haircut',
                description: 'A nice cut',
                active: true,
                created: 111,
                metadata: { account_uuid: 'acc1', service_uuid: 'svc1' },
            });

            const result = await service.createProduct({ service: stripeService, stripe_account_id: 'acct_1', metadata: { foo: 'bar' } });

            expect(stripe.products.create).toHaveBeenCalledWith(
                {
                    name: 'Haircut',
                    description: 'A nice cut',
                    metadata: { foo: 'bar', account_uuid: 'acc1', service_uuid: 'svc1' },
                },
                { stripeAccount: 'acct_1' },
            );
            expect(result).toEqual({
                id: 'prod_1',
                name: 'Haircut',
                description: 'A nice cut',
                active: true,
                created: 111,
                metadata: { account_uuid: 'acc1', service_uuid: 'svc1' },
            });
        });

        it('maps a missing description to undefined', async () => {
            stripe.products.create.mockResolvedValue({ id: 'prod_1', name: 'Haircut', description: '', active: true, created: 111, metadata: {} });

            const result = await service.createProduct({ service: stripeService });

            expect(result.description).toBeUndefined();
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.products.create.mockRejectedValue(new Error('boom'));

            await expect(service.createProduct({ service: stripeService })).rejects.toThrow('Failed to create Stripe product: boom');
        });
    });

    describe('createPrice', () => {
        it('creates a price converting the service price to cents, defaulting currency to eur', async () => {
            stripe.prices.create.mockResolvedValue({
                id: 'price_1',
                product: 'prod_1',
                unit_amount: 2500,
                currency: 'eur',
                active: true,
                type: 'one_time',
                created: 111,
                metadata: {},
            });

            const result = await service.createPrice({ product_id: 'prod_1', service: stripeService });

            expect(stripe.prices.create).toHaveBeenCalledWith(
                expect.objectContaining({ product: 'prod_1', unit_amount: 2500, currency: 'eur' }),
                { stripeAccount: undefined },
            );
            expect(result.unit_amount).toBe(25);
        });

        it('respects an explicit currency', async () => {
            stripe.prices.create.mockResolvedValue({ id: 'price_1', product: 'prod_1', unit_amount: 2500, currency: 'usd', active: true, type: 'one_time', created: 111, metadata: {} });

            await service.createPrice({ product_id: 'prod_1', service: stripeService, currency: 'usd' });

            expect(stripe.prices.create).toHaveBeenCalledWith(expect.objectContaining({ currency: 'usd' }), expect.anything());
        });

        it('defaults unit_amount to 0 when Stripe returns a falsy amount', async () => {
            stripe.prices.create.mockResolvedValue({ id: 'price_1', product: 'prod_1', unit_amount: 0, currency: 'eur', active: true, type: 'one_time', created: 111, metadata: {} });

            const result = await service.createPrice({ product_id: 'prod_1', service: stripeService });

            expect(result.unit_amount).toBe(0);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.prices.create.mockRejectedValue(new Error('boom'));

            await expect(service.createPrice({ product_id: 'prod_1', service: stripeService })).rejects.toThrow('Failed to create Stripe price: boom');
        });
    });

    describe('createProductAndPrice', () => {
        it('creates the product then the price for it', async () => {
            stripe.products.create.mockResolvedValue({ id: 'prod_1', name: 'Haircut', description: '', active: true, created: 111, metadata: {} });
            stripe.prices.create.mockResolvedValue({ id: 'price_1', product: 'prod_1', unit_amount: 2500, currency: 'eur', active: true, type: 'one_time', created: 111, metadata: {} });

            const result = await service.createProductAndPrice({ service: stripeService });

            expect(stripe.prices.create).toHaveBeenCalledWith(expect.objectContaining({ product: 'prod_1' }), expect.anything());
            expect(result.product.id).toBe('prod_1');
            expect(result.price.id).toBe('price_1');
        });

        it('wraps a failure from either sub-call in its own BadRequestException message', async () => {
            stripe.products.create.mockRejectedValue(new Error('boom'));

            await expect(service.createProductAndPrice({ service: stripeService })).rejects.toThrow(
                'Failed to create Stripe product and price: Failed to create Stripe product: boom',
            );
        });
    });

    describe('updateProduct', () => {
        it('is a no-op when no product_id is given', async () => {
            await service.updateProduct('', undefined, {});

            expect(stripe.products.update).not.toHaveBeenCalled();
        });

        it('updates the product', async () => {
            stripe.products.update.mockResolvedValue({});

            await service.updateProduct('prod_1', 'acct_1', { active: false, name: 'New name' });

            expect(stripe.products.update).toHaveBeenCalledWith(
                'prod_1',
                { active: false, name: 'New name', description: undefined, metadata: undefined },
                { stripeAccount: 'acct_1' },
            );
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.products.update.mockRejectedValue(new Error('boom'));

            await expect(service.updateProduct('prod_1', undefined, {})).rejects.toThrow('Failed to update Stripe product: boom');
        });
    });

    describe('deleteProduct', () => {
        it('deletes the product', async () => {
            stripe.products.del.mockResolvedValue({});

            await service.deleteProduct('prod_1', 'acct_1');

            expect(stripe.products.del).toHaveBeenCalledWith('prod_1', { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.products.del.mockRejectedValue(new Error('boom'));

            await expect(service.deleteProduct('prod_1', undefined)).rejects.toThrow('Failed to delete Stripe product: boom');
        });
    });

    describe('toggleProductAndPrice', () => {
        it('is a no-op when product_id or price_id is missing', async () => {
            await service.toggleProductAndPrice({ product_id: '', price_id: 'price_1', active: false });
            await service.toggleProductAndPrice({ product_id: 'prod_1', price_id: '', active: false });

            expect(stripe.prices.update).not.toHaveBeenCalled();
            expect(stripe.products.update).not.toHaveBeenCalled();
        });

        it('updates both the price and the product active flag', async () => {
            stripe.prices.update.mockResolvedValue({});
            stripe.products.update.mockResolvedValue({});

            await service.toggleProductAndPrice({ product_id: 'prod_1', price_id: 'price_1', active: false, stripe_account_id: 'acct_1' });

            expect(stripe.prices.update).toHaveBeenCalledWith('price_1', { active: false }, { stripeAccount: 'acct_1' });
            expect(stripe.products.update).toHaveBeenCalledWith('prod_1', { active: false }, { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.prices.update.mockRejectedValue(new Error('boom'));

            await expect(
                service.toggleProductAndPrice({ product_id: 'prod_1', price_id: 'price_1', active: true }),
            ).rejects.toThrow('Failed to disable Stripe product and price: boom');
        });
    });

    describe('changePrice', () => {
        it('deactivates the old price and creates a new one, returning its id', async () => {
            stripe.prices.update.mockResolvedValue({});
            stripe.prices.create.mockResolvedValue({ id: 'price_2' });

            const result = await service.changePrice({
                product_id: 'prod_1',
                price_id: 'price_1',
                price: 30,
                service: stripeService,
            });

            expect(stripe.prices.update).toHaveBeenCalledWith('price_1', { active: false }, expect.anything());
            expect(stripe.prices.create).toHaveBeenCalledWith(expect.objectContaining({ product: 'prod_1', unit_amount: 3000 }), expect.anything());
            expect(result).toBe('price_2');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.prices.update.mockRejectedValue(new Error('boom'));

            await expect(
                service.changePrice({ product_id: 'prod_1', price_id: 'price_1', price: 30, service: stripeService }),
            ).rejects.toThrow('Failed to change price: boom');
        });
    });

    describe('getProduct', () => {
        it('maps the retrieved product', async () => {
            stripe.products.retrieve.mockResolvedValue({ id: 'prod_1', name: 'Haircut', description: 'x', active: true, created: 111, metadata: {} });

            const result = await service.getProduct('prod_1', 'acct_1');

            expect(stripe.products.retrieve).toHaveBeenCalledWith('prod_1', { stripeAccount: 'acct_1' });
            expect(result.id).toBe('prod_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.products.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getProduct('prod_1', undefined)).rejects.toThrow('Failed to retrieve Stripe product: boom');
        });
    });

    describe('getPrice', () => {
        it('maps the retrieved price WITHOUT converting unit_amount to major units (unlike createPrice/listPrices)', async () => {
            stripe.prices.retrieve.mockResolvedValue({ id: 'price_1', product: 'prod_1', unit_amount: 2500, currency: 'eur', active: true, type: 'one_time', created: 111, metadata: {} });

            const result = await service.getPrice('price_1', 'acct_1');

            expect(stripe.prices.retrieve).toHaveBeenCalledWith('price_1', { stripeAccount: 'acct_1' });
            expect(result.unit_amount).toBe(2500);
        });

        it('defaults unit_amount to 0 when falsy', async () => {
            stripe.prices.retrieve.mockResolvedValue({ id: 'price_1', product: 'prod_1', unit_amount: 0, currency: 'eur', active: true, type: 'one_time', created: 111, metadata: {} });

            const result = await service.getPrice('price_1', undefined);

            expect(result.unit_amount).toBe(0);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.prices.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getPrice('price_1', undefined)).rejects.toThrow('Failed to retrieve Stripe price: boom');
        });
    });

    describe('listProducts', () => {
        it('lists and maps products', async () => {
            stripe.products.list.mockResolvedValue({ data: [{ id: 'prod_1', name: 'Haircut', description: 'x', active: true, created: 111, metadata: {} }] });

            const result = await service.listProducts('acct_1');

            expect(stripe.products.list).toHaveBeenCalledWith({ limit: 50 }, { stripeAccount: 'acct_1' });
            expect(result).toEqual([{ id: 'prod_1', name: 'Haircut', description: 'x', active: true, created: 111, metadata: {} }]);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.products.list.mockRejectedValue(new Error('boom'));

            await expect(service.listProducts()).rejects.toThrow('Failed to list Stripe products: boom');
        });
    });

    describe('listPrices', () => {
        it('lists and maps prices, converting unit_amount to major units', async () => {
            stripe.prices.list.mockResolvedValue({
                data: [{ id: 'price_1', product: 'prod_1', unit_amount: 2500, currency: 'eur', active: true, type: 'one_time', created: 111, metadata: {} }],
            });

            const result = await service.listPrices('prod_1', 'acct_1');

            expect(stripe.prices.list).toHaveBeenCalledWith({ product: 'prod_1', limit: 50 }, { stripeAccount: 'acct_1' });
            expect(result[0].unit_amount).toBe(25);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.prices.list.mockRejectedValue(new Error('boom'));

            await expect(service.listPrices('prod_1')).rejects.toThrow('Failed to list Stripe prices: boom');
        });
    });
});
