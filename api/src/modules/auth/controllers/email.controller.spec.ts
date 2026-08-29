import { EmailAuthController } from './email.controller';

describe('EmailAuthController', () => {
    let controller: EmailAuthController;
    let authService: any;

    beforeEach(() => {
        authService = {
            registerWithEmail: jest.fn(),
            loginWithEmail: jest.fn(),
            waitlist: jest.fn(),
        };
        controller = new EmailAuthController(authService);
    });

    describe('registerWithEmail', () => {
        it('delegates to the service and returns its result', async () => {
            const dto = { email: 'a@b.com', password: 'x' } as any;
            authService.registerWithEmail.mockResolvedValue({ id: 'u1' });

            await expect(controller.registerWithEmail(dto)).resolves.toEqual({ id: 'u1' });
            expect(authService.registerWithEmail).toHaveBeenCalledWith(dto);
        });

        // The method wraps `return this.authService.registerWithEmail(dto)` in a try/catch with
        // an empty catch body — but since the call isn't `await`ed, a rejection is returned as a
        // still-rejected Promise, not caught. The empty catch is dead code: it never actually
        // runs for an async failure. See Findings.
        it('still propagates a service rejection to the caller — the empty catch block is dead code (see Findings)', async () => {
            const dto = { email: 'a@b.com', password: 'x' } as any;
            authService.registerWithEmail.mockRejectedValue(new Error('duplicate email'));

            await expect(controller.registerWithEmail(dto)).rejects.toThrow('duplicate email');
        });
    });

    describe('loginWithEmail', () => {
        it('delegates to the service and returns its result', async () => {
            const dto = { email: 'a@b.com', password: 'x' } as any;
            authService.loginWithEmail.mockResolvedValue({ token: 't' });

            await expect(controller.loginWithEmail(dto)).resolves.toEqual({ token: 't' });
            expect(authService.loginWithEmail).toHaveBeenCalledWith(dto);
        });
    });

    describe('waitlist', () => {
        it('delegates to the service and returns its result', async () => {
            const dto = { email: 'a@b.com', ref_code: 'r1' } as any;
            authService.waitlist.mockResolvedValue({ success: true });

            await expect(controller.waitlist(dto)).resolves.toEqual({ success: true });
            expect(authService.waitlist).toHaveBeenCalledWith(dto);
        });
    });
});
