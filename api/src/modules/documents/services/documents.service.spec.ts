import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DocumentType } from 'generated/prisma';
import { GcsFolders } from '@/integrations/storage/gcs/config/gcs-folders.config';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
    let service: DocumentsService;
    let prisma: any;
    let gcsService: any;

    beforeEach(() => {
        prisma = {
            document: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), delete: jest.fn() },
        };
        gcsService = { uploadImageFromBuffer: jest.fn(), deleteImage: jest.fn() };
        service = new DocumentsService(prisma, gcsService);
    });

    describe('upload', () => {
        it('throws BadRequestException when no file is provided', async () => {
            await expect(service.upload('u1', null)).rejects.toThrow(BadRequestException);
            expect(gcsService.uploadImageFromBuffer).not.toHaveBeenCalled();
        });

        it('uploads the file to GCS and creates a Document row from the upload result, defaulting type to OTHER', async () => {
            const file = { buffer: Buffer.from('x'), originalname: 'photo.png', mimetype: 'image/png' };
            gcsService.uploadImageFromBuffer.mockResolvedValue({
                filename: '1700-photo.png',
                contentType: 'image/png',
                size: 123,
                url: 'https://cdn/photo.png',
                path: 'documents/1700-photo.png',
            });
            prisma.document.create.mockResolvedValue({ id: 'doc1' });

            const result = await service.upload('u1', file);

            expect(gcsService.uploadImageFromBuffer).toHaveBeenCalledWith(file.buffer, file.originalname, file.mimetype, GcsFolders.documents);
            expect(prisma.document.create).toHaveBeenCalledWith({
                data: {
                    user_uuid: 'u1',
                    filename: '1700-photo.png',
                    mimetype: 'image/png',
                    size: 123,
                    url: 'https://cdn/photo.png',
                    path: 'documents/1700-photo.png',
                    type: DocumentType.OTHER,
                },
            });
            expect(result).toEqual({ id: 'doc1' });
        });

        it('uses an explicit document type when provided', async () => {
            const file = { buffer: Buffer.from('x'), originalname: 'logo.png', mimetype: 'image/png' };
            gcsService.uploadImageFromBuffer.mockResolvedValue({
                filename: 'logo.png',
                contentType: 'image/png',
                size: 1,
                url: 'u',
                path: 'p',
            });
            prisma.document.create.mockResolvedValue({ id: 'doc1' });

            await service.upload('u1', file, DocumentType.LOGO);

            expect(prisma.document.create).toHaveBeenCalledWith(
                expect.objectContaining({ data: expect.objectContaining({ type: DocumentType.LOGO }) }),
            );
        });
    });

    describe('findOne', () => {
        it('throws NotFoundException when the document does not exist', async () => {
            prisma.document.findUnique.mockResolvedValue(null);

            await expect(service.findOne('doc1')).rejects.toThrow(NotFoundException);
        });

        it('returns the document when found', async () => {
            const document = { id: 'doc1' };
            prisma.document.findUnique.mockResolvedValue(document);

            await expect(service.findOne('doc1')).resolves.toBe(document);
        });
    });

    describe('findMine', () => {
        it('returns the current user\'s documents ordered by most recent first', async () => {
            prisma.document.findMany.mockResolvedValue([{ id: 'doc1' }]);

            const result = await service.findMine('u1');

            expect(prisma.document.findMany).toHaveBeenCalledWith({
                where: { user_uuid: 'u1' },
                orderBy: { created_at: 'desc' },
            });
            expect(result).toEqual([{ id: 'doc1' }]);
        });
    });

    describe('remove', () => {
        it('throws NotFoundException when the document does not exist', async () => {
            prisma.document.findUnique.mockResolvedValue(null);

            await expect(service.remove('doc1', 'u1')).rejects.toThrow(NotFoundException);
            expect(prisma.document.delete).not.toHaveBeenCalled();
        });

        it('throws ForbiddenException when the document belongs to a different user', async () => {
            prisma.document.findUnique.mockResolvedValue({ id: 'doc1', user_uuid: 'someone-else' });

            await expect(service.remove('doc1', 'u1')).rejects.toThrow(ForbiddenException);
            expect(prisma.document.delete).not.toHaveBeenCalled();
        });

        it('deletes the DB row and the GCS object, then returns success', async () => {
            prisma.document.findUnique.mockResolvedValue({ id: 'doc1', user_uuid: 'u1', filename: 'photo.png' });
            gcsService.deleteImage.mockResolvedValue({ success: true });

            const result = await service.remove('doc1', 'u1');

            expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: 'doc1' } });
            expect(gcsService.deleteImage).toHaveBeenCalledWith({ filename: 'photo.png', folder: GcsFolders.documents });
            expect(result).toEqual({ success: true });
        });

        it('still returns success even when the GCS delete fails (best-effort cleanup)', async () => {
            prisma.document.findUnique.mockResolvedValue({ id: 'doc1', user_uuid: 'u1', filename: 'photo.png' });
            gcsService.deleteImage.mockRejectedValue(new Error('gcs down'));

            await expect(service.remove('doc1', 'u1')).resolves.toEqual({ success: true });
        });
    });
});
