import { Test, TestingModule } from '@nestjs/testing';
import { GcsIntegrationModule } from './gcs.module';
import { GcsService } from './services/gcs.service';
import { GcsAdapter } from './gcs.adapter';
import { GcsConfig } from './config/gcs.config';

describe('GcsIntegrationModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [GcsIntegrationModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve GcsService', () => {
        expect(module.get(GcsService)).toBeInstanceOf(GcsService);
    });

    it('should resolve GcsAdapter', () => {
        expect(module.get(GcsAdapter)).toBeInstanceOf(GcsAdapter);
    });

    it('should resolve GcsConfig', () => {
        expect(module.get(GcsConfig)).toBeInstanceOf(GcsConfig);
    });
});
