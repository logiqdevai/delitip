import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { AuthModule } from './auth.module';
import { EmailAuthController } from './controllers/email.controller';
import { PasswordController } from './controllers/password.controller';
import { EmailAuthService } from './services/email.service';
import { PasswordService } from './services/password.service';

describe('AuthModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

        module = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
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

    it('should resolve EmailAuthService', () => {
        expect(module.get(EmailAuthService)).toBeInstanceOf(EmailAuthService);
    });

    it('should resolve PasswordService', () => {
        expect(module.get(PasswordService)).toBeInstanceOf(PasswordService);
    });

    it('should resolve EmailAuthController', () => {
        expect(module.get(EmailAuthController)).toBeInstanceOf(EmailAuthController);
    });

    it('should resolve PasswordController', () => {
        expect(module.get(PasswordController)).toBeInstanceOf(PasswordController);
    });
});
