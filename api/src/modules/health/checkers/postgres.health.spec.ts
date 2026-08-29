import { HealthCheckStatus } from '../interfaces/health.interface';
import { PostgresHealthChecker } from './postgres.health';

describe('PostgresHealthChecker', () => {
    let checker: PostgresHealthChecker;
    let configService: any;
    let prisma: any;

    beforeEach(() => {
        configService = { get: jest.fn() };
        prisma = { $queryRaw: jest.fn() };
        checker = new PostgresHealthChecker(configService, prisma);
    });

    it('returns NOT_CONFIGURED without querying when DATABASE_URL is unset', async () => {
        configService.get.mockReturnValue(undefined);

        const result = await checker.check();

        expect(result).toEqual({ status: HealthCheckStatus.NOT_CONFIGURED, message: 'DATABASE_URL is not set' });
        expect(prisma.$queryRaw).not.toHaveBeenCalled();
    });

    it('returns OK with a timing when the query succeeds', async () => {
        configService.get.mockReturnValue('postgresql://user:pass@localhost:5432/db');
        prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.OK);
        expect(result.ms).toBeGreaterThanOrEqual(0);
        expect(result.message).toBeUndefined();
    });

    it('returns DOWN with the error message when the query throws an Error', async () => {
        configService.get.mockReturnValue('postgresql://user:pass@localhost:5432/db');
        prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.DOWN);
        expect(result.message).toBe('connection refused');
        expect(result.ms).toBeGreaterThanOrEqual(0);
    });

    it('returns DOWN with a generic message when the query throws a non-Error', async () => {
        configService.get.mockReturnValue('postgresql://user:pass@localhost:5432/db');
        prisma.$queryRaw.mockRejectedValue('some string failure');

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.DOWN);
        expect(result.message).toBe('Postgres health check failed');
    });
});
