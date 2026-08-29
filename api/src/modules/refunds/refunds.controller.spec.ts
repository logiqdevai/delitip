import { AuthRole } from 'generated/prisma';
import { RefundsController } from './refunds.controller';

describe('RefundsController', () => {
    let controller: RefundsController;
    let refundsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        refundsService = { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn() };
        controller = new RefundsController(refundsService);
    });

    it('create delegates to RefundsService.create with the current user and body', () => {
        const dto = { tip_id: 'tip1' } as any;
        refundsService.create.mockReturnValue('result');

        const result = controller.create(user, dto);

        expect(refundsService.create).toHaveBeenCalledWith(user, dto);
        expect(result).toBe('result');
    });

    it('findAll delegates to RefundsService.findAll with the current user, store id, and query', () => {
        const query = { page: 1, limit: 20 } as any;
        refundsService.findAll.mockReturnValue('result');

        const result = controller.findAll(user, 'store1', query);

        expect(refundsService.findAll).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBe('result');
    });

    it('findOne delegates to RefundsService.findOne with the current user and id', () => {
        refundsService.findOne.mockReturnValue('result');

        const result = controller.findOne(user, 'refund1');

        expect(refundsService.findOne).toHaveBeenCalledWith(user, 'refund1');
        expect(result).toBe('result');
    });

    it('update delegates to RefundsService.update with the current user, id, and body', () => {
        const dto = { status: 'APPROVED' } as any;
        refundsService.update.mockReturnValue('result');

        const result = controller.update(user, 'refund1', dto);

        expect(refundsService.update).toHaveBeenCalledWith(user, 'refund1', dto);
        expect(result).toBe('result');
    });
});
