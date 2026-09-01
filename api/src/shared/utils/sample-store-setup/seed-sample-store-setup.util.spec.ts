import { StoreIndustry } from 'generated/prisma';
import { seedSampleStoreSetup } from './seed-sample-store-setup.util';

describe('seedSampleStoreSetup', () => {
    let prisma: any;

    beforeEach(() => {
        prisma = {
            distributionRule: { create: jest.fn().mockResolvedValue({ id: 'rule1' }) },
            distributionRuleRecipient: { createMany: jest.fn() },
            spot: { create: jest.fn() },
            qrCode: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() },
            qrCodeSpot: { create: jest.fn() },
        };

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

    it('creates a 100%-to-store distribution rule and returns its id', async () => {
        const result = await seedSampleStoreSetup(prisma, 'store1', StoreIndustry.RESTAURANT);

        expect(prisma.distributionRule.create).toHaveBeenCalledWith({
            data: { store_id: 'store1', name: 'Default Split' },
        });
        expect(prisma.distributionRuleRecipient.createMany).toHaveBeenCalledWith({
            data: [{ distribution_rule_id: 'rule1', recipient_type: 'STORE', percentage: 100 }],
        });
        expect(result).toEqual({ distributionRuleId: 'rule1' });
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
