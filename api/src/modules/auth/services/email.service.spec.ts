import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRoles } from '../interfaces/auth.interface';
import { EmailConfig } from '@/shared/constants/email';
import { EmailAuthService } from './email.service';

jest.mock('bcrypt');

describe('EmailAuthService', () => {
    let service: EmailAuthService;
    let prisma: any;
    let jwtService: any;
    let mailService: any;

    beforeEach(() => {
        jest.clearAllMocks();
        prisma = { user: { findUnique: jest.fn(), create: jest.fn() } };
        jwtService = { signToken: jest.fn(), getExpirationTime: jest.fn() };
        mailService = { sendEmail: jest.fn() };
        service = new EmailAuthService(prisma, jwtService, mailService);
    });

    describe('registerWithEmail', () => {
        // The whole method body is wrapped in a single try/catch that rewraps
        // ANY thrown error — including its own ConflictException — as a
        // BadRequestException. Callers never actually see a 409 here.
        it('rewraps the duplicate-email conflict as a BadRequestException, not a ConflictException', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

            await expect(service.registerWithEmail({ email: 'a@b.com', password: 'secret1' }))
                .rejects.toThrow(BadRequestException);
            await expect(service.registerWithEmail({ email: 'a@b.com', password: 'secret1' }))
                .rejects.toThrow('User with this email already exists');
            expect(prisma.user.create).not.toHaveBeenCalled();
        });

        it('hashes the password, creates the user with the USER role, and returns a token with the password stripped', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            prisma.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hashed-password', role: AuthRoles.USER });
            jwtService.signToken.mockResolvedValue('signed-token');
            jwtService.getExpirationTime.mockReturnValue(3600);

            const result = await service.registerWithEmail({ email: 'a@b.com', password: 'secret1' });

            expect(bcrypt.hash).toHaveBeenCalledWith('secret1', 10);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: 'a@b.com', password: 'hashed-password', role: AuthRoles.USER },
            });
            expect(jwtService.signToken).toHaveBeenCalledWith({ id: 'u1', role: AuthRoles.USER });
            expect(result).toEqual({
                access_token: 'signed-token',
                expires_in: 3600,
                user: { id: 'u1', email: 'a@b.com', role: AuthRoles.USER },
            });
            expect((result.user as any).password).toBeUndefined();
        });

        it('rewraps any downstream failure (e.g. a DB error) as a BadRequestException too', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            prisma.user.create.mockRejectedValue(new Error('db exploded'));

            await expect(service.registerWithEmail({ email: 'a@b.com', password: 'secret1' }))
                .rejects.toThrow(BadRequestException);
        });
    });

    describe('loginWithEmail', () => {
        it('rewraps "user not found" as a BadRequestException, not an UnauthorizedException', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(service.loginWithEmail({ email: 'a@b.com', password: 'secret1' }))
                .rejects.toThrow(BadRequestException);
            await expect(service.loginWithEmail({ email: 'a@b.com', password: 'secret1' }))
                .rejects.toThrow('Invalid credentials');
        });

        it('rewraps a password mismatch as a BadRequestException too', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', password: 'hashed-password' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(service.loginWithEmail({ email: 'a@b.com', password: 'wrong' }))
                .rejects.toThrow('Invalid credentials');
        });

        it('returns a token with the password stripped on a successful login', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com', password: 'hashed-password', role: AuthRoles.USER });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            jwtService.signToken.mockResolvedValue('signed-token');
            jwtService.getExpirationTime.mockReturnValue(3600);

            const result = await service.loginWithEmail({ email: 'a@b.com', password: 'secret1' });

            expect(bcrypt.compare).toHaveBeenCalledWith('secret1', 'hashed-password');
            expect(result).toEqual({
                access_token: 'signed-token',
                expires_in: 3600,
                user: { id: 'u1', email: 'a@b.com', role: AuthRoles.USER },
            });
            expect((result.user as any).password).toBeUndefined();
        });
    });

    describe('waitlist', () => {
        it('short-circuits with an already-exists message without creating a user or sending an email', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'existing' });

            const result = await service.waitlist({ email: 'a@b.com' } as any);

            expect(result).toEqual({ message: 'You are already in the waitlist', code: 'WAITLIST_ALREADY_EXISTS' });
            expect(prisma.user.create).not.toHaveBeenCalled();
            expect(mailService.sendEmail).not.toHaveBeenCalled();
        });

        it('creates a waitlist user with an empty password and sends the waitlist email', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue({ id: 'u1' });
            mailService.sendEmail.mockResolvedValue(undefined);

            const result = await service.waitlist({ email: 'a@b.com' } as any);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: { email: 'a@b.com', password: '', role: AuthRoles.USER },
            });
            expect(mailService.sendEmail).toHaveBeenCalledWith({
                to: 'a@b.com',
                from: EmailConfig.email_addresses.alert,
                subject: EmailConfig.templates.waitlist.subject,
                template_id: EmailConfig.templates.waitlist.template_id,
            });
            expect(result).toEqual({ message: 'You have been successfully added to the waitlist', code: 'WAITLIST_SUCCESS' });
        });

        it('fails the whole request if the waitlist email fails to send (email is awaited, not fire-and-forget)', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            prisma.user.create.mockResolvedValue({ id: 'u1' });
            mailService.sendEmail.mockRejectedValue(new Error('resend down'));

            await expect(service.waitlist({ email: 'a@b.com' } as any)).rejects.toThrow(BadRequestException);
        });
    });
});
