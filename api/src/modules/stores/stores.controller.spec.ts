import { AuthRole } from 'generated/prisma';
import { StoresController } from './stores.controller';

describe('StoresController', () => {
    let controller: StoresController;
    let storesService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        storesService = {
            create: jest.fn(),
            findAllForOrg: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updateTranslation: jest.fn(),
            remove: jest.fn(),
        };
        controller = new StoresController(storesService);
    });

    it('create delegates to the service with the user, org id, and dto', async () => {
        const dto = { name: 'Diner' } as any;
        storesService.create.mockResolvedValue({ id: 's1' });

        await expect(controller.create(user, 'org1', dto)).resolves.toEqual({ id: 's1' });
        expect(storesService.create).toHaveBeenCalledWith(user, 'org1', dto);
    });

    it('findAllForOrg delegates to the service with the user and org id', async () => {
        storesService.findAllForOrg.mockResolvedValue([{ id: 's1' }]);

        await expect(controller.findAllForOrg(user, 'org1')).resolves.toEqual([{ id: 's1' }]);
        expect(storesService.findAllForOrg).toHaveBeenCalledWith(user, 'org1');
    });

    it('findOne delegates to the service with the user and store id', async () => {
        storesService.findOne.mockResolvedValue({ id: 's1' });

        await expect(controller.findOne(user, 's1')).resolves.toEqual({ id: 's1' });
        expect(storesService.findOne).toHaveBeenCalledWith(user, 's1');
    });

    it('update delegates to the service with the user, store id, and dto', async () => {
        const dto = { name: 'New name' } as any;
        storesService.update.mockResolvedValue({ id: 's1' });

        await expect(controller.update(user, 's1', dto)).resolves.toEqual({ id: 's1' });
        expect(storesService.update).toHaveBeenCalledWith(user, 's1', dto);
    });

    it('updateTranslation delegates to the service with the user, store id, field, and dto', async () => {
        const dto = { language: 'EN', text: 'Hi' } as any;
        storesService.updateTranslation.mockResolvedValue({ id: 's1' });

        await expect(controller.updateTranslation(user, 's1', 'welcome_message', dto)).resolves.toEqual({ id: 's1' });
        expect(storesService.updateTranslation).toHaveBeenCalledWith(user, 's1', 'welcome_message', dto);
    });

    it('remove delegates to the service with the user and store id', async () => {
        storesService.remove.mockResolvedValue({ success: true });

        await expect(controller.remove(user, 's1')).resolves.toEqual({ success: true });
        expect(storesService.remove).toHaveBeenCalledWith(user, 's1');
    });
});
