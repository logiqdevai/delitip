import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationMembersController } from './organization-members.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationMembersService } from './services/organization-members.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule],
    controllers: [OrganizationsController, OrganizationMembersController],
    providers: [OrganizationsService, OrganizationMembersService],
    exports: [OrganizationsService],
})
export class OrganizationsModule { }
