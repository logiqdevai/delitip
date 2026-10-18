import { DistributionPayoutMode, DistributionRecipientType, Prisma, QrCodeSelectionMode, StoreIndustry } from 'generated/prisma';
import { ensureUniqueQrCode } from '@/modules/qr-codes/utils/qr-code.utils';
import {
    getIndustrySampleStoreSetup,
    SAMPLE_DISTRIBUTION_RULE,
    SAMPLE_EMPLOYEE_SPLIT_RULE_NAME,
    SAMPLE_EMPLOYEES,
} from '@/shared/constants/sample-store-setup.constant';

type SampleStoreSetupSeedClient = Pick<
    Prisma.TransactionClient,
    'distributionRule' | 'distributionRuleRecipient' | 'spot' | 'qrCode' | 'qrCodeSpot' | 'qrCodeEmployee' | 'employee'
>;

// Gives a new store a working distribution rule, example employees, spot(s),
// and QR code(s) to scan and test immediately instead of the empty state
// (§ sample store setup). Every seeded rule sends everything to the business
// (VIA_STORE), so no employee payout accounts are needed to try it out.
// Returns the default rule's id so the caller can set it as the store's
// default_distribution_rule_id itself, keeping the store row it returns fresh.
export async function seedSampleStoreSetup(
    prisma: SampleStoreSetupSeedClient,
    storeId: string,
    industry: StoreIndustry,
    { includeExampleEmployees = false }: { includeExampleEmployees?: boolean } = {},
): Promise<{ distributionRuleId: string }> {
    const { spots, qr_codes: qrCodes } = getIndustrySampleStoreSetup(industry);

    const rule = await prisma.distributionRule.create({
        data: { store_id: storeId, name: SAMPLE_DISTRIBUTION_RULE.name, payout_mode: DistributionPayoutMode.VIA_STORE },
    });

    await prisma.distributionRuleRecipient.createMany({
        data: SAMPLE_DISTRIBUTION_RULE.recipients.map((recipient) => ({
            distribution_rule_id: rule.id,
            recipient_type: recipient.recipient_type,
            percentage: recipient.percentage,
        })),
    });

    // Account creation only: two example employees, a 50/50 rule between them,
    // and (below) a QR code wired to both so the team split can be tried at once.
    const employeeIds: string[] = [];
    let splitRuleId: string | null = null;
    if (includeExampleEmployees) {
        for (const employee of SAMPLE_EMPLOYEES) {
            const created = await prisma.employee.create({
                data: {
                    store_id: storeId,
                    full_name: employee.full_name,
                    email: employee.email,
                    position: employee.position,
                },
            });
            employeeIds.push(created.id);
        }

        const splitRule = await prisma.distributionRule.create({
            data: {
                store_id: storeId,
                name: SAMPLE_EMPLOYEE_SPLIT_RULE_NAME,
                payout_mode: DistributionPayoutMode.VIA_STORE,
            },
        });

        await prisma.distributionRuleRecipient.createMany({
            data: employeeIds.map((employeeId, index) => ({
                distribution_rule_id: splitRule.id,
                recipient_type: DistributionRecipientType.EMPLOYEE,
                employee_id: employeeId,
                percentage: 100 / employeeIds.length,
                sort_order: index,
            })),
        });

    splitRuleId = splitRule.id;
    }

    const spotIdsByName = new Map<string, string>();
    for (const spot of spots) {
        const created = await prisma.spot.create({ data: { store_id: storeId, name: spot.name } });
        spotIdsByName.set(spot.name, created.id);
    }

    for (const [index, qrCode] of qrCodes.entries()) {
        const code = await ensureUniqueQrCode(async (candidate) => {
            const existing = await prisma.qrCode.findUnique({ where: { code: candidate } });
            return !!existing;
        });

        // The first QR code stays employee-less on the default rule; the second
        // gets the 50/50 rule and both example employees.
        const usesSplitRule = splitRuleId !== null && index === 1;

        const created = await prisma.qrCode.create({
            data: {
                store_id: storeId,
                code,
                label: qrCode.label,
                selection_mode: usesSplitRule ? QrCodeSelectionMode.TEAM : qrCode.selection_mode,
                ...(usesSplitRule ? { distribution_rule_id: splitRuleId } : {}),
            },
        });

        if (usesSplitRule) {
            await prisma.qrCodeEmployee.createMany({
                data: employeeIds.map((employeeId) => ({ qr_code_id: created.id, employee_id: employeeId })),
            });
        }

        const spotId = spotIdsByName.get(qrCode.spot_name);
        if (spotId) {
            await prisma.qrCodeSpot.create({ data: { qr_code_id: created.id, spot_id: spotId } });
        }
    }

    return { distributionRuleId: rule.id };
}
