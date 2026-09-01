import { DistributionRecipientType, QrCodeSelectionMode } from 'generated/prisma';

// Seeded once at Store creation time (§ sample store setup), alongside
// industry-review-examples.constant.ts, so a new store has a working
// distribution rule, spot, and QR code to scan and test immediately instead
// of the empty state. Kept generic (not per-industry) and free of employee
// references, since no employees exist yet at store creation time.

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
    spot_name: string; // must match one of SAMPLE_SPOTS[].name
}

export const SAMPLE_DISTRIBUTION_RULE: SampleDistributionRule = {
    name: 'Default Split',
    recipients: [{ recipient_type: DistributionRecipientType.STORE, percentage: 100 }],
};

export const SAMPLE_SPOTS: SampleSpot[] = [
    { name: 'Table 1' },
    { name: 'Counter' },
];

export const SAMPLE_QR_CODES: SampleQrCode[] = [
    { label: 'Table 1 QR Code', selection_mode: QrCodeSelectionMode.CHOOSE_ONE, spot_name: 'Table 1' },
    { label: 'Counter QR Code', selection_mode: QrCodeSelectionMode.CHOOSE_ONE, spot_name: 'Counter' },
];
