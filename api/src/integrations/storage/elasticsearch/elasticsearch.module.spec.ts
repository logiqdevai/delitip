import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchModule } from './elasticsearch.module';
import { ElasticsearchService } from './elasticsearch.service';
import { ELASTICSEARCH_CLIENT } from './elasticsearch.constants';

describe('ElasticsearchModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ElasticsearchModule],
        }).compile();
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(module).toBeDefined();
    });

    it('should resolve ElasticsearchService', () => {
        expect(module.get(ElasticsearchService)).toBeInstanceOf(ElasticsearchService);
    });

    it('should provide a null client when ELASTICSEARCH_URL is unset', () => {
        expect(module.get(ELASTICSEARCH_CLIENT)).toBeNull();
        expect(module.get(ElasticsearchService).enabled).toBe(false);
    });
});
