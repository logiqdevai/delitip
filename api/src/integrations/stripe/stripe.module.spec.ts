import { Test, TestingModule } from '@nestjs/testing';
import { StripeIntegrationModule } from './stripe.module';
import { StripeConfig } from './stripe.config';
import { StripeAccountsService } from './services/stripe-accounts..service';
import { StripeProductsService } from './services/stripe-products.service';
import { StripePaymentsService } from './services/stripe-payments.service';
import { StripePaymentsWebhooksService } from './services/stripe-payments-webhooks.service';
import { StripeCustomersService } from './services/stripe-customers.service';
import { StripeCouponsService } from './services/stripe-coupons.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';

describe('StripeIntegrationModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [StripeIntegrationModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve StripeConfig', () => {
        expect(module.get(StripeConfig)).toBeInstanceOf(StripeConfig);
    });

    it('should resolve StripeAccountsService', () => {
        expect(module.get(StripeAccountsService)).toBeInstanceOf(StripeAccountsService);
    });

    it('should resolve StripeProductsService', () => {
        expect(module.get(StripeProductsService)).toBeInstanceOf(StripeProductsService);
    });

    it('should resolve StripePaymentsService', () => {
        expect(module.get(StripePaymentsService)).toBeInstanceOf(StripePaymentsService);
    });

    it('should resolve StripePaymentsWebhooksService', () => {
        expect(module.get(StripePaymentsWebhooksService)).toBeInstanceOf(StripePaymentsWebhooksService);
    });

    it('should resolve StripeCustomersService', () => {
        expect(module.get(StripeCustomersService)).toBeInstanceOf(StripeCustomersService);
    });

    it('should resolve StripeCouponsService', () => {
        expect(module.get(StripeCouponsService)).toBeInstanceOf(StripeCouponsService);
    });
});
