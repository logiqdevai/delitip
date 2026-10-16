import { InvoiceCheckVerdict } from 'generated/prisma';
import { InvoiceExtraction } from './invoice-extraction.schema';
import { InvoiceCheckIssues, normalizeVatNumber, verifyInvoice } from './invoice-verification.utils';

const extraction = (overrides: Partial<InvoiceExtraction> = {}): InvoiceExtraction => ({
    is_invoice: true,
    issuer_name: 'Artisan Cafe IKE',
    issuer_vat_number: 'EL 123456789',
    recipient_name: 'Delitip P.C.',
    recipient_vat_number: 'EL987654321',
    invoice_number: 'A-0042',
    invoice_date: '2026-10-15',
    currency: 'EUR',
    net_amount: 100,
    vat_rate_percentage: 24,
    vat_amount: 24,
    total_amount: 124,
    notes: null,
    ...overrides,
});

const expectation = (overrides: Partial<Parameters<typeof verifyInvoice>[1]> = {}) => ({
    amount: 12400,
    currency: 'EUR',
    organization_vat_number: '123456789',
    platform_vat_number: 'EL987654321',
    invoice_number: 'A-0042',
    period_to: new Date('2026-10-13T10:00:00Z'),
    now: new Date('2026-10-16T09:00:00Z'),
    is_image: false,
    ...overrides,
});

describe('normalizeVatNumber', () => {
    it('strips the country prefix, spaces and punctuation so printed and stored forms compare equal', () => {
        expect(normalizeVatNumber('EL 123.456-789')).toBe('123456789');
        expect(normalizeVatNumber('gr123456789')).toBe('123456789');
        expect(normalizeVatNumber('  ')).toBeNull();
        expect(normalizeVatNumber(null)).toBeNull();
    });
});

describe('verifyInvoice', () => {
    it('returns MATCH with no issues when everything lines up', () => {
        expect(verifyInvoice(extraction(), expectation())).toEqual({ verdict: InvoiceCheckVerdict.MATCH, issues: [] });
    });

    it('is UNREADABLE when the file is not an invoice or has no total', () => {
        expect(verifyInvoice(extraction({ is_invoice: false }), expectation())).toEqual({
            verdict: InvoiceCheckVerdict.UNREADABLE,
            issues: [InvoiceCheckIssues.NOT_AN_INVOICE],
        });
        expect(verifyInvoice(extraction({ total_amount: null }), expectation())).toEqual({
            verdict: InvoiceCheckVerdict.UNREADABLE,
            issues: [InvoiceCheckIssues.TOTAL_MISSING],
        });
    });

    it('flags a total that differs from the requested amount as a hard MISMATCH', () => {
        const result = verifyInvoice(extraction({ total_amount: 120 }), expectation());
        expect(result.verdict).toBe(InvoiceCheckVerdict.MISMATCH);
        expect(result.issues).toContain(InvoiceCheckIssues.TOTAL_MISMATCH);
    });

    it('allows a one-cent difference on photos/scans as a soft rounding note, but not on PDFs', () => {
        expect(verifyInvoice(extraction({ total_amount: 124.01 }), expectation({ is_image: true }))).toEqual({
            verdict: InvoiceCheckVerdict.MATCH,
            issues: [InvoiceCheckIssues.TOTAL_ROUNDING],
        });
        expect(verifyInvoice(extraction({ total_amount: 124.01 }), expectation()).verdict).toBe(InvoiceCheckVerdict.MISMATCH);
    });

    it('compares VAT numbers after normalisation and flags the issuer when it is someone else', () => {
        expect(verifyInvoice(extraction({ issuer_vat_number: 'EL123456789' }), expectation()).issues).toEqual([]);
        const result = verifyInvoice(extraction({ issuer_vat_number: 'EL000000000' }), expectation());
        expect(result.verdict).toBe(InvoiceCheckVerdict.MISMATCH);
        expect(result.issues).toContain(InvoiceCheckIssues.ISSUER_VAT_MISMATCH);
    });

    it('only warns (soft) when the organization has no VAT number on file', () => {
        const result = verifyInvoice(extraction(), expectation({ organization_vat_number: null }));
        expect(result.verdict).toBe(InvoiceCheckVerdict.MATCH);
        expect(result.issues).toEqual([InvoiceCheckIssues.ORG_VAT_MISSING]);
    });

    it('flags an invoice addressed to a different recipient VAT number, but skips the check when the platform has none configured', () => {
        expect(verifyInvoice(extraction({ recipient_vat_number: 'EL111111111' }), expectation()).issues).toContain(
            InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH,
        );
        expect(
            verifyInvoice(extraction({ recipient_vat_number: 'EL111111111' }), expectation({ platform_vat_number: null })).issues,
        ).toEqual([]);
    });

    it('adds soft issues for a typed invoice number that differs, an odd date, and net+VAT not adding up', () => {
        const result = verifyInvoice(
            extraction({ invoice_number: 'B-0001', invoice_date: '2026-09-01', vat_amount: 20 }),
            expectation(),
        );
        expect(result.verdict).toBe(InvoiceCheckVerdict.MATCH);
        expect(result.issues).toEqual(
            expect.arrayContaining([
                InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH,
                InvoiceCheckIssues.DATE_SUSPICIOUS,
                InvoiceCheckIssues.NET_PLUS_VAT_MISMATCH,
            ]),
        );
    });

    it('treats a different currency as a hard mismatch', () => {
        const result = verifyInvoice(extraction({ currency: 'USD' }), expectation());
        expect(result.verdict).toBe(InvoiceCheckVerdict.MISMATCH);
        expect(result.issues).toContain(InvoiceCheckIssues.CURRENCY_MISMATCH);
    });
});
