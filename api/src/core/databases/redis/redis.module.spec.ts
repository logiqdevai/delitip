import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from './redis.module';
import { REDIS_OPTIONS } from './redis.constants';

describe('RedisModule', () => {
    describe('without REDIS_URL set', () => {
        let module: TestingModule;
        const originalRedisUrl = process.env.REDIS_URL;

        beforeAll(async () => {
            delete process.env.REDIS_URL;

            module = await Test.createTestingModule({
                imports: [RedisModule],
            }).compile();
        });

        afterAll(async () => {
            if (originalRedisUrl !== undefined) {
                process.env.REDIS_URL = originalRedisUrl;
            }
            await module.close();
        });

        it('should compile the module', () => {
            expect(module).toBeDefined();
        });

        it('should resolve REDIS_OPTIONS as null when REDIS_URL is unset', () => {
            expect(module.get(REDIS_OPTIONS)).toBeNull();
        });
    });

    describe('with REDIS_URL set', () => {
        let module: TestingModule;
        const originalRedisUrl = process.env.REDIS_URL;

        beforeAll(async () => {
            process.env.REDIS_URL = 'redis://user:pass@localhost:6379';

            module = await Test.createTestingModule({
                imports: [RedisModule],
            }).compile();
        });

        afterAll(async () => {
            if (originalRedisUrl === undefined) {
                delete process.env.REDIS_URL;
            } else {
                process.env.REDIS_URL = originalRedisUrl;
            }
            await module.close();
        });

        it('should parse REDIS_URL into RedisOptions', () => {
            const options = module.get(REDIS_OPTIONS);
            expect(options).toEqual(
                expect.objectContaining({
                    host: 'localhost',
                    port: 6379,
                    username: 'user',
                    password: 'pass',
                }),
            );
        });
    });
});
