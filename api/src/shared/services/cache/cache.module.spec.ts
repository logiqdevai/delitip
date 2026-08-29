import { Test } from '@nestjs/testing';
import { AppCacheModule } from './cache.module';
import { CacheService } from './cache.service';

describe('AppCacheModule', () => {
    it('compiles and resolves CacheService', async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppCacheModule],
        }).compile();

        expect(moduleRef).toBeDefined();
        expect(moduleRef.get(CacheService)).toBeInstanceOf(CacheService);

        await moduleRef.close();
    });
});
