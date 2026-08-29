import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { GoogleMapsModule } from './google-maps.module';
import { GoogleMapsService } from './google-maps.service';

describe('GoogleMapsModule', () => {
    it('compiles and resolves GoogleMapsService', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true }), GoogleMapsModule],
        }).compile();

        expect(moduleRef).toBeDefined();
        expect(moduleRef.get(GoogleMapsService)).toBeInstanceOf(GoogleMapsService);

        await moduleRef.close();
    });
});
