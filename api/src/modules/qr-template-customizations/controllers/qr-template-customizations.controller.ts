import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthUser } from '@/shared/services/access-control/access-control.service';
import { ZodValidationPipe } from '@/shared/pipes/zod.validation.pipe';
import { QrTemplateCustomizationsService } from '../services/qr-template-customizations.service';
import {
    UpsertQrTemplateCustomizationSchema,
    type UpsertQrTemplateCustomizationType,
} from '../dto/qr-template-elements.schema';

@ApiTags('QR Template Customizations')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('stores/:storeId/qr-template-customizations')
export class QrTemplateCustomizationsController {
    constructor(private readonly qrTemplateCustomizationsService: QrTemplateCustomizationsService) { }

    @Get(':templateId')
    @ApiOperation({ summary: "Get a Store's saved customization for a QR template design, or null if none is saved" })
    findOne(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('templateId') templateId: string,
    ) {
        return this.qrTemplateCustomizationsService.findOne(user, storeId, templateId);
    }

    @Put(':templateId')
    @ApiOperation({
        summary: 'Save (create or replace) a Store\'s customization for a QR template design (Owner/Store Manager only)',
    })
    upsert(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('templateId') templateId: string,
        @Body(new ZodValidationPipe(UpsertQrTemplateCustomizationSchema)) body: UpsertQrTemplateCustomizationType,
    ) {
        return this.qrTemplateCustomizationsService.upsert(user, storeId, templateId, body);
    }

    @Delete(':templateId')
    @ApiOperation({ summary: 'Reset a QR template design back to its default (Owner/Store Manager only)' })
    remove(
        @CurrentUser() user: AuthUser,
        @Param('storeId') storeId: string,
        @Param('templateId') templateId: string,
    ) {
        return this.qrTemplateCustomizationsService.remove(user, storeId, templateId);
    }
}
