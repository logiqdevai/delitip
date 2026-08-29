import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsModule } from './analytics.module';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AnalyticsService } from './services/analytics.service';
import { StoreAnalyticsService } from './services/store-analytics.service';
import { AnalyticsController } from './controllers/analytics.controller';
import { StoreAnalyticsController } from './controllers/store-analytics.controller';

describe('AnalyticsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AnalyticsModule],
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
        expect(module.get(AnalyticsService)).toBeInstanceOf(AnalyticsService);
        expect(module.get(StoreAnalyticsService)).toBeInstanceOf(StoreAnalyticsService);
        expect(module.get(AnalyticsController)).toBeInstanceOf(AnalyticsController);
        expect(module.get(StoreAnalyticsController)).toBeInstanceOf(StoreAnalyticsController);
    });
});
