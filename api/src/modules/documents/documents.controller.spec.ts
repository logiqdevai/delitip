import { DocumentType } from 'generated/prisma';
import { DocumentsController } from './documents.controller';

describe('DocumentsController', () => {
    let controller: DocumentsController;
    let documentsService: any;

    beforeEach(() => {
        documentsService = { upload: jest.fn(), findMine: jest.fn(), findOne: jest.fn(), remove: jest.fn() };
        controller = new DocumentsController(documentsService);
    });

    it('upload delegates to the service with the user id, the uploaded file, and the dto type', () => {
        const file = { buffer: Buffer.from('x') };
        documentsService.upload.mockReturnValue('uploaded');

        const result = controller.upload('u1', file, { type: DocumentType.LOGO } as any);

        expect(documentsService.upload).toHaveBeenCalledWith('u1', file, DocumentType.LOGO);
        expect(result).toBe('uploaded');
    });

    it('findMine delegates to the service with the current user id', () => {
        documentsService.findMine.mockReturnValue('mine');

        const result = controller.findMine('u1');

        expect(documentsService.findMine).toHaveBeenCalledWith('u1');
        expect(result).toBe('mine');
    });

    it('findOne delegates to the service with the document id', () => {
        documentsService.findOne.mockReturnValue('doc');

        const result = controller.findOne('doc1');

        expect(documentsService.findOne).toHaveBeenCalledWith('doc1');
        expect(result).toBe('doc');
    });

    it('remove delegates to the service with the document id and the current user id', () => {
        documentsService.remove.mockReturnValue('removed');

        const result = controller.remove('doc1', 'u1');

        expect(documentsService.remove).toHaveBeenCalledWith('doc1', 'u1');
        expect(result).toBe('removed');
    });
});
