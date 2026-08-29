import { Test, TestingModule } from '@nestjs/testing';
import { InsightsModule } from './insights.module';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { InsightsService } from './insights.service';
import { InsightsController } from './insights.controller';

describe('InsightsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [InsightsModule],
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

    it('should resolve providers and controllers', () => {
        expect(module.get(InsightsService)).toBeInstanceOf(InsightsService);
        expect(module.get(InsightsController)).toBeInstanceOf(InsightsController);
    });
});
