import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { DocumentsModule } from '@/modules/documents/documents.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ResendModule } from '@/integrations/notifications/resend/resend.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './services/employees.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule, DocumentsModule, AuthModule, ResendModule],
    controllers: [EmployeesController],
    providers: [EmployeesService],
    exports: [EmployeesService],
})
export class EmployeesModule { }
