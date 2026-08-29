import { AuthRole } from 'generated/prisma';
import { FeedbackQuestionsController } from './feedback-questions.controller';

describe('FeedbackQuestionsController', () => {
    let controller: FeedbackQuestionsController;
    let service: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        service = {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };
        controller = new FeedbackQuestionsController(service);
    });

    it('delegates create to the service with user, storeId, and dto', () => {
        const dto = { question: 'How was the food?' } as any;
        service.create.mockResolvedValue({ id: 'q1' });

        const result = controller.create(user, 'store1', dto);

        expect(service.create).toHaveBeenCalledWith(user, 'store1', dto);
        expect(result).resolves.toEqual({ id: 'q1' });
    });

    it('delegates findAll to the service with user, storeId, and the parsed query', () => {
        const query = { is_active: true } as any;
        service.findAll.mockResolvedValue([{ id: 'q1' }]);

        controller.findAll(user, 'store1', query);

        expect(service.findAll).toHaveBeenCalledWith(user, 'store1', query);
    });

    it('delegates update to the service with user, storeId, id, and dto', () => {
        const dto = { is_active: false } as any;
        service.update.mockResolvedValue({ id: 'q1', is_active: false });

        controller.update(user, 'store1', 'q1', dto);

        expect(service.update).toHaveBeenCalledWith(user, 'store1', 'q1', dto);
    });

    it('delegates remove to the service with user, storeId, and id', () => {
        service.remove.mockResolvedValue({ success: true });

        controller.remove(user, 'store1', 'q1');

        expect(service.remove).toHaveBeenCalledWith(user, 'store1', 'q1');
    });
});
