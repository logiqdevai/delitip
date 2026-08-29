import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { OrganizationsService } from './services/organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('organizations')
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create an Organization (optionally with its first Store) — §31 business setup' })
    create(@CurrentUser() user: AuthUser, @Body() dto: CreateOrganizationDto) {
        return this.organizationsService.create(user, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List Organizations the current user belongs to (§10)' })
    findMine(@CurrentUser() user: AuthUser) {
        return this.organizationsService.findMine(user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Organization' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.organizationsService.findOne(user, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an Organization (Owner only)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateOrganizationDto) {
        return this.organizationsService.update(user, id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Organization (Owner only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.organizationsService.remove(user, id);
    }
}
