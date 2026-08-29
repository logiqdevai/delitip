import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { AlertPreferencesService } from '../services/alert-preferences.service';
import { UpdateAlertPreferenceDto } from '../dto/update-alert-preference.dto';

@ApiTags('Alert Preferences')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/alert-preferences')
export class AlertPreferencesController {
    constructor(private readonly alertPreferencesService: AlertPreferencesService) { }

    @Get()
    @ApiOperation({ summary: "List a Store's alert preferences, one row per AlertType (§21)" })
    findAll(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
        return this.alertPreferencesService.findAll(user, storeId);
    }

    @Patch(':alertType')
    @ApiOperation({ summary: 'Enable/disable one alert type for a Store (Owner/Store Manager)' })
    update(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('alertType') alertType: string,
        @Body() dto: UpdateAlertPreferenceDto,
    ) {
        return this.alertPreferencesService.update(user, storeId, alertType, dto.is_enabled);
    }
}
