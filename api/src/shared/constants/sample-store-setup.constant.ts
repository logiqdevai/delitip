import { DistributionRecipientType, QrCodeSelectionMode, StoreIndustry } from 'generated/prisma';

export interface SampleDistributionRuleRecipient {
    recipient_type: DistributionRecipientType;
    percentage: number;
}

export interface SampleDistributionRule {
    name: string;
    recipients: SampleDistributionRuleRecipient[];
}

export interface SampleSpot {
    name: string;
}

export interface SampleQrCode {
    label: string;
    selection_mode: QrCodeSelectionMode;
    spot_name: string;
}

export interface SampleStoreSetup {
    spots: SampleSpot[];
    qr_codes: SampleQrCode[];
}

export const SAMPLE_DISTRIBUTION_RULE: SampleDistributionRule = {
    name: 'Default Split',
    recipients: [{ recipient_type: DistributionRecipientType.STORE, percentage: 100 }],
};

function buildSampleStoreSetup(spots: SampleSpot[]): SampleStoreSetup {
    return {
        spots,
        qr_codes: spots.map((spot) => ({
            label: `${spot.name} QR Code`,
            selection_mode: QrCodeSelectionMode.CHOOSE_ONE,
            spot_name: spot.name,
        })),
    };
}

export const INDUSTRY_SAMPLE_STORE_SETUP: Record<StoreIndustry, SampleStoreSetup> = {
    RESTAURANT: buildSampleStoreSetup([{ name: 'Table 01' }, { name: 'Counter' }]),
    CAFE: buildSampleStoreSetup([{ name: 'Table 01' }, { name: 'Counter' }]),
    BAR: buildSampleStoreSetup([{ name: 'Bar' }, { name: 'Table 01' }]),
    HOTEL: buildSampleStoreSetup([{ name: 'Room 01' }, { name: 'Reception' }]),
    SALON: buildSampleStoreSetup([{ name: 'Chair 01' }, { name: 'Reception' }]),
    SPA: buildSampleStoreSetup([{ name: 'Bed 01' }, { name: 'Reception' }]),
    RETAIL: buildSampleStoreSetup([{ name: 'Register 01' }, { name: 'Checkout' }]),
    BARBERSHOP: buildSampleStoreSetup([{ name: 'Chair 01' }, { name: 'Reception' }]),
    FITNESS: buildSampleStoreSetup([{ name: 'Station 01' }, { name: 'Front Desk' }]),
    FOOD_TRUCK: buildSampleStoreSetup([{ name: 'Window' }, { name: 'Counter' }]),
    CLEANING: buildSampleStoreSetup([{ name: 'Location 01' }, { name: 'Office' }]),
    OTHER: buildSampleStoreSetup([{ name: 'Spot 01' }, { name: 'Counter' }]),
};

export function getIndustrySampleStoreSetup(industry: StoreIndustry): SampleStoreSetup {
    return INDUSTRY_SAMPLE_STORE_SETUP[industry];
}
