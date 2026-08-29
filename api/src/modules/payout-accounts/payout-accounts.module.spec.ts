import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { PayoutAccountsModule } from './payout-accounts.module';
import { PayoutAccountsController } from './payout-accounts.controller';
import { UserPayoutAccountController } from './user-payout-account.controller';
import { PayoutAccountsService } from './payout-accounts.service';

describe('PayoutAccountsModule', () => {
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [PayoutAccountsModule],
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

    it('should resolve PayoutAccountsService', () => {
        expect(module.get(PayoutAccountsService)).toBeInstanceOf(PayoutAccountsService);
    });

    it('should resolve PayoutAccountsController', () => {
        expect(module.get(PayoutAccountsController)).toBeInstanceOf(PayoutAccountsController);
    });

    it('should resolve UserPayoutAccountController', () => {
        expect(module.get(UserPayoutAccountController)).toBeInstanceOf(UserPayoutAccountController);
    });
});
