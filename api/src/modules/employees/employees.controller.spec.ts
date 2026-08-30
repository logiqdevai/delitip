import { AuthRole } from 'generated/prisma';
import { EmployeesController } from './employees.controller';

describe('EmployeesController', () => {
    let controller: EmployeesController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAllForStore: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            dashboard: jest.fn(),
            tips: jest.fn(),
            reviews: jest.fn(),
        };
        controller = new EmployeesController(service);
    });

    it('create delegates to the service with the current user, storeId param, and body', async () => {
        const dto = { full_name: 'Maria', email: 'm@example.com' } as any;
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
        service.findOne.mockResolvedValue('employee');

        await expect(controller.findOne(user, 'emp1')).resolves.toBe('employee');
        expect(service.findOne).toHaveBeenCalledWith(user, 'emp1');
    });

    it('update delegates to the service with the current user, id param, and body', async () => {
        const dto = { position: 'Manager' } as any;
        service.update.mockResolvedValue('updated');

        await expect(controller.update(user, 'emp1', dto)).resolves.toBe('updated');
        expect(service.update).toHaveBeenCalledWith(user, 'emp1', dto);
    });

    it('remove delegates to the service with the current user and id param', async () => {
        service.remove.mockResolvedValue({ success: true });

        await expect(controller.remove(user, 'emp1')).resolves.toEqual({ success: true });
        expect(service.remove).toHaveBeenCalledWith(user, 'emp1');
    });

    it('dashboard delegates to the service with the current user and id param', async () => {
        service.dashboard.mockResolvedValue('dashboard-data');

        await expect(controller.dashboard(user, 'emp1')).resolves.toBe('dashboard-data');
        expect(service.dashboard).toHaveBeenCalledWith(user, 'emp1');
    });

    it('tips delegates to the service with the current user, id param, and parsed query', async () => {
        const query = { page: 1, limit: 20 } as any;
        service.tips.mockResolvedValue('tips-list');

        await expect(controller.tips(user, 'emp1', query)).resolves.toBe('tips-list');
        expect(service.tips).toHaveBeenCalledWith(user, 'emp1', query);
    });

    it('reviews delegates to the service with the current user, id param, and parsed query', async () => {
        const query = { page: 1, limit: 20 } as any;
        service.reviews.mockResolvedValue('reviews-list');

        await expect(controller.reviews(user, 'emp1', query)).resolves.toBe('reviews-list');
        expect(service.reviews).toHaveBeenCalledWith(user, 'emp1', query);
    });
});
