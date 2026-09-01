import { AuthRole } from 'generated/prisma';
import { UserPayoutAccountController } from './user-payout-account.controller';

describe('UserPayoutAccountController', () => {
    let controller: UserPayoutAccountController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { createForUser: jest.fn(), findForUser: jest.fn(), refreshStatusForUser: jest.fn() };
        controller = new UserPayoutAccountController(service);
    });

    it('create() delegates to createForUser with the current user and body', () => {
        const dto = {};
        service.createForUser.mockReturnValue('created');

        expect(controller.create(user, dto as any)).toBe('created');
        expect(service.createForUser).toHaveBeenCalledWith(user, dto);
    });

    it('findOne() delegates to findForUser with the current user', () => {
        service.findForUser.mockReturnValue('found');

        expect(controller.findOne(user)).toBe('found');
        expect(service.findForUser).toHaveBeenCalledWith(user);
    });

    it('refreshStatus() delegates to refreshStatusForUser with the current user', () => {
        service.refreshStatusForUser.mockReturnValue('refreshed');

        expect(controller.refreshStatus(user)).toBe('refreshed');
        expect(service.refreshStatusForUser).toHaveBeenCalledWith(user);
    });
});
