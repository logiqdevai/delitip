import { Test } from '@nestjs/testing';
import { TestingModule } from '@nestjs/testing';
import { AlertsModule } from './alerts.module';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AlertPreferencesService } from './services/alert-preferences.service';
import { AlertsService } from './services/alerts.service';
import { AlertPreferencesController } from './controllers/alert-preferences.controller';
import { AlertsController } from './controllers/alerts.controller';
import { AlertController } from './controllers/alert.controller';

describe('AlertsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AlertsModule],
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
        expect(module.get(AlertPreferencesService)).toBeInstanceOf(AlertPreferencesService);
        expect(module.get(AlertsService)).toBeInstanceOf(AlertsService);
    });

    it('should resolve controllers', () => {
        expect(module.get(AlertPreferencesController)).toBeInstanceOf(AlertPreferencesController);
        expect(module.get(AlertsController)).toBeInstanceOf(AlertsController);
        expect(module.get(AlertController)).toBeInstanceOf(AlertController);
    });
});
