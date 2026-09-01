import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PayoutsModule } from './payouts.module';
import { PayoutsController } from './controllers/payouts.controller';
import { PayoutsService } from './services/payouts.service';

describe('PayoutsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [PayoutsModule],
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

    it('should resolve PayoutsService', () => {
        expect(module.get(PayoutsService)).toBeInstanceOf(PayoutsService);
    });

    it('should resolve PayoutsController', () => {
        expect(module.get(PayoutsController)).toBeInstanceOf(PayoutsController);
    });
});
