import { AuthRole } from 'generated/prisma';
import { AlertController } from './alert.controller';

describe('AlertController', () => {
    let controller: AlertController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = { markRead: jest.fn() };
        controller = new AlertController(service);
    });

    it('delegates markRead to the service with user and id', () => {
        service.markRead.mockResolvedValue({ id: 'a1', is_read: true });

        controller.markRead(user, 'a1');

        expect(service.markRead).toHaveBeenCalledWith(user, 'a1');
    });
});
