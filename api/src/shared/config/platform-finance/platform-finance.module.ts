import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlatformFinanceConfig } from './platform-finance.config';

@Module({
  imports: [ConfigModule],
  providers: [PlatformFinanceConfig],
  exports: [PlatformFinanceConfig],
})
export class PlatformFinanceModule {}
