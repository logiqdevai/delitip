import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DocumentsService } from '@/modules/documents/services/documents.service';
import { EmployeesModule } from './employees.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './services/employees.service';

describe('EmployeesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

        module = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), EmployeesModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .overrideProvider(DocumentsService)
            .useValue({ removeById: jest.fn() })
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve EmployeesService', () => {
        expect(module.get(EmployeesService)).toBeInstanceOf(EmployeesService);
    });

    it('should resolve EmployeesController', () => {
        expect(module.get(EmployeesController)).toBeInstanceOf(EmployeesController);
    });
});
