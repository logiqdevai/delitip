import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

// NestConfigModule.forRoot(...) — and therefore validateEnv — runs eagerly as part
// of the @Module({ imports: [...] }) decorator, i.e. at module *import* time, not
// inside a test's beforeAll. So env vars must be set before `./env.module` is
// required.
describe('ConfigModule', () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    it('should compile and expose a validated ConfigService when required vars are set', async () => {
        process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
        process.env.JWT_SECRET = 'test-secret';
        process.env.NODE_ENV = 'test';

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { ConfigModule } = require('./env.module');
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
        }).compile();

        const configService = module.get(ConfigService);
        expect(configService).toBeDefined();
        expect(configService.get('DATABASE_URL')).toBe(
            'postgresql://user:pass@localhost:5432/test',
        );
        expect(configService.get('JWT_SECRET')).toBe('test-secret');

        await module.close();
    });
});
