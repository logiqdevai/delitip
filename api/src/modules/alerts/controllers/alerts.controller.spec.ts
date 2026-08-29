import { AuthRole } from 'generated/prisma';
import { AlertsController } from './alerts.controller';

describe('AlertsController', () => {
    let controller: AlertsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { findAll: jest.fn(), markAllRead: jest.fn() };
        controller = new AlertsController(service);
    });

    it('delegates findAll to the service with user, storeId, and the parsed query', () => {
        const query = { page: 1, limit: 20 } as any;
        service.findAll.mockResolvedValue({ data: [], pagination: {} });

        controller.findAll(user, 'store1', query);

        expect(service.findAll).toHaveBeenCalledWith(user, 'store1', query);
    });

    it('delegates markAllRead to the service with user and storeId', () => {
        service.markAllRead.mockResolvedValue({ success: true, updated_count: 2 });

        controller.markAllRead(user, 'store1');

        expect(service.markAllRead).toHaveBeenCalledWith(user, 'store1');
    });
});
