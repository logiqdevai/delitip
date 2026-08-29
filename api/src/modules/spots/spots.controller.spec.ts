import { AuthRole } from 'generated/prisma';
import { SpotsController } from './spots.controller';

describe('SpotsController', () => {
    let controller: SpotsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAllForStore: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new SpotsController(service);
    });

    it('create delegates to the service with the current user, storeId param, and body', async () => {
        const dto = { name: 'Table 1' } as any;
        service.create.mockResolvedValue('created');

        const result = await controller.create(user, 'store1', dto);

        expect(service.create).toHaveBeenCalledWith(user, 'store1', dto);
        expect(result).toBe('created');
    });

    it('findAllForStore delegates to the service with the current user, storeId param, and parsed query', async () => {
        const query = { page: 1, limit: 20 } as any;
        service.findAllForStore.mockResolvedValue('list');

        const result = await controller.findAllForStore(user, 'store1', query);

        expect(service.findAllForStore).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBe('list');
    });

    it('findOne delegates to the service with the current user and id param', async () => {
        service.findOne.mockResolvedValue('spot');

        const result = await controller.findOne(user, 'spot1');

        expect(service.findOne).toHaveBeenCalledWith(user, 'spot1');
        expect(result).toBe('spot');
    });

    it('update delegates to the service with the current user, id param, and body', async () => {
        const dto = { name: 'New name' } as any;
        service.update.mockResolvedValue('updated');

        const result = await controller.update(user, 'spot1', dto);

        expect(service.update).toHaveBeenCalledWith(user, 'spot1', dto);
        expect(result).toBe('updated');
    });

    it('remove delegates to the service with the current user and id param', async () => {
        service.remove.mockResolvedValue({ success: true });

        const result = await controller.remove(user, 'spot1');

        expect(service.remove).toHaveBeenCalledWith(user, 'spot1');
        expect(result).toEqual({ success: true });
    });
});
