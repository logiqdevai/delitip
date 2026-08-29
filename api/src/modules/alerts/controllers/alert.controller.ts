import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { AlertsService } from '../services/alerts.service';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('alerts')
export class AlertController {
    constructor(private readonly alertsService: AlertsService) { }

    @Patch(':id/read')
    @ApiOperation({ summary: 'Mark a single alert as read' })
    markRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.alertsService.markRead(user, id);
    }
}
