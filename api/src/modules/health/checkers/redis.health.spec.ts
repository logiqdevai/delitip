import { HealthCheckStatus } from '../interfaces/health.interface';
import { RedisHealthChecker } from './redis.health';

const connectMock = jest.fn();
const pingMock = jest.fn();
const disconnectMock = jest.fn();

jest.mock('ioredis', () => {
    const mockRedis = jest.fn().mockImplementation(() => ({
        connect: connectMock,
        ping: pingMock,
        disconnect: disconnectMock,
    }));
    return { __esModule: true, default: mockRedis };
});

describe('RedisHealthChecker', () => {
    beforeEach(() => {
        connectMock.mockReset().mockResolvedValue(undefined);
        pingMock.mockReset().mockResolvedValue('PONG');
        disconnectMock.mockReset();
    });

    it('returns NOT_CONFIGURED without creating a client when redisOptions is null', async () => {
        const checker = new RedisHealthChecker(null);

        const result = await checker.check();

        expect(result).toEqual({ status: HealthCheckStatus.NOT_CONFIGURED, message: 'REDIS_URL is not set' });
        expect(connectMock).not.toHaveBeenCalled();
    });

    it('returns OK and disconnects the client when connect+ping succeed', async () => {
        const checker = new RedisHealthChecker({ host: 'localhost', port: 6379 } as any);

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.OK);
        expect(result.ms).toBeGreaterThanOrEqual(0);
        expect(connectMock).toHaveBeenCalled();
        expect(pingMock).toHaveBeenCalled();
        expect(disconnectMock).toHaveBeenCalled();
    });

    it('returns DOWN with the error message when connect fails, and still disconnects', async () => {
        connectMock.mockRejectedValue(new Error('ECONNREFUSED'));
        const checker = new RedisHealthChecker({ host: 'localhost', port: 6379 } as any);

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.DOWN);
        expect(result.message).toBe('ECONNREFUSED');
        expect(disconnectMock).toHaveBeenCalled();
    });

    it('returns DOWN with the error message when ping fails, and still disconnects', async () => {
        pingMock.mockRejectedValue(new Error('timeout'));
        const checker = new RedisHealthChecker({ host: 'localhost', port: 6379 } as any);

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.DOWN);
        expect(result.message).toBe('timeout');
        expect(disconnectMock).toHaveBeenCalled();
    });

    it('returns a generic DOWN message when a non-Error is thrown', async () => {
        connectMock.mockRejectedValue('boom');
        const checker = new RedisHealthChecker({ host: 'localhost', port: 6379 } as any);

        const result = await checker.check();

        expect(result.status).toBe(HealthCheckStatus.DOWN);
        expect(result.message).toBe('Redis health check failed');
    });
});
