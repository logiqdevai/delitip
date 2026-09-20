import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { SettlementsController } from './controllers/settlements.controller';
import { SettlementsService } from './services/settlements.service';

@Module({
  imports: [PrismaModule, AccessControlModule],
  controllers: [SettlementsController],
  providers: [SettlementsService],
  exports: [SettlementsService],
})
export class SettlementsModule {}
