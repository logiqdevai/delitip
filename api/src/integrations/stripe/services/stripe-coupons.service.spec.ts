import { BadRequestException } from '@nestjs/common';
import { StripeCouponsService } from './stripe-coupons.service';

describe('StripeCouponsService', () => {
    let service: StripeCouponsService;
    let stripe: any;
    let stripeConfig: any;

    const rawCoupon = {
        id: 'coup_1',
        name: 'Sale',
        amount_off: 500,
        percent_off: null,
        currency: 'eur',
        duration: 'once',
        duration_in_months: null,
        max_redemptions: 10,
        redeem_by: null,
        times_redeemed: 2,
        valid: true,
        applies_to: { products: ['prod_1'] },
        created: 111,
        metadata: { foo: 'bar' },
    };

    const rawPromo = {
        id: 'promo_1',
        code: 'SAVE10',
        active: true,
        max_redemptions: 5,
        times_redeemed: 1,
        promotion: { type: 'coupon', coupon: { id: 'coup_1' } },
        expires_at: 999,
        metadata: {},
        restrictions: {},
        created: 111,
    };

    beforeEach(() => {
        stripe = {
            coupons: { create: jest.fn(), retrieve: jest.fn(), update: jest.fn(), del: jest.fn(), list: jest.fn() },
            promotionCodes: { create: jest.fn(), retrieve: jest.fn(), list: jest.fn(), update: jest.fn() },
        };
        stripeConfig = { getStripeClient: jest.fn().mockReturnValue(stripe) };
        service = new StripeCouponsService(stripeConfig);
    });

    describe('createCoupon', () => {
        it('creates and maps the coupon, converting amount_off to cents on the way in and back to major units on the way out', async () => {
            stripe.coupons.create.mockResolvedValue(rawCoupon);

            const result = await service.createCoupon('acct_1', { name: 'Sale', amount_off: 5, currency: 'eur' });

            expect(stripe.coupons.create).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'Sale', amount_off: 500, currency: 'eur' }),
                { stripeAccount: 'acct_1' },
            );
            expect(result.amount_off).toBe(5);
            expect(result.metadata).toEqual({ foo: 'bar' });
        });

        it('defaults currency to eur and leaves amount_off undefined when not given', async () => {
            stripe.coupons.create.mockResolvedValue({ ...rawCoupon, amount_off: null });

            await service.createCoupon(undefined, { percent_off: 10 });

            expect(stripe.coupons.create).toHaveBeenCalledWith(
                expect.objectContaining({ amount_off: undefined, currency: 'eur', percent_off: 10 }),
                expect.anything(),
            );
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.create.mockRejectedValue(new Error('boom'));

            await expect(service.createCoupon(undefined, {})).rejects.toThrow('Failed to create Stripe coupon: boom');
        });
    });

    describe('getCoupon', () => {
        it('maps the retrieved coupon', async () => {
            stripe.coupons.retrieve.mockResolvedValue(rawCoupon);

            const result = await service.getCoupon('coup_1', 'acct_1');

            expect(stripe.coupons.retrieve).toHaveBeenCalledWith('coup_1', { stripeAccount: 'acct_1' });
            expect(result.id).toBe('coup_1');
        });

        it('wraps (double-wraps, since the inner throw is caught by the same try) a deleted coupon as a generic retrieval failure', async () => {
            stripe.coupons.retrieve.mockResolvedValue({ ...rawCoupon, deleted: true });

            await expect(service.getCoupon('coup_1', undefined)).rejects.toThrow(
                'Failed to retrieve Stripe coupon: Coupon coup_1 has been deleted',
            );
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getCoupon('coup_1', undefined)).rejects.toThrow('Failed to retrieve Stripe coupon: boom');
        });
    });

    describe('updateCoupon', () => {
        it('updates the coupon name/metadata', async () => {
            stripe.coupons.update.mockResolvedValue({});

            await service.updateCoupon('coup_1', 'acct_1', { name: 'New name' });

            expect(stripe.coupons.update).toHaveBeenCalledWith('coup_1', { name: 'New name', metadata: undefined }, { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.update.mockRejectedValue(new Error('boom'));

            await expect(service.updateCoupon('coup_1', undefined, {})).rejects.toThrow('Failed to update Stripe coupon: boom');
        });
    });

    describe('deleteCoupon', () => {
        it('deletes the coupon', async () => {
            stripe.coupons.del.mockResolvedValue({});

            await service.deleteCoupon('coup_1', 'acct_1');

            expect(stripe.coupons.del).toHaveBeenCalledWith('coup_1', { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.del.mockRejectedValue(new Error('boom'));

            await expect(service.deleteCoupon('coup_1', undefined)).rejects.toThrow('Failed to delete Stripe coupon: boom');
        });
    });

    describe('listCoupons', () => {
        it('lists and maps coupons', async () => {
            stripe.coupons.list.mockResolvedValue({ data: [rawCoupon] });

            const result = await service.listCoupons('acct_1');

            expect(stripe.coupons.list).toHaveBeenCalledWith({ stripeAccount: 'acct_1' });
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('coup_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.list.mockRejectedValue(new Error('boom'));

            await expect(service.listCoupons()).rejects.toThrow('Failed to list Stripe coupons: boom');
        });
    });

    describe('enableCouponForProduct', () => {
        it('returns the existing coupon unchanged when the product is already included', async () => {
            stripe.coupons.retrieve.mockResolvedValue(rawCoupon); // applies_to.products already has 'prod_1'

            const result = await service.enableCouponForProduct('coup_1', 'prod_1', undefined);

            expect(stripe.coupons.create).not.toHaveBeenCalled();
            expect(result.id).toBe('coup_1');
        });

        it('creates a new coupon with the product appended when not already included', async () => {
            stripe.coupons.retrieve.mockResolvedValue(rawCoupon);
            stripe.coupons.create.mockResolvedValue({ ...rawCoupon, id: 'coup_2', applies_to: { products: ['prod_1', 'prod_2'] } });

            const result = await service.enableCouponForProduct('coup_1', 'prod_2', 'acct_1');

            expect(stripe.coupons.create).toHaveBeenCalledWith(
                expect.objectContaining({ applies_to: { products: ['prod_1', 'prod_2'] } }),
                { stripeAccount: 'acct_1' },
            );
            expect(result.id).toBe('coup_2');
        });

        it('handles a coupon with no existing applies_to.products', async () => {
            stripe.coupons.retrieve.mockResolvedValue({ ...rawCoupon, applies_to: undefined });
            stripe.coupons.create.mockResolvedValue({ ...rawCoupon, id: 'coup_2' });

            await service.enableCouponForProduct('coup_1', 'prod_9', undefined);

            expect(stripe.coupons.create).toHaveBeenCalledWith(
                expect.objectContaining({ applies_to: { products: ['prod_9'] } }),
                expect.anything(),
            );
        });

        it('wraps (as an "enable coupon" failure) when the coupon has been deleted', async () => {
            stripe.coupons.retrieve.mockResolvedValue({ ...rawCoupon, deleted: true });

            await expect(service.enableCouponForProduct('coup_1', 'prod_1', undefined)).rejects.toThrow(
                'Failed to enable coupon for product: Coupon coup_1 has been deleted',
            );
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.coupons.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.enableCouponForProduct('coup_1', 'prod_1', undefined)).rejects.toThrow(
                'Failed to enable coupon for product: boom',
            );
        });
    });

    describe('createPromotionCode', () => {
        it('creates and maps the promotion code', async () => {
            stripe.promotionCodes.create.mockResolvedValue(rawPromo);

            const result = await service.createPromotionCode('acct_1', { coupon_id: 'coup_1', code: 'SAVE10' });

            expect(stripe.promotionCodes.create).toHaveBeenCalledWith(
                expect.objectContaining({ promotion: { type: 'coupon', coupon: 'coup_1' }, code: 'SAVE10' }),
                { stripeAccount: 'acct_1' },
            );
            expect(result).toEqual({
                id: 'promo_1',
                code: 'SAVE10',
                active: true,
                max_redemptions: 5,
                times_redeemed: 1,
                coupon: 'coup_1',
                expires_at: 999,
                metadata: {},
                restrictions: {},
                created: 111,
            });
        });

        it('resolves coupon id whether promo.promotion.coupon is a string or an expanded object', async () => {
            stripe.promotionCodes.create.mockResolvedValue({ ...rawPromo, promotion: { type: 'coupon', coupon: 'coup_str' } });

            const result = await service.createPromotionCode(undefined, { coupon_id: 'coup_str', code: 'X' });

            expect(result.coupon).toBe('coup_str');
        });

        it('resolves an empty coupon id when promotion is missing/malformed', async () => {
            stripe.promotionCodes.create.mockResolvedValue({ ...rawPromo, promotion: null });

            const result = await service.createPromotionCode(undefined, { coupon_id: 'coup_1', code: 'X' });

            expect(result.coupon).toBe('');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.promotionCodes.create.mockRejectedValue(new Error('boom'));

            await expect(service.createPromotionCode(undefined, { coupon_id: 'coup_1', code: 'X' })).rejects.toThrow(
                'Failed to create Stripe promotion code: boom',
            );
        });
    });

    describe('getPromotionCode', () => {
        it('maps the retrieved promotion code', async () => {
            stripe.promotionCodes.retrieve.mockResolvedValue(rawPromo);

            const result = await service.getPromotionCode('promo_1', 'acct_1');

            expect(stripe.promotionCodes.retrieve).toHaveBeenCalledWith('promo_1', { stripeAccount: 'acct_1' });
            expect(result.id).toBe('promo_1');
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.promotionCodes.retrieve.mockRejectedValue(new Error('boom'));

            await expect(service.getPromotionCode('promo_1')).rejects.toThrow('Failed to retrieve promotion code: boom');
        });
    });

    describe('getPromotionCodes', () => {
        it('lists and maps promotion codes with filters', async () => {
            stripe.promotionCodes.list.mockResolvedValue({ data: [rawPromo] });

            const result = await service.getPromotionCodes('acct_1', { active: true, coupon: 'coup_1' });

            expect(stripe.promotionCodes.list).toHaveBeenCalledWith({ active: true, coupon: 'coup_1' }, { stripeAccount: 'acct_1' });
            expect(result).toHaveLength(1);
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.promotionCodes.list.mockRejectedValue(new Error('boom'));

            await expect(service.getPromotionCodes()).rejects.toThrow('Failed to list promotion codes: boom');
        });
    });

    describe('updatePromotionCode', () => {
        it('updates active/metadata/restrictions', async () => {
            stripe.promotionCodes.update.mockResolvedValue(rawPromo);

            await service.updatePromotionCode('promo_1', { active: false }, 'acct_1');

            expect(stripe.promotionCodes.update).toHaveBeenCalledWith(
                'promo_1',
                { active: false, metadata: undefined, restrictions: undefined },
                { stripeAccount: 'acct_1' },
            );
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.promotionCodes.update.mockRejectedValue(new Error('boom'));

            await expect(service.updatePromotionCode('promo_1', {})).rejects.toThrow('Failed to update promotion code: boom');
        });
    });

    describe('deactivatePromotionCode', () => {
        it('sets active to false', async () => {
            stripe.promotionCodes.update.mockResolvedValue(rawPromo);

            await service.deactivatePromotionCode('promo_1', 'acct_1');

            expect(stripe.promotionCodes.update).toHaveBeenCalledWith('promo_1', { active: false }, { stripeAccount: 'acct_1' });
        });

        it('wraps a Stripe failure in BadRequestException', async () => {
            stripe.promotionCodes.update.mockRejectedValue(new Error('boom'));

            await expect(service.deactivatePromotionCode('promo_1')).rejects.toThrow('Failed to deactivate promotion code: boom');
        });
    });
});
