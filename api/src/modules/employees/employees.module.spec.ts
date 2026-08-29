import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { EmployeesModule } from './employees.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './services/employees.service';

describe('EmployeesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [EmployeesModule],
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

    it('should resolve EmployeesService', () => {
        expect(module.get(EmployeesService)).toBeInstanceOf(EmployeesService);
    });

    it('should resolve EmployeesController', () => {
        expect(module.get(EmployeesController)).toBeInstanceOf(EmployeesController);
    });
});
