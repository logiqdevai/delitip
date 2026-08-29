import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { TipsModule } from './tips.module';
import { TipsController } from './tips.controller';
import { PublicTipsController } from './public-tips.controller';
import { TipsService } from './services/tips.service';

describe('TipsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [TipsModule],
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

    it('should resolve TipsService', () => {
        expect(module.get(TipsService)).toBeInstanceOf(TipsService);
    });

    it('should resolve TipsController', () => {
        expect(module.get(TipsController)).toBeInstanceOf(TipsController);
    });

    it('should resolve PublicTipsController', () => {
        expect(module.get(PublicTipsController)).toBeInstanceOf(PublicTipsController);
    });
});
