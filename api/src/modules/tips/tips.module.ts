import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { UsersModule } from '@/modules/users/users.module';
import { TipsController } from './tips.controller';
import { PublicTipsController } from './public-tips.controller';
import { TipsService } from './services/tips.service';

@Module({
    imports: [PrismaModule, AccessControlModule, UsersModule],
    controllers: [TipsController, PublicTipsController],
    providers: [TipsService],
    exports: [TipsService],
})
export class TipsModule { }
