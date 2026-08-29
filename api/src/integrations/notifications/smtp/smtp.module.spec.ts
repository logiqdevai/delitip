import { Test, TestingModule } from '@nestjs/testing';
import { SmtpModule } from './smtp.module';
import { SmtpMailService } from './services/mail.service';
import { SmtpConfig } from './config/smtp.config';
import { SmtpAdapter } from './smtp/smtp.adapter';

describe('SmtpModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [SmtpModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve SmtpMailService', () => {
        expect(module.get(SmtpMailService)).toBeInstanceOf(SmtpMailService);
    });

    it('should resolve SmtpConfig', () => {
        expect(module.get(SmtpConfig)).toBeInstanceOf(SmtpConfig);
    });

    it('should resolve SmtpAdapter', () => {
        expect(module.get(SmtpAdapter)).toBeInstanceOf(SmtpAdapter);
    });
});
