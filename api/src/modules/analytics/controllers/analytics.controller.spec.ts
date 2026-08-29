import { AnalyticsController } from './analytics.controller';
import { AuthRole } from 'generated/prisma';

describe('AnalyticsController', () => {
    let controller: AnalyticsController;
    let analyticsService: any;

    const user = { id: 'u1', role: AuthRole.USER };

    beforeEach(() => {
        analyticsService = {
            overview: jest.fn(),
            trends: jest.fn(),
            employeesPerformance: jest.fn(),
            storesPerformance: jest.fn(),
            experienceScore: jest.fn(),
        };
        controller = new AnalyticsController(analyticsService);
    });

    it('overview delegates to analyticsService.overview with user, organizationId, query', async () => {
        const query = { period: '7d' } as any;
        analyticsService.overview.mockResolvedValue({ ok: true });

        const result = await controller.overview(user, 'org1', query);

        expect(analyticsService.overview).toHaveBeenCalledWith(user, 'org1', query);
        expect(result).toEqual({ ok: true });
    });

    it('trends delegates to analyticsService.trends with user, organizationId, query', async () => {
        const query = { metric: 'tips', period: '30d', group_by: 'day' } as any;
        analyticsService.trends.mockResolvedValue({ series: [] });

        const result = await controller.trends(user, 'org1', query);

        expect(analyticsService.trends).toHaveBeenCalledWith(user, 'org1', query);
        expect(result).toEqual({ series: [] });
    });

    it('employeesPerformance delegates to analyticsService.employeesPerformance with user, organizationId, query', async () => {
        const query = { period: 'today' } as any;
        analyticsService.employeesPerformance.mockResolvedValue([{ employee_id: 'e1' }]);

        const result = await controller.employeesPerformance(user, 'org1', query);

        expect(analyticsService.employeesPerformance).toHaveBeenCalledWith(user, 'org1', query);
        expect(result).toEqual([{ employee_id: 'e1' }]);
    });

    it('storesPerformance delegates to analyticsService.storesPerformance with user, organizationId, query', async () => {
        const query = { period: '30d' } as any;
        analyticsService.storesPerformance.mockResolvedValue([{ store_id: 's1' }]);

        const result = await controller.storesPerformance(user, 'org1', query);

        expect(analyticsService.storesPerformance).toHaveBeenCalledWith(user, 'org1', query);
        expect(result).toEqual([{ store_id: 's1' }]);
    });

    it('experienceScore delegates to analyticsService.experienceScore with user, organizationId, query', async () => {
        const query = { period: 'today' } as any;
        analyticsService.experienceScore.mockResolvedValue({ score: 87 });

        const result = await controller.experienceScore(user, 'org1', query);

        expect(analyticsService.experienceScore).toHaveBeenCalledWith(user, 'org1', query);
        expect(result).toEqual({ score: 87 });
    });
});
