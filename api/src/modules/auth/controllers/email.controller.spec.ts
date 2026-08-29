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

        // Previously wrapped in a try/catch with an empty catch body that was dead code (the call
        // wasn't `await`ed, so a rejection was returned as a still-rejected Promise regardless —
        // see api/TEST_COVERAGE_PLAN.md Findings). The try/catch has been removed as it did
        // nothing; behavior is unchanged.
        it('propagates a service rejection to the caller', async () => {
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
