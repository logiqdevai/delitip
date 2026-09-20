import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { SettlementsModule } from './settlements.module';
import { SettlementsController } from './controllers/settlements.controller';
import { SettlementsService } from './services/settlements.service';

describe('SettlementsModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SettlementsModule],
    })
      .overrideProvider(PrismaService)
      .useValue({})
      .overrideProvider(ConfigService)
      .useValue({ get: () => undefined })
      .compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should resolve SettlementsService', () => {
    expect(module.get(SettlementsService)).toBeInstanceOf(SettlementsService);
  });

  it('should resolve SettlementsController', () => {
    expect(module.get(SettlementsController)).toBeInstanceOf(SettlementsController);
  });
});
