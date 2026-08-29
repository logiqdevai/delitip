import { HealthController } from './health.controller';
import { HealthCheckStatus, HealthServiceName } from './interfaces/health.interface';

const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('HealthController', () => {
    let controller: HealthController;
    let healthService: any;

    beforeEach(() => {
        healthService = { check: jest.fn() };
        controller = new HealthController(healthService);
    });

    it('returns 200 for a healthy service-specific check', async () => {
        const result = { service: HealthServiceName.POSTGRES, status: HealthCheckStatus.OK, timestamp: 't', ms: 3 };
        healthService.check.mockResolvedValue(result);
        const res = mockResponse();

        await controller.getHealth({ postgres: true, redis: false } as any, res);

        expect(healthService.check).toHaveBeenCalledWith({ postgres: true, redis: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(result);
    });

    it('returns 503 when a non-api service is down', async () => {
        const result = { service: HealthServiceName.REDIS, status: HealthCheckStatus.DOWN, timestamp: 't' };
        healthService.check.mockResolvedValue(result);
        const res = mockResponse();

        await controller.getHealth({ postgres: false, redis: true } as any, res);

        expect(res.status).toHaveBeenCalledWith(503);
        expect(res.json).toHaveBeenCalledWith(result);
    });

    it('returns 200 when a non-api service is only NOT_CONFIGURED (not DOWN)', async () => {
        const result = { service: HealthServiceName.REDIS, status: HealthCheckStatus.NOT_CONFIGURED, timestamp: 't' };
        healthService.check.mockResolvedValue(result);
        const res = mockResponse();

        await controller.getHealth({ postgres: false, redis: true } as any, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('always returns 200 for the api service, even if status were somehow "down"', async () => {
        const result = { service: HealthServiceName.API, status: HealthCheckStatus.DOWN, timestamp: 't' } as any;
        healthService.check.mockResolvedValue(result);
        const res = mockResponse();

        await controller.getHealth({ postgres: false, redis: false } as any, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });
});
