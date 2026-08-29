import { AuthRole } from 'generated/prisma';
import { ReviewTagsController } from './review-tags.controller';

describe('ReviewTagsController', () => {
    let controller: ReviewTagsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new ReviewTagsController(service);
    });

    it('create delegates with the current user, storeId param, and body', () => {
        const dto = { name: 'Friendly' } as any;
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

        expect(controller.update(user, 'store1', 't1', dto)).toBe('updated');
        expect(service.update).toHaveBeenCalledWith(user, 'store1', 't1', dto);
    });

    it('remove delegates with the current user, storeId param, and id param', () => {
        service.remove.mockReturnValue('removed');

        expect(controller.remove(user, 'store1', 't1')).toBe('removed');
        expect(service.remove).toHaveBeenCalledWith(user, 'store1', 't1');
    });
});
