import { StoreAnalyticsController } from './store-analytics.controller';
import { AuthRole } from 'generated/prisma';

describe('StoreAnalyticsController', () => {
    let controller: StoreAnalyticsController;
    let storeAnalyticsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        storeAnalyticsService = { tips: jest.fn() };
        controller = new StoreAnalyticsController(storeAnalyticsService);
    });

    it('tips delegates to storeAnalyticsService.tips with user, storeId, query', async () => {
        const query = { group_by: 'employee' } as any;
        storeAnalyticsService.tips.mockResolvedValue({ data: [] });

        const result = await controller.tips(user, 'store1', query);

        expect(storeAnalyticsService.tips).toHaveBeenCalledWith(user, 'store1', query);
        expect(result).toEqual({ data: [] });
    });
});
