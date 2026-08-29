import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { DistributionRulesService } from './distribution-rules.service';
import { CreateDistributionRuleDto } from './dto/create-distribution-rule.dto';
import { UpdateDistributionRuleDto } from './dto/update-distribution-rule.dto';
import { SetDefaultDistributionRuleDto } from './dto/set-default-distribution-rule.dto';

@ApiTags('Distribution Rules')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class DistributionRulesController {
    constructor(private readonly distributionRulesService: DistributionRulesService) { }

    @Post('stores/:storeId/distribution-rules')
    @ApiOperation({ summary: 'Create a Distribution Rule for a Store (§5 — Owner/Store Manager only)' })
    create(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: CreateDistributionRuleDto,
    ) {
        return this.distributionRulesService.create(user, storeId, dto);
    }

    @Get('stores/:storeId/distribution-rules')
    @ApiOperation({ summary: "List a Store's Distribution Rules" })
    findAllForStore(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string) {
        return this.distributionRulesService.findAllForStore(user, storeId);
    }

    @Get('distribution-rules/:id')
    @ApiOperation({ summary: 'Get a Distribution Rule' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.distributionRulesService.findOne(user, id);
    }

    @Patch('distribution-rules/:id')
    @ApiOperation({ summary: 'Update a Distribution Rule (§5 — Owner/Store Manager only)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateDistributionRuleDto) {
        return this.distributionRulesService.update(user, id, dto);
    }

    @Delete('distribution-rules/:id')
    @ApiOperation({ summary: 'Delete a Distribution Rule (§5 — Owner/Store Manager only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.distributionRulesService.remove(user, id);
    }

    @Patch('stores/:storeId/default-distribution-rule')
    @ApiOperation({ summary: "Set or clear a Store's default Distribution Rule (Owner/Store Manager only)" })
    setDefault(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: SetDefaultDistributionRuleDto,
    ) {
        return this.distributionRulesService.setDefaultForStore(user, storeId, dto);
    }
}
