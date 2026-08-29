import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { HealthModule } from './health.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PostgresHealthChecker } from './checkers/postgres.health';
import { RedisHealthChecker } from './checkers/redis.health';

describe('HealthModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), HealthModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve HealthService', () => {
        expect(module.get(HealthService)).toBeInstanceOf(HealthService);
    });

    it('should resolve HealthController', () => {
        expect(module.get(HealthController)).toBeInstanceOf(HealthController);
    });

    it('should resolve PostgresHealthChecker', () => {
        expect(module.get(PostgresHealthChecker)).toBeInstanceOf(PostgresHealthChecker);
    });

    it('should resolve RedisHealthChecker', () => {
        expect(module.get(RedisHealthChecker)).toBeInstanceOf(RedisHealthChecker);
    });
});
