import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';

describe('UsersModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [UsersModule],
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

    it('should resolve UsersService', () => {
        expect(module.get(UsersService)).toBeInstanceOf(UsersService);
    });

    it('should resolve UsersController', () => {
        expect(module.get(UsersController)).toBeInstanceOf(UsersController);
    });
});
