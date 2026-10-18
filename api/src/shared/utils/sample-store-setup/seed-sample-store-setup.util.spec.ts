import { StoreIndustry } from 'generated/prisma';
import { seedSampleStoreSetup } from './seed-sample-store-setup.util';

describe('seedSampleStoreSetup', () => {
    let prisma: any;

    beforeEach(() => {
        prisma = {
            distributionRule: { create: jest.fn() },
            distributionRuleRecipient: { createMany: jest.fn() },
            employee: { create: jest.fn() },
            spot: { create: jest.fn() },
            qrCode: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() },
            qrCodeSpot: { create: jest.fn() },
            qrCodeEmployee: { createMany: jest.fn() },
        };

        let ruleCount = 0;
        prisma.distributionRule.create.mockImplementation(({ data }: any) => {
            ruleCount += 1;
            return Promise.resolve({ id: `rule${ruleCount}`, ...data });
        });

        let employeeCount = 0;
        prisma.employee.create.mockImplementation(({ data }: any) => {
            employeeCount += 1;
            return Promise.resolve({ id: `emp${employeeCount}`, ...data });
        });

        let spotCount = 0;
        prisma.spot.create.mockImplementation(({ data }: any) => {
            spotCount += 1;
            return Promise.resolve({ id: `spot${spotCount}`, ...data });
        });

        let qrCodeCount = 0;
        prisma.qrCode.create.mockImplementation(({ data }: any) => {
            qrCodeCount += 1;
            return Promise.resolve({ id: `qr${qrCodeCount}`, ...data });
        });
    });

    it('creates a 100%-to-store, via-store default rule and returns its id', async () => {
        const result = await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT);

        expect(prisma.distributionRule.create).toHaveBeenCalledWith({
            data: { store_id: 'store1', name: 'Default Split', payout_mode: 'VIA_STORE' },
        });
        expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
            data: [{ distribution_rule_id: 'rule1', recipient_type: 'STORE', percentage: 100 }],
        });
        expect(result).toEqual({ distributionRuleId: 'rule1' });
    });

    it('creates two Greek example employees and a via-store 50/50 rule between them', async () => {
        await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT, { includeExampleEmployees: true });

        expect(prisma.employee.create).toHaveBeenCalledTimes(2);
        expect(prisma.employee.create).toHaveBeenCalledWith({
            data: expect.objectContaining({ store_id: 'store1', full_name: expect.objectContaining({ el: expect.any(String) }) }),
        });
        expect(prisma.distributionRule.create).toHaveBeenCalledWith({
            data: { store_id: 'store1', name: 'Team 50/50', payout_mode: 'VIA_STORE' },
        });
        expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
            data: [
                { distribution_rule_id: 'rule2', recipient_type: 'EMPLOYEE', employee_id: 'emp1', percentage: 50, sort_order: 0 },
                { distribution_rule_id: 'rule2', recipient_type: 'EMPLOYEE', employee_id: 'emp2', percentage: 50, sort_order: 1 },
            ],
        });
    });

    it('leaves the first QR code employee-less and gives the second the 50/50 rule and both employees', async () => {
        await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT, { includeExampleEmployees: true });

        const [first, second] = prisma.qrCode.create.mock.calls.map(([arg]: any) => arg.data);
        expect(first.distribution_rule_id).toBeUndefined();
        expect(second.distribution_rule_id).toBe('rule2');
        expect(prisma.qrCodeEmployee.createMany).toHaveBeenCalledTimes(1);
        expect(prisma.qrCodeEmployee.createMany).toHaveBeenCalledWith({
            data: [
                { qr_code_id: 'qr2', employee_id: 'emp1' },
                { qr_code_id: 'qr2', employee_id: 'emp2' },
            ],
        });
    });

    it('skips example employees and the 50/50 rule by default', async () => {
        await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT);

        expect(prisma.employee.create).not.toHaveBeenCalled();
        expect(prisma.distributionRule.create).toHaveBeenCalledTimes(1);
        expect(prisma.qrCodeEmployee.createMany).not.toHaveBeenCalled();
    });

    it('creates restaurant spots and links each sample QR code to its matching spot', async () => {
        await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT);

        expect(prisma.spot.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Table 01' } });
        expect(prisma.spot.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Counter' } });

        expect(prisma.qrCode.create).toHaveBeenCalledTimes(2);
        expect(prisma.qrCodeSpot.create).toHaveBeenCalledTimes(2);
        expect(prisma.qrCodeSpot.create).toHaveBeenCalledWith({ data: { qr_code_id: 'qr1', spot_id: 'spot1' } });
        expect(prisma.qrCodeSpot.create).toHaveBeenCalledWith({ data: { qr_code_id: 'qr2', spot_id: 'spot2' } });
    });

    it('creates hotel-specific spots for hotel stores', async () => {
        await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.HOTEL);

        expect(prisma.spot.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Room 01' } });
        expect(prisma.spot.create).toHaveBeenCalledWith({ data: { store_id: 'store1', name: 'Reception' } });
    });
});
