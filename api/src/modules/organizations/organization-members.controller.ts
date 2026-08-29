import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { OrganizationMembersService } from './services/organization-members.service';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@ApiTags('Organization Members')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('organizations/:organizationId/members')
export class OrganizationMembersController {
    constructor(private readonly membersService: OrganizationMembersService) { }

    @Get()
    @ApiOperation({ summary: 'List an Organization\'s members (§26)' })
    findAll(@CurrentUser() user: AuthUser, @Param('organizationId') organizationId: string) {
        return this.membersService.findAll(user, organizationId);
    }

    @Post()
    @ApiOperation({ summary: 'Invite/add a member by email — creates a passive Account if they have none yet (§11)' })
    add(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Body() dto: AddMemberDto,
    ) {
        return this.membersService.add(user, organizationId, dto);
    }

    @Patch(':memberId')
    @ApiOperation({ summary: "Update a member's role or scope" })
    update(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Param('memberId') memberId: string,
        @Body() dto: UpdateMemberDto,
    ) {
        return this.membersService.update(user, organizationId, memberId, dto);
    }

    @Delete(':memberId')
    @ApiOperation({ summary: 'Remove a member' })
    remove(
        @CurrentUser() user: AuthUser,
        @Param('organizationId') organizationId: string,
        @Param('memberId') memberId: string,
    ) {
        return this.membersService.remove(user, organizationId, memberId);
    }
}
