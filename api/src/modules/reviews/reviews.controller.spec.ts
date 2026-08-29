import { AuthRole } from 'generated/prisma';
import { ReviewsController } from './reviews.controller';

describe('ReviewsController', () => {
    let controller: ReviewsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            findAllForStore: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new ReviewsController(service);
    });

    it('findAllForStore delegates with the current user, storeId param, and parsed query', () => {
        const query = { page: 1, limit: 20 } as any;
        service.findAllForStore.mockReturnValue('result');

        expect(controller.findAllForStore(user, 'store1', query)).toBe('result');
        expect(service.findAllForStore).toHaveBeenCalledWith(user, 'store1', query);
    });

    it('findOne delegates with the current user and id param', () => {
        service.findOne.mockReturnValue('result');

        expect(controller.findOne(user, 'r1')).toBe('result');
        expect(service.findOne).toHaveBeenCalledWith(user, 'r1');
    });

    it('update delegates with the current user, id param, and body', () => {
        const dto = { visibility: undefined } as any;
        service.update.mockReturnValue('result');

        expect(controller.update(user, 'r1', dto)).toBe('result');
        expect(service.update).toHaveBeenCalledWith(user, 'r1', dto);
    });

    it('remove delegates with the current user and id param', () => {
        service.remove.mockReturnValue('result');

        expect(controller.remove(user, 'r1')).toBe('result');
        expect(service.remove).toHaveBeenCalledWith(user, 'r1');
    });
});
