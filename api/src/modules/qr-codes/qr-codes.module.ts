import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { QrCodesController } from './qr-codes.controller';
import { PublicQrController } from './public-qr.controller';
import { QrCodesService } from './qr-codes.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [QrCodesController, PublicQrController],
    providers: [QrCodesService],
    exports: [QrCodesService],
})
export class QrCodesModule { }
