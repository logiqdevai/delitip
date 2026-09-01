import { AuthRole } from 'generated/prisma';
import { PayoutAccountsController } from './payout-accounts.controller';

describe('PayoutAccountsController', () => {
    let controller: PayoutAccountsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { createForStore: jest.fn(), findForStore: jest.fn(), updateForStore: jest.fn(), refreshStatusForStore: jest.fn() };
        controller = new PayoutAccountsController(service);
    });

    it('create() delegates to createForStore with the current user, storeId param, and body', () => {
        const dto = { provider: undefined };
        service.createForStore.mockReturnValue('created');

        expect(controller.create(user, 'store1', dto as any)).toBe('created');
        expect(service.createForStore).toHaveBeenCalledWith(user, 'store1', dto);
    });

    it('findOne() delegates to findForStore', () => {
        service.findForStore.mockReturnValue('found');

        expect(controller.findOne(user, 'store1')).toBe('found');
        expect(service.findForStore).toHaveBeenCalledWith(user, 'store1');
    });

    it('update() delegates to updateForStore with the body', () => {
        const dto = {};
        service.updateForStore.mockReturnValue('updated');

        expect(controller.update(user, 'store1', dto as any)).toBe('updated');
        expect(service.updateForStore).toHaveBeenCalledWith(user, 'store1', dto);
    });

    it('refreshStatus() delegates to refreshStatusForStore', () => {
        service.refreshStatusForStore.mockReturnValue('refreshed');

        expect(controller.refreshStatus(user, 'store1')).toBe('refreshed');
        expect(service.refreshStatusForStore).toHaveBeenCalledWith(user, 'store1');
    });
});
