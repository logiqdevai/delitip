import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { SubscriptionsModule } from './subscriptions.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './services/subscriptions.service';

describe('SubscriptionsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [SubscriptionsModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve SubscriptionsService', () => {
        expect(module.get(SubscriptionsService)).toBeInstanceOf(SubscriptionsService);
    });

    it('should resolve SubscriptionsController', () => {
        expect(module.get(SubscriptionsController)).toBeInstanceOf(SubscriptionsController);
    });
});
