import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { QrTemplateCustomizationsController } from './controllers/qr-template-customizations.controller';
import { QrTemplateCustomizationsService } from './services/qr-template-customizations.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [QrTemplateCustomizationsController],
    providers: [QrTemplateCustomizationsService],
    exports: [QrTemplateCustomizationsService],
})
export class QrTemplateCustomizationsModule { }
