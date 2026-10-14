import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { RolesGuard } from '@/shared/guards/roles.guard';
import { Roles } from '@/shared/decorators/roles.decorator';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AppConfigService } from './app-config.service';
import { UpdateAppConfigDto } from './dto/update-app-config.dto';

@ApiTags('Admin — App Config')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin/app-config')
export class AppConfigController {
    constructor(private readonly appConfigService: AppConfigService) {}

    @Get()
    @ApiOperation({ summary: 'Get the platform-wide finance configuration' })
    get() {
        return this.appConfigService.get();
    }

    @Patch()
    @ApiOperation({ summary: 'Update the platform-wide finance configuration (applies to future tips only)' })
    update(@CurrentUser('id') userId: string, @Body() dto: UpdateAppConfigDto) {
        return this.appConfigService.update(userId, dto);
    }
}
