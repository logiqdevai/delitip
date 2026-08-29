import { AuthRole, AlertType } from 'generated/prisma';
import { AlertPreferencesController } from './alert-preferences.controller';

describe('AlertPreferencesController', () => {
    let controller: AlertPreferencesController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { findAll: jest.fn(), update: jest.fn() };
        controller = new AlertPreferencesController(service);
    });

    it('delegates findAll to the service with user and storeId', () => {
        service.findAll.mockResolvedValue([]);

        controller.findAll(user, 'store1');

        expect(service.findAll).toHaveBeenCalledWith(user, 'store1');
    });

    it('delegates update to the service with user, storeId, alertType, and dto.is_enabled', () => {
        service.update.mockResolvedValue({ id: 'p1', is_enabled: false });

        controller.update(user, 'store1', AlertType.PERFORMANCE_CHANGE, { is_enabled: false });

        expect(service.update).toHaveBeenCalledWith(user, 'store1', AlertType.PERFORMANCE_CHANGE, false);
    });
});
