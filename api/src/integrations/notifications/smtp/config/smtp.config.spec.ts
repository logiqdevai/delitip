import nodemailer from 'nodemailer';
import { SmtpConfig } from './smtp.config';

// nodemailer is a CJS module; depending on how this project's TS config resolves
// a default import at runtime, `nodemailer` here could bind to the mock's module.exports
// directly OR to its `.default`. Expose the same jest.fn() under both shapes so this
// spec's assertions and smtp.config.ts's own `import nodemailer from 'nodemailer'` are
// guaranteed to observe the same mock function no matter which shape wins.
jest.mock('nodemailer', () => {
    const createTransport = jest.fn();
    return { createTransport, default: { createTransport } };
});

const buildConfigService = (overrides: Record<string, any> = {}) => ({
    get: jest.fn((key: string) => overrides[key]),
});

describe('SmtpConfig', () => {
    const fakeTransporter = { sendMail: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
        (nodemailer.createTransport as jest.Mock).mockReturnValue(fakeTransporter);
    });

    describe('initialization', () => {
        it('leaves the transporter uninitialized when any required var is missing', () => {
            const config = new SmtpConfig(buildConfigService({ SMTP_HOST: 'smtp.example.com' }) as any);

            expect(nodemailer.createTransport).not.toHaveBeenCalled();
            expect(() => config.getTransporter()).toThrow('SMTP transporter is not initialized');
        });

        it('creates a transporter when host/port/user/password are all present', () => {
            const config = new SmtpConfig(
                buildConfigService({
                    SMTP_HOST: 'smtp.example.com',
                    SMTP_PORT: 587,
                    SMTP_USER: 'user',
                    SMTP_PASSWORD: 'pass',
                }) as any,
            );

            expect(nodemailer.createTransport).toHaveBeenCalledWith({
                host: 'smtp.example.com',
                port: 587,
                secure: false,
                auth: { user: 'user', pass: 'pass' },
            });
            expect(config.getTransporter()).toBe(fakeTransporter);
        });

        it('sets secure: true only when SMTP_SECURE is the literal string "true"', () => {
            new SmtpConfig(
                buildConfigService({
                    SMTP_HOST: 'h',
                    SMTP_PORT: 587,
                    SMTP_USER: 'u',
                    SMTP_PASSWORD: 'p',
                    SMTP_SECURE: 'true',
                }) as any,
            );

            expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({ secure: true }));
        });
    });

    describe('getDefaultFrom', () => {
        it('wraps the address with the from name when both are configured', () => {
            const config = new SmtpConfig(
                buildConfigService({ SMTP_FROM: 'noreply@x.com', SMTP_FROM_NAME: 'Delitip' }) as any,
            );

            expect(config.getDefaultFrom()).toBe('"Delitip" <noreply@x.com>');
        });

        it('returns the bare address when there is no from name', () => {
            const config = new SmtpConfig(buildConfigService({ SMTP_FROM: 'noreply@x.com' }) as any);

            expect(config.getDefaultFrom()).toBe('noreply@x.com');
        });

        it('falls back to SMTP_USER when SMTP_FROM is not set', () => {
            const config = new SmtpConfig(buildConfigService({ SMTP_USER: 'user@x.com' }) as any);

            expect(config.getDefaultFrom()).toBe('user@x.com');
        });

        it('throws when neither SMTP_FROM nor SMTP_USER is configured', () => {
            const config = new SmtpConfig(buildConfigService({}) as any);

            expect(() => config.getDefaultFrom()).toThrow('SMTP_FROM or SMTP_USER is not configured');
        });
    });
});
