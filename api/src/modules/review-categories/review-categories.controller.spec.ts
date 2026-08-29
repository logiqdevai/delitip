import { AuthRole } from 'generated/prisma';
import { ReviewCategoriesController } from './review-categories.controller';

describe('ReviewCategoriesController', () => {
    let controller: ReviewCategoriesController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new ReviewCategoriesController(service);
    });

    it('create delegates with the current user, storeId param, and body', () => {
        const dto = { name: 'Speed' } as any;
        service.create.mockReturnValue('created');

        expect(controller.create(user, 'store1', dto)).toBe('created');
        expect(service.create).toHaveBeenCalledWith(user, 'store1', dto);
    });

    it('findAll delegates with the current user, storeId param, and parsed query', () => {
        const query = { is_active: true } as any;
        service.findAll.mockReturnValue('list');

        expect(controller.findAll(user, 'store1', query)).toBe('list');
        expect(service.findAll).toHaveBeenCalledWith(user, 'store1', query);
    });

    it('update delegates with the current user, storeId param, id param, and body', () => {
        const dto = { name: 'New' } as any;
        service.update.mockReturnValue('updated');

        expect(controller.update(user, 'store1', 'c1', dto)).toBe('updated');
        expect(service.update).toHaveBeenCalledWith(user, 'store1', 'c1', dto);
    });

    it('remove delegates with the current user, storeId param, and id param', () => {
        service.remove.mockReturnValue('removed');

        expect(controller.remove(user, 'store1', 'c1')).toBe('removed');
        expect(service.remove).toHaveBeenCalledWith(user, 'store1', 'c1');
    });
});
