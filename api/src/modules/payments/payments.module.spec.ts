import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PaymentsModule } from './payments.module';
import { VivaWebhooksController } from './controllers/viva-webhooks.controller';
import { AdminPaymentsController } from './controllers/admin-payments.controller';
import { PaymentWebhooksService } from './services/payment-webhooks.service';
import { PaymentsReconciliationService } from './services/payments-reconciliation.service';

describe('PaymentsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [PaymentsModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .overrideProvider(ConfigService)
            .useValue({ get: () => undefined })
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve PaymentWebhooksService', () => {
        expect(module.get(PaymentWebhooksService)).toBeInstanceOf(PaymentWebhooksService);
    });

    it('should resolve PaymentsReconciliationService', () => {
        expect(module.get(PaymentsReconciliationService)).toBeInstanceOf(PaymentsReconciliationService);
    });

    it('should resolve VivaWebhooksController', () => {
        expect(module.get(VivaWebhooksController)).toBeInstanceOf(VivaWebhooksController);
    });

    it('should resolve AdminPaymentsController', () => {
        expect(module.get(AdminPaymentsController)).toBeInstanceOf(AdminPaymentsController);
    });
});
