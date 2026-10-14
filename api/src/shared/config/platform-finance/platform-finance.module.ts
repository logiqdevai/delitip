import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { PlatformFinanceConfig } from './platform-finance.config';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [PlatformFinanceConfig],
  exports: [PlatformFinanceConfig],
})
export class PlatformFinanceModule {}
