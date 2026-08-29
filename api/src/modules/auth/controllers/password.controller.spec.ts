import { PasswordController } from './password.controller';

describe('PasswordController', () => {
    let controller: PasswordController;
    let passwordService: any;

    beforeEach(() => {
        passwordService = {
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
        };
        controller = new PasswordController(passwordService);
    });

    it('forgotPassword delegates to the service and returns its result', async () => {
        const dto = { email: 'a@b.com' } as any;
        passwordService.forgotPassword.mockResolvedValue({ message: 'ok' });

        await expect(controller.forgotPassword(dto)).resolves.toEqual({ message: 'ok' });
        expect(passwordService.forgotPassword).toHaveBeenCalledWith(dto);
    });

    it('resetPassword delegates to the service and returns its result', async () => {
        const dto = { token: 't1', password: 'newpass' } as any;
        passwordService.resetPassword.mockResolvedValue({ message: 'reset' });

        await expect(controller.resetPassword(dto)).resolves.toEqual({ message: 'reset' });
        expect(passwordService.resetPassword).toHaveBeenCalledWith(dto);
    });
});
