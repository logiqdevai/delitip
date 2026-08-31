import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { RefundsModule } from './refunds.module';
import { RefundsController } from './refunds.controller';
import { PublicRefundsController } from './public-refunds.controller';
import { RefundsService } from './services/refunds.service';

describe('RefundsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RefundsModule],
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

    it('should resolve RefundsService', () => {
        expect(module.get(RefundsService)).toBeInstanceOf(RefundsService);
    });

    it('should resolve RefundsController', () => {
        expect(module.get(RefundsController)).toBeInstanceOf(RefundsController);
    });

    it('should resolve PublicRefundsController', () => {
        expect(module.get(PublicRefundsController)).toBeInstanceOf(PublicRefundsController);
    });
});
