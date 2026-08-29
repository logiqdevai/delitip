import { Test } from '@nestjs/testing';
import { AccessControlModule } from './access-control.module';
import { AccessControlService } from './access-control.service';
import { PrismaService } from '@/core/databases/prisma/prisma.service';

describe('AccessControlModule', () => {
    it('compiles and resolves AccessControlService', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AccessControlModule],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile();

        expect(moduleRef).toBeDefined();
        expect(moduleRef.get(AccessControlService)).toBeInstanceOf(AccessControlService);

        await moduleRef.close();
    });
});
