import { Test, TestingModule } from '@nestjs/testing';
import { ResendModule } from './resend.module';
import { ResendMailService } from './services/mail.service';
import { ResendConfig } from './resend/resend.config';
import { ResendAdapter } from './resend/resend.adapter';
import { TemplateService } from './utils/templates.utils';

describe('ResendModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ResendModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve ResendMailService', () => {
        expect(module.get(ResendMailService)).toBeInstanceOf(ResendMailService);
    });

    it('should resolve ResendConfig', () => {
        expect(module.get(ResendConfig)).toBeInstanceOf(ResendConfig);
    });

    it('should resolve ResendAdapter', () => {
        expect(module.get(ResendAdapter)).toBeInstanceOf(ResendAdapter);
    });

    it('should resolve TemplateService', () => {
        expect(module.get(TemplateService)).toBeInstanceOf(TemplateService);
    });
});
