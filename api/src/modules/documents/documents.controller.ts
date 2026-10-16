import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@/shared/guards/jwt.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { DocumentsService } from './services/documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

// Generous ceiling for logos, photos and invoices alike; invoices are
// re-checked against the same figure when attached to a payout request.
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a document/image (logo, banner, photo, ...)' })
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_UPLOAD_SIZE_BYTES } }))
    upload(
        @CurrentUser('id') userId: string,
        @UploadedFile() file: any,
        @Body() dto: UploadDocumentDto,
    ) {
        return this.documentsService.upload(userId, file, dto.type);
    }

    @Get('me')
    @ApiOperation({ summary: 'List documents uploaded by the current user' })
    findMine(@CurrentUser('id') userId: string) {
        return this.documentsService.findMine(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a document by id' })
    findOne(@Param('id') id: string) {
        return this.documentsService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a document' })
    remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.documentsService.remove(id, userId);
    }
}
