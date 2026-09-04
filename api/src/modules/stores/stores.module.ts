import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { StoresController } from './stores.controller';
import { PublicStoresController } from './public-stores.controller';
import { AdminStoresController } from './admin-stores.controller';
import { StoresService } from './services/stores.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [StoresController, PublicStoresController, AdminStoresController],
    providers: [StoresService],
    exports: [StoresService],
})
export class StoresModule { }
