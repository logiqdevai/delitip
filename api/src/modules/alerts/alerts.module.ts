import { Module } from '@nestjs/common';
import { PrismaModule } from '@/core/databases/prisma/prisma.module';
import { AccessControlModule } from '@/shared/services/access-control/access-control.module';
import { AlertPreferencesController } from './controllers/alert-preferences.controller';
import { AlertsController } from './controllers/alerts.controller';
import { AlertController } from './controllers/alert.controller';
import { AlertPreferencesService } from './services/alert-preferences.service';
import { AlertsService } from './services/alerts.service';

@Module({
    imports: [PrismaModule, AccessControlModule],
    controllers: [AlertPreferencesController, AlertsController, AlertController],
    providers: [AlertPreferencesService, AlertsService],
    exports: [AlertPreferencesService, AlertsService],
})
export class AlertsModule { }
