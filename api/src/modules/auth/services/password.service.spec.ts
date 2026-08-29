import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import { EmailConfig } from '@/shared/constants/email';
import { PasswordService } from './password.service';

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
}));

describe('PasswordService', () => {
    let service: PasswordService;
    let prisma: any;
    let mailService: any;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = {
            user: { findUnique: jest.fn(), update: jest.fn() },
            passwordResetToken: { updateMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
            $transaction: jest.fn((ops: any[]) => Promise.all(ops)),
        };
        mailService = { sendEmail: jest.fn().mockResolvedValue(undefined) };
        service = new PasswordService(prisma, mailService);
    });

    describe('forgotPassword', () => {
        it('returns the generic message without touching the DB or mail when no user matches the email', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await service.forgotPassword({ email: 'nobody@example.com' } as any);

            expect(result).toEqual({ message: 'If an account with that email exists, a password reset link has been sent.' });
            expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
            expect(mailService.sendEmail).not.toHaveBeenCalled();
        });

        it('still sends a claim link when the user has no password set yet (e.g. an Employee shell added by a Store owner)', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: null });

            await service.forgotPassword({ email: 'a@b.com' } as any);
            await new Promise((resolve) => setImmediate(resolve));

            expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ user_uuid: 'u1' }) }),
            );
            expect(mailService.sendEmail).toHaveBeenCalled();
        });

        it('invalidates prior unused tokens, creates a new one, and fire-and-forget sends the reset email', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hashed' });

            await service.forgotPassword({ email: 'a@b.com' } as any);
            // let the setImmediate-scheduled mail send run
            await new Promise((resolve) => setImmediate(resolve));

            expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
                where: { user_uuid: 'u1', used_at: null },
                data: { used_at: expect.any(Date) },
            });
            expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
                data: {
                    token_hash: expect.stringMatching(/^[a-f0-9]{64}$/),
                    user_uuid: 'u1',
                    expires_at: expect.any(Date),
                },
            });
            expect(mailService.sendEmail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: 'a@b.com',
                    from: EmailConfig.email_addresses.alert,
                    subject: EmailConfig.templates.password_reset.subject,
                    template_id: EmailConfig.templates.password_reset.template_id,
                    dynamic_template_data: expect.objectContaining({ resetUrl: expect.any(String) }),
                }),
            );
        });

        it('does not propagate a mail-send failure (swallowed inside the fire-and-forget block)', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hashed' });
            mailService.sendEmail.mockRejectedValue(new Error('mail down'));

            await expect(service.forgotPassword({ email: 'a@b.com' } as any)).resolves.toBeDefined();
            await new Promise((resolve) => setImmediate(resolve));
            // no assertion needed beyond "didn't throw" — the rejection must not escape
        });
    });

    describe('resetPassword', () => {
        const tokenHash = createHash('sha256').update('plain-token').digest('hex');

        it('throws BadRequestException when no token record matches the hash', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue(null);

            await expect(service.resetPassword({ token: 'plain-token', password: 'newpass' } as any)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('throws BadRequestException when the token was already used', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 'rt1',
                token_hash: tokenHash,
                user_uuid: 'u1',
                used_at: new Date(),
                expires_at: new Date(Date.now() + 10000),
            });

            await expect(service.resetPassword({ token: 'plain-token', password: 'newpass' } as any)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('throws BadRequestException when the token has expired', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 'rt1',
                token_hash: tokenHash,
                user_uuid: 'u1',
                used_at: null,
                expires_at: new Date(Date.now() - 1000),
            });

            await expect(service.resetPassword({ token: 'plain-token', password: 'newpass' } as any)).rejects.toThrow(
                BadRequestException,
            );
        });

        it('hashes the new password, updates the user, marks the token used, and invalidates the user\'s other unused tokens — all in one transaction', async () => {
            prisma.passwordResetToken.findUnique.mockResolvedValue({
                id: 'rt1',
                token_hash: tokenHash,
                user_uuid: 'u1',
                used_at: null,
                expires_at: new Date(Date.now() + 10000),
            });
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');
            prisma.user.update.mockResolvedValue({});
            prisma.passwordResetToken.update.mockResolvedValue({});
            prisma.passwordResetToken.updateMany.mockResolvedValue({});

            const result = await service.resetPassword({ token: 'plain-token', password: 'newpass' } as any);

            expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
            expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data: { password: 'hashed-new-password' } });
            expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
                where: { id: 'rt1' },
                data: { used_at: expect.any(Date) },
            });
            expect(prisma.passwordResetToken.updateMany).toHaveBeenCalledWith({
                where: { user_uuid: 'u1', used_at: null, id: { not: 'rt1' } },
                data: { used_at: expect.any(Date) },
            });
            expect(prisma.$transaction).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Password has been reset successfully' });
        });
    });
});
