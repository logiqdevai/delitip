import { InternalServerErrorException } from '@nestjs/common';
import { OtpService } from './otp.service';

describe('OtpService', () => {
    let service: OtpService;

    beforeEach(() => {
        service = new OtpService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('generates an OTP of the requested length', () => {
        const otp = service.generateOtp({ length: 6 });

        expect(otp).toHaveLength(6);
    });

    it('always returns an upper-cased string, even with lowercase letters enabled', () => {
        const otp = service.generateOtp({
            length: 10,
            digits: false,
            lowerCaseAlphabets: true,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        expect(otp).toBe(otp.toUpperCase());
        expect(otp).toHaveLength(10);
    });

    it('generates a purely numeric OTP when only digits are enabled', () => {
        const otp = service.generateOtp({
            length: 8,
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        expect(otp).toMatch(/^[0-9]{8}$/);
    });

    it('wraps a generator failure as InternalServerErrorException', () => {
        const otpGenerator = require('otp-generator');
        jest.spyOn(otpGenerator, 'generate').mockImplementation(() => {
            throw new Error('generator exploded');
        });

        expect(() => service.generateOtp({ length: 6 })).toThrow(InternalServerErrorException);
    });
});
