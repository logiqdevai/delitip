import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CreateJwtServiceModule } from './jwt.module';
import { CreateJwtService } from './jwt.service';

describe('CreateJwtServiceModule', () => {
    it('compiles and resolves CreateJwtService', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), CreateJwtServiceModule],
        }).compile();

        expect(moduleRef).toBeDefined();
        expect(moduleRef.get(CreateJwtService)).toBeInstanceOf(CreateJwtService);

        await moduleRef.close();
    });
});
