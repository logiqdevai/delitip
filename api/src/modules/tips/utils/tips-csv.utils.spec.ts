import { buildTipsCsv, escapeCsvCell, formatTipAmountMajor, tipsExportFilename } from './tips-csv.utils';

describe('tips-csv.utils', () => {
    it('escapes commas quotes and newlines', () => {
        expect(escapeCsvCell('plain')).toBe('plain');
        expect(escapeCsvCell('a,b')).toBe('"a,b"');
        expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
        expect(escapeCsvCell('line1\nline2')).toBe('"line1\nline2"');
    });

    it('formats minor units as major currency amounts', () => {
        expect(formatTipAmountMajor(1500)).toBe('15.00');
        expect(formatTipAmountMajor(5)).toBe('0.05');
    });

    it('builds a bom-prefixed csv with ledger columns', () => {
        const csv = buildTipsCsv([
            {
                id: 'tip1',
                paid_at: new Date('2026-09-04T10:00:00.000Z'),
                created_at: new Date('2026-09-04T09:00:00.000Z'),
                employee: { full_name: 'Maria' },
                qr_code: { label: 'Table 08' },
                payment_transaction: { payment_method: 'CARD' },
                amount: 500,
                currency: 'EUR',
                status: 'COMPLETED',
            },
        ]);

        expect(csv.startsWith('\uFEFF')).toBe(true);
        expect(csv).toContain('Transaction ID,Timestamp,Employee,QR Code,Payment Method,Amount,Currency,Status');
        expect(csv).toContain('tip1,2026-09-04T10:00:00.000Z,Maria,Table 08,CARD,5.00,EUR,COMPLETED');
    });

    it('uses a dated tips filename', () => {
        expect(tipsExportFilename(new Date('2026-09-04T12:00:00.000Z'))).toBe('tips-2026-09-04.csv');
    });
});
