import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { QueuesModule } from './queues.module';
import { RedisModule } from '../databases/redis/redis.module';
import { REDIS_OPTIONS } from '../databases/redis/redis.constants';

describe('QueuesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [RedisModule, QueuesModule],
        })
            .overrideProvider(REDIS_OPTIONS)
            .useValue({ host: 'localhost', port: 6379 })
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module when REDIS_OPTIONS is available', () => {
        expect(module).toBeDefined();
    });

    it('should throw when REDIS_OPTIONS is null', async () => {
        await expect(
            Test.createTestingModule({
                imports: [RedisModule, QueuesModule],
            })
                .overrideProvider(REDIS_OPTIONS)
                .useValue(null)
                .compile(),
        ).rejects.toThrow('BULLMQ not initialized');
    });

    it('does not register any queues by itself', () => {
        expect(() => module.get(getQueueToken('non-existent-queue'))).toThrow();
    });
});
