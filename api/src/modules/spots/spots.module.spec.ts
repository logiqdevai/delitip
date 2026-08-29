import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { SpotsModule } from './spots.module';
import { SpotsController } from './spots.controller';
import { SpotsService } from './services/spots.service';

describe('SpotsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [SpotsModule],
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

    it('should resolve SpotsService', () => {
        expect(module.get(SpotsService)).toBeInstanceOf(SpotsService);
    });

    it('should resolve SpotsController', () => {
        expect(module.get(SpotsController)).toBeInstanceOf(SpotsController);
    });
});
