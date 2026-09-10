import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { QrCodesService } from './qr-codes.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { QrCodesQuerySchema, QrCodesQueryType } from './dto/qr-codes-query.schema';

@ApiTags('QR Codes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class QrCodesController {
    constructor(private readonly qrCodesService: QrCodesService) { }

    @Post('stores/:storeId/qr-codes')
    @ApiOperation({ summary: 'Create a QR code for a Store (§9 — Owner/Store Manager only)' })
    create(@CurrentUser() user: AuthUser, @Param('storeId') storeId: string, @Body() dto: CreateQrCodeDto) {
        return this.qrCodesService.create(user, storeId, dto);
    }

    @Get('stores/:storeId/qr-codes')
    @ApiOperation({ summary: "List a Store's QR codes" })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'is_active', required: false })
    @ApiQuery({ name: 'employee_ids', required: false, description: 'Comma-separated employee IDs' })
    @ApiQuery({ name: 'spot_ids', required: false, description: 'Comma-separated spot IDs' })
    @ApiQuery({ name: 'distribution_rule_ids', required: false, description: 'Comma-separated distribution rule IDs' })
    findAllForStore(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Query(new ZodValidationPipe(QrCodesQuerySchema)) query: QrCodesQueryType,
    ) {
        return this.qrCodesService.findAllForStore(user, storeId, query);
    }

    @Get('qr-codes/:id')
    @ApiOperation({ summary: 'Get a QR code' })
    findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.qrCodesService.findOne(user, id);
    }

    @Patch('qr-codes/:id')
    @ApiOperation({ summary: 'Update a QR code (Owner/Store Manager only)' })
    update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateQrCodeDto) {
        return this.qrCodesService.update(user, id, dto);
    }

    @Delete('qr-codes/:id')
    @ApiOperation({ summary: 'Delete a QR code (Owner/Store Manager only)' })
    remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.qrCodesService.remove(user, id);
    }

    @Get('qr-codes/:id/stats')
    @ApiOperation({ summary: 'All-time tip/review stats for a QR code (§9)' })
    stats(@CurrentUser() user: AuthUser, @Param('id') id: string) {
        return this.qrCodesService.stats(user, id);
    }

    @Get('employees/:employeeId/qr-code')
    @ApiOperation({
        summary: "An Employee's personal QR code (assigned, no spots) — self or a store role",
    })
    findPersonalForEmployee(@CurrentUser() user: AuthUser, @Param('employeeId') employeeId: string) {
        return this.qrCodesService.findPersonalForEmployee(user, employeeId);
    }
}
