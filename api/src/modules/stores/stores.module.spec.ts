import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { StoresModule } from './stores.module';
import { StoresController } from './stores.controller';
import { PublicStoresController } from './public-stores.controller';
import { AdminStoresController } from './admin-stores.controller';
import { StoresService } from './services/stores.service';

describe('StoresModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [StoresModule],
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

    it('should resolve StoresService', () => {
        expect(module.get(StoresService)).toBeInstanceOf(StoresService);
    });

    it('should resolve StoresController', () => {
        expect(module.get(StoresController)).toBeInstanceOf(StoresController);
    });

    it('should resolve PublicStoresController', () => {
        expect(module.get(PublicStoresController)).toBeInstanceOf(PublicStoresController);
    });

    it('should resolve AdminStoresController', () => {
        expect(module.get(AdminStoresController)).toBeInstanceOf(AdminStoresController);
    });
});
