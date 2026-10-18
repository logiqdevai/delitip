import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { GcsIntegrationModule } from '@/integrations/storage/gcs/gcs.module';
import { VivaIntegrationModule } from '@/integrations/viva/viva.module';
import { UsersController } from './users.controller';
import { UsersService } from './services/users.service';

@Module({
    imports: [PrismaModule, GcsIntegrationModule, VivaIntegrationModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
