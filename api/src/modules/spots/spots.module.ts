import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { SpotsController } from './spots.controller';
import { SpotsService } from './services/spots.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [SpotsController],
    providers: [SpotsService],
    exports: [SpotsService],
})
export class SpotsModule { }
