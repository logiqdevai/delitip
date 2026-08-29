import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { QrCodesModule } from './qr-codes.module';
import { QrCodesController } from './qr-codes.controller';
import { PublicQrController } from './public-qr.controller';
import { QrCodesService } from './qr-codes.service';

describe('QrCodesModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [QrCodesModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve QrCodesService', () => {
        expect(module.get(QrCodesService)).toBeInstanceOf(QrCodesService);
    });

    it('should resolve QrCodesController', () => {
        expect(module.get(QrCodesController)).toBeInstanceOf(QrCodesController);
    });

    it('should resolve PublicQrController', () => {
        expect(module.get(PublicQrController)).toBeInstanceOf(PublicQrController);
    });
});
