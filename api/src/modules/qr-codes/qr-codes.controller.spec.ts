import { AuthRole } from 'generated/prisma';
import { QrCodesController } from './qr-codes.controller';

describe('QrCodesController', () => {
    let controller: QrCodesController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAllForStore: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            stats: jest.fn(),
        };
        controller = new QrCodesController(service);
    });

    it('create delegates to the service with the current user, storeId param, and body', async () => {
        const dto = { label: 'Table 1' } as any;
        service.create.mockResolvedValue('created');

        await expect(controller.create(user, 'store1', dto)).resolves.toBe('created');
        expect(service.create).toHaveBeenCalledWith(user, 'store1', dto);
    });

    it('findAllForStore delegates to the service with the current user, storeId param, and parsed query', async () => {
        const query = { page: 1, limit: 20 } as any;
        service.findAllForStore.mockResolvedValue('list');

        await expect(controller.findAllForStore(user, 'store1', query)).resolves.toBe('list');
        expect(service.findAllForStore).toHaveBeenCalledWith(user, 'store1', query);
    });

    it('findOne delegates to the service with the current user and id param', async () => {
        service.findOne.mockResolvedValue('qr-code');

        await expect(controller.findOne(user, 'qr1')).resolves.toBe('qr-code');
        expect(service.findOne).toHaveBeenCalledWith(user, 'qr1');
    });

    it('update delegates to the service with the current user, id param, and body', async () => {
        const dto = { label: 'New label' } as any;
        service.update.mockResolvedValue('updated');

        await expect(controller.update(user, 'qr1', dto)).resolves.toBe('updated');
        expect(service.update).toHaveBeenCalledWith(user, 'qr1', dto);
    });

    it('remove delegates to the service with the current user and id param', async () => {
        service.remove.mockResolvedValue({ success: true });

        await expect(controller.remove(user, 'qr1')).resolves.toEqual({ success: true });
        expect(service.remove).toHaveBeenCalledWith(user, 'qr1');
    });

    it('stats delegates to the service with the current user and id param', async () => {
        service.stats.mockResolvedValue('stats-data');

        await expect(controller.stats(user, 'qr1')).resolves.toBe('stats-data');
        expect(service.stats).toHaveBeenCalledWith(user, 'qr1');
    });
});
