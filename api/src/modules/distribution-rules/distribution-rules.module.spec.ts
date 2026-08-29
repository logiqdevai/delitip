import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DistributionRulesModule } from './distribution-rules.module';
import { DistributionRulesController } from './distribution-rules.controller';
import { DistributionRulesService } from './distribution-rules.service';

describe('DistributionRulesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DistributionRulesModule],
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

    it('should resolve DistributionRulesService', () => {
        expect(module.get(DistributionRulesService)).toBeInstanceOf(DistributionRulesService);
    });

    it('should resolve DistributionRulesController', () => {
        expect(module.get(DistributionRulesController)).toBeInstanceOf(DistributionRulesController);
    });
});
