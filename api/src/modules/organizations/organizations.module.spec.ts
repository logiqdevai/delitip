import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { OrganizationsModule } from './organizations.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationMembersController } from './organization-members.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationMembersService } from './services/organization-members.service';

describe('OrganizationsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [OrganizationsModule],
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

    it('should resolve OrganizationsService', () => {
        expect(module.get(OrganizationsService)).toBeInstanceOf(OrganizationsService);
    });

    it('should resolve OrganizationMembersService', () => {
        expect(module.get(OrganizationMembersService)).toBeInstanceOf(OrganizationMembersService);
    });

    it('should resolve OrganizationsController', () => {
        expect(module.get(OrganizationsController)).toBeInstanceOf(OrganizationsController);
    });

    it('should resolve OrganizationMembersController', () => {
        expect(module.get(OrganizationMembersController)).toBeInstanceOf(OrganizationMembersController);
    });
});
