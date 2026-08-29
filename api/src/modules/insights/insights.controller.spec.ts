import { InsightsController } from './insights.controller';

describe('InsightsController', () => {
    let controller: InsightsController;
    let insightsService: any;

    const user = { id: 'u1', role: 'USER' } as any;

    beforeEach(() => {
        insightsService = { findAll: jest.fn(), generate: jest.fn() };
        controller = new InsightsController(insightsService);
    });

    it('findAll delegates to the service with the user, storeId, and parsed query', () => {
        const query = { page: 1, limit: 20 } as any;
        insightsService.findAll.mockReturnValue('result');

        const result = controller.findAll(user, 'store1', query);

        expect(insightsService.findAll).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toBe('result');
    });

    it('generate delegates to the service with the user, storeId, and body dto', () => {
        const dto = { period_start: '2026-01-01T00:00:00.000Z' } as any;
        insightsService.generate.mockReturnValue('generated');

        const result = controller.generate(user, 'store1', dto);

        expect(insightsService.generate).toHaveBeenCalledWith(user, 'store1', dto);
        expect(result).toBe('generated');
    });
});
