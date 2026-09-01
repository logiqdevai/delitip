import { Prisma, StoreIndustry } from 'generated/prisma';
import { ensureUniqueQrCode } from '@/modules/qr-codes/utils/qr-code.utils';
import { getIndustrySampleStoreSetup, SAMPLE_DISTRIBUTION_RULE } from '@/shared/constants/sample-store-setup.constant';

type SampleStoreSetupSeedClient = Pick<
    Prisma.TransactionClient,
    'distributionRule' | 'distributionRuleRecipient' | 'spot' | 'qrCode' | 'qrCodeSpot'
>;

// Gives a new store a working distribution rule, spot(s), and QR code(s) to
// scan and test immediately instead of the empty state (§ sample store setup).
// Returns the created rule's id so the caller can set it as the store's
// default_distribution_rule_id itself, keeping the store row it returns fresh.
export async function seedSampleStoreSetup(
    prisma: SampleStoreSetupSeedClient,
    storeId: string,
    industry: StoreIndustry,
): Promise<{ distributionRuleId: string }> {
    const { spots, qr_codes: qrCodes } = getIndustrySampleStoreSetup(industry);

    const rule = await prisma.distributionRule.create({
        data: { store_id: storeId, name: SAMPLE_DISTRIBUTION_RULE.name },
    });

    await prisma.distributionRuleRecipient.createMany({
        data: SAMPLE_DISTRIBUTION_RULE.recipients.map((recipient) => ({
            distribution_rule_id: rule.id,
            recipient_type: recipient.recipient_type,
            percentage: recipient.percentage,
        })),
    });

    const spotIdsByName = new Map<string, string>();
    for (const spot of spots) {
        const created = await prisma.spot.create({ data: { store_id: storeId, name: spot.name } });
        spotIdsByName.set(spot.name, created.id);
    }

    for (const qrCode of qrCodes) {
        const code = await ensureUniqueQrCode(async (candidate) => {
            const existing = await prisma.qrCode.findUnique({ where: { code: candidate } });
            return !!existing;
        });

        const created = await prisma.qrCode.create({
            data: {
                store_id: storeId,
                code,
                label: qrCode.label,
                selection_mode: qrCode.selection_mode,
            },
        });

        const spotId = spotIdsByName.get(qrCode.spot_name);
        if (spotId) {
            await prisma.qrCodeSpot.create({ data: { qr_code_id: created.id, spot_id: spotId } });
        }
    }

    return { distributionRuleId: rule.id };
}
