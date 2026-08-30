import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { GcsService } from '@/integrations/storage/gcs/services/gcs.service';
import { DocumentType } from 'generated/prisma';
import { GcsFolders } from '@/integrations/storage/gcs/config/gcs-folders.config';

@Injectable()
export class DocumentsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gcsService: GcsService,
    ) { }

    async upload(userId: string, file: any, type: DocumentType = DocumentType.OTHER) {
        if (!file) throw new BadRequestException('No file provided');

        const uploaded = await this.gcsService.uploadImageFromBuffer(
            file.buffer,
            file.originalname,
            file.mimetype,
            GcsFolders.documents,
        );

        return this.prisma.document.create({
            data: {
                user_uuid: userId,
                filename: uploaded.filename,
                mimetype: uploaded.contentType,
                size: uploaded.size,
                url: uploaded.url,
                path: uploaded.path,
                type,
            },
        });
    }

    async findOne(id: string) {
        const document = await this.prisma.document.findUnique({ where: { id } });
        if (!document) throw new NotFoundException('Document not found');
        return document;
    }

    async findMine(userId: string) {
        return this.prisma.document.findMany({
            where: { user_uuid: userId },
            orderBy: { created_at: 'desc' },
        });
    }

    async remove(id: string, userId: string) {
        const document = await this.findOne(id);
        if (document.user_uuid !== userId) {
            throw new ForbiddenException('You do not have access to this document');
        }

        return this.deleteDocumentAndStorage(document);
    }

    async removeById(id: string) {
        const document = await this.prisma.document.findUnique({ where: { id } });
        if (!document) return { success: true };

        return this.deleteDocumentAndStorage(document);
    }

    private async deleteDocumentAndStorage(document: { id: string; filename: string }) {
        await this.prisma.document.delete({ where: { id: document.id } });

        try {
            await this.gcsService.deleteImage({ filename: document.filename, folder: GcsFolders.documents });
        } catch { }

        return { success: true };
    }
}
