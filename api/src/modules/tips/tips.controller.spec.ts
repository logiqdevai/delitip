import { AuthRole } from 'generated/prisma';
import { TipsController } from './tips.controller';

describe('TipsController', () => {
    let controller: TipsController;
    let tipsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        tipsService = { findAll: jest.fn(), findOne: jest.fn() };
        controller = new TipsController(tipsService);
    });

    it('findAll delegates to TipsService.findAll with the current user, store id, and query', () => {
        const query = { page: 1, limit: 20 } as any;
        tipsService.findAll.mockReturnValue('result');

        const result = controller.findAll(user, 'store1', query);

        expect(tipsService.findAll).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBe('result');
    });

    it('findOne delegates to TipsService.findOne with the current user and id', () => {
        tipsService.findOne.mockReturnValue('result');

        const result = controller.findOne(user, 'tip1');

        expect(tipsService.findOne).toHaveBeenCalledWith(user, 'tip1');
        expect(result).toBe('result');
    });
});
