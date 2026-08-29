import { Test, TestingModule } from '@nestjs/testing';
import { TwillioModule } from './twillio.module';
import { TwillioSmsService } from './services/sms.service';
import { CallsService } from './services/calls.service';
import { TwillioConfig } from './config/twilio.config';

describe('TwillioModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [TwillioModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve TwillioSmsService', () => {
        expect(module.get(TwillioSmsService)).toBeInstanceOf(TwillioSmsService);
    });

    it('should resolve CallsService', () => {
        expect(module.get(CallsService)).toBeInstanceOf(CallsService);
    });

    it('should resolve TwillioConfig', () => {
        expect(module.get(TwillioConfig)).toBeInstanceOf(TwillioConfig);
    });
});
