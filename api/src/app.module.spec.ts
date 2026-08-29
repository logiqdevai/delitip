import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require('./app.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppController } = require('./app.controller');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppService } = require('./app.service');

describe('AppModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule],
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

    it('should resolve the root controller and service', () => {
        expect(module.get(AppController)).toBeInstanceOf(AppController);
        expect(module.get(AppService)).toBeInstanceOf(AppService);
    });
});
