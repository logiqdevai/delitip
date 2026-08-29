import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { SpotsService } from './services/spots.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotsQuerySchema, SpotsQueryType } from './dto/spots-query.schema';

@ApiTags('Spots')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class SpotsController {
    constructor(private readonly spotsService: SpotsService) { }

    @Post('stores/:storeId/spots')
    @ApiOperation({ summary: 'Create a Spot for a Store (Owner/Store Manager)' })
    create(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Body() dto: CreateSpotDto,
    ) {
        return this.spotsService.create(user, storeId, dto);
    }

    @Get('stores/:storeId/spots')
    @ApiOperation({ summary: "List a Store's Spots" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'is_active', required: false })
    findAllForStore(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(SpotsQuerySchema)) query: SpotsQueryType,
    ) {
        return this.spotsService.findAllForStore(user, storeId, query);
    }

    @Get('spots/:id')
    @ApiOperation({ summary: 'Get a Spot' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.spotsService.findOne(user, id);
    }

    @Patch('spots/:id')
    @ApiOperation({ summary: 'Update a Spot (Owner/Store Manager)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateSpotDto) {
        return this.spotsService.update(user, id, dto);
    }

    @Delete('spots/:id')
    @ApiOperation({ summary: 'Delete a Spot (Owner/Store Manager)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.spotsService.remove(user, id);
    }
}
