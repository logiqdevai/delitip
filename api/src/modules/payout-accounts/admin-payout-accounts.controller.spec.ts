import { AdminPayoutAccountsController } from './admin-payout-accounts.controller';

describe('AdminPayoutAccountsController', () => {
    let controller: AdminPayoutAccountsController;
    let service: any;

    beforeEach(() => {
        service = { sweepPendingAccounts: jest.fn() };
        controller = new AdminPayoutAccountsController(service);
    });

    it('reconcile() delegates to sweepPendingAccounts', () => {
        service.sweepPendingAccounts.mockReturnValue('swept');

        expect(controller.reconcile()).toBe('swept');
        expect(service.sweepPendingAccounts).toHaveBeenCalledWith();
    });
});
