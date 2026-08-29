import { Reflector } from '@nestjs/core';
import { AuthRole } from 'generated/prisma';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: { getAllAndOverride: jest.Mock };

    const buildContext = (user?: any): any => ({
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({ getRequest: () => ({ user }) }),
    });

    beforeEach(() => {
        reflector = { getAllAndOverride: jest.fn() };
        guard = new RolesGuard(reflector as unknown as Reflector);
    });

    it('allows access when no roles metadata is set', async () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);

        await expect(guard.canActivate(buildContext({ role: AuthRole.USER }))).resolves.toBe(true);
    });

    it('allows access when the required roles list is empty', async () => {
        reflector.getAllAndOverride.mockReturnValue([]);

        await expect(guard.canActivate(buildContext({ role: AuthRole.USER }))).resolves.toBe(true);
    });

    it('denies access when there is no user on the request', async () => {
        reflector.getAllAndOverride.mockReturnValue([AuthRole.ADMIN]);

        await expect(guard.canActivate(buildContext(undefined))).resolves.toBe(false);
    });

    it('denies access when the user has no role', async () => {
        reflector.getAllAndOverride.mockReturnValue([AuthRole.ADMIN]);

        await expect(guard.canActivate(buildContext({ id: 'u1' }))).resolves.toBe(false);
    });

    it('always allows a SUPER_ADMIN regardless of the required roles', async () => {
        reflector.getAllAndOverride.mockReturnValue([AuthRole.ADMIN]);

        await expect(guard.canActivate(buildContext({ role: AuthRole.SUPER_ADMIN }))).resolves.toBe(true);
    });

    it('allows access when the user role is in the required roles', async () => {
        reflector.getAllAndOverride.mockReturnValue([AuthRole.ADMIN, AuthRole.SUPPORT]);

        await expect(guard.canActivate(buildContext({ role: AuthRole.SUPPORT }))).resolves.toBe(true);
    });

    it('denies access when the user role is not in the required roles', async () => {
        reflector.getAllAndOverride.mockReturnValue([AuthRole.ADMIN]);

        await expect(guard.canActivate(buildContext({ role: AuthRole.USER }))).resolves.toBe(false);
    });
});
