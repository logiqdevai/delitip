import { Test, TestingModule } from '@nestjs/testing';
import { AiIntegrationModule } from './ai.module';
import { AiService } from './services/ai.service';
import { AiConfig } from './utils/ai.config';

describe('AiIntegrationModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AiIntegrationModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve AiService', () => {
        expect(module.get(AiService)).toBeInstanceOf(AiService);
    });

    it('should resolve AiConfig', () => {
        expect(module.get(AiConfig)).toBeInstanceOf(AiConfig);
    });
});
