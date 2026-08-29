import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { DocumentsModule } from './documents.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './services/documents.service';

describe('DocumentsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [DocumentsModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve DocumentsService', () => {
        expect(module.get(DocumentsService)).toBeInstanceOf(DocumentsService);
    });

    it('should resolve DocumentsController', () => {
        expect(module.get(DocumentsController)).toBeInstanceOf(DocumentsController);
    });
});
