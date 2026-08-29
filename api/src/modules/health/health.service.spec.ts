import { HealthCheckStatus, HealthServiceName } from './interfaces/health.interface';
import { HealthService } from './health.service';

describe('HealthService', () => {
    let service: HealthService;
    let postgresHealthChecker: any;
    let redisHealthChecker: any;

    beforeEach(() => {
        postgresHealthChecker = { check: jest.fn() };
        redisHealthChecker = { check: jest.fn() };
        service = new HealthService(postgresHealthChecker, redisHealthChecker);
    });

    it('returns the postgres result when query.postgres is true', async () => {
        postgresHealthChecker.check.mockResolvedValue({ status: HealthCheckStatus.OK, ms: 5 });

        const result = await service.check({ postgres: true, redis: false } as any);

        expect(result).toMatchObject({ service: HealthServiceName.POSTGRES, status: HealthCheckStatus.OK, ms: 5 });
        expect(result.timestamp).toEqual(expect.any(String));
        expect(redisHealthChecker.check).not.toHaveBeenCalled();
    });

    it('returns the redis result when query.redis is true', async () => {
        redisHealthChecker.check.mockResolvedValue({ status: HealthCheckStatus.DOWN, ms: 10, message: 'down' });

        const result = await service.check({ postgres: false, redis: true } as any);

        expect(result).toMatchObject({
            service: HealthServiceName.REDIS,
            status: HealthCheckStatus.DOWN,
            ms: 10,
            message: 'down',
        });
        expect(postgresHealthChecker.check).not.toHaveBeenCalled();
    });

    it('prefers postgres over redis when both flags are set', async () => {
        postgresHealthChecker.check.mockResolvedValue({ status: HealthCheckStatus.OK });

        const result = await service.check({ postgres: true, redis: true } as any);

        expect(result.service).toBe(HealthServiceName.POSTGRES);
        expect(redisHealthChecker.check).not.toHaveBeenCalled();
    });

    it('returns an API uptime response when neither flag is set', async () => {
        const result = await service.check({ postgres: false, redis: false } as any);

        expect(result).toMatchObject({ service: HealthServiceName.API, status: HealthCheckStatus.OK });
        expect((result as any).uptime_ms).toBeGreaterThanOrEqual(0);
        expect(postgresHealthChecker.check).not.toHaveBeenCalled();
        expect(redisHealthChecker.check).not.toHaveBeenCalled();
    });
});
