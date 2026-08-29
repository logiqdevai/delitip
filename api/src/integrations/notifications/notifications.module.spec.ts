import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsIntegrationModule } from './notifications.module';
import { ResendMailService } from './resend/services/mail.service';
import { SmtpMailService } from './smtp/services/mail.service';
import { TwillioSmsService } from './twillio/services/sms.service';

describe('NotificationsIntegrationModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [NotificationsIntegrationModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve providers from ResendModule', () => {
        expect(module.get(ResendMailService)).toBeInstanceOf(ResendMailService);
    });

    it('should resolve providers from SmtpModule', () => {
        expect(module.get(SmtpMailService)).toBeInstanceOf(SmtpMailService);
    });

    it('should resolve providers from TwillioModule', () => {
        expect(module.get(TwillioSmsService)).toBeInstanceOf(TwillioSmsService);
    });
});
