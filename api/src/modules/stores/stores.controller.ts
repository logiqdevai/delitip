import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { StoresService } from './services/stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UpdateStoreTranslationDto } from './dto/update-store-translation.dto';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class StoresController {
    constructor(private readonly storesService: StoresService) { }

    @Post('organizations/:organizationId/stores')
    @ApiOperation({ summary: 'Create a Store under an Organization (Owner only)' })
    create(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Body() dto: CreateStoreDto,
    ) {
        return this.storesService.create(user, organizationId, dto);
    }

    @Get('organizations/:organizationId/stores')
    @ApiOperation({ summary: "List the Stores the current user can access in an Organization" })
    findAllForOrg(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string) {
        return this.storesService.findAllForOrg(user, organizationId);
    }

    @Get('stores/:id')
    @ApiOperation({ summary: 'Get a Store' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.storesService.findOne(user, id);
    }

    @Patch('stores/:id')
    @ApiOperation({ summary: 'Update a Store (Owner/Store Manager)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateStoreDto) {
        return this.storesService.update(user, id, dto);
    }

    @Patch('stores/:id/translations/:field')
    @ApiOperation({ summary: "Hand-edit a single language's translation of welcome_message/thank_you_message (§24)" })
    updateTranslation(
        @CurrentUser() user: AuthUser,
        @Param('id') id: string,
        @Param('field') field: string,
        @Body() dto: UpdateStoreTranslationDto,
    ) {
        return this.storesService.updateTranslation(user, id, field, dto);
    }

    @Delete('stores/:id')
    @ApiOperation({ summary: 'Delete a Store (Owner only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.storesService.remove(user, id);
    }
}
