import { Test, TestingModule } from '@nestjs/testing';
import { QrTemplateCustomizationsModule } from './qr-template-customizations.module';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { QrTemplateCustomizationsService } from './services/qr-template-customizations.service';
import { QrTemplateCustomizationsController } from './controllers/qr-template-customizations.controller';

describe('QrTemplateCustomizationsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [QrTemplateCustomizationsModule],
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

    it('should resolve providers', () => {
        expect(module.get(QrTemplateCustomizationsService)).toBeInstanceOf(QrTemplateCustomizationsService);
    });

    it('should resolve controllers', () => {
        expect(module.get(QrTemplateCustomizationsController)).toBeInstanceOf(QrTemplateCustomizationsController);
    });
});
