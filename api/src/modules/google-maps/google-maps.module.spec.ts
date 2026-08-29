import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { GoogleMapsModule } from './google-maps.module';
import { GoogleMapsService as GoogleMapsFeatureService } from './google-maps.service';
import { GoogleMapsController } from './google-maps.controller';
import { GoogleMapsService as GoogleMapsUtilService } from '@/shared/services/google-maps/google-maps.service';

describe('GoogleMapsModule (feature)', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), GoogleMapsModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should compile the module', () => {
        expect(module).toBeDefined();
    });

    it('should resolve providers and controllers', () => {
        expect(module.get(GoogleMapsFeatureService)).toBeInstanceOf(GoogleMapsFeatureService);
        expect(module.get(GoogleMapsController)).toBeInstanceOf(GoogleMapsController);
        expect(module.get(GoogleMapsUtilService)).toBeInstanceOf(GoogleMapsUtilService);
    });
});
