import { InvoiceCheckVerdict } from 'generated/prisma';
import { InvoiceExtraction } from './invoice-extraction.schema';

// Issue codes attached to a payout request after the automatic invoice read.
// "Hard" issues mean the invoice does not match what was requested and make
// the verdict MISMATCH; "soft" ones are worth a human glance but don't change
// the money. The frontend owns the human-readable copy for these.
export const InvoiceCheckIssues = {
  NOT_AN_INVOICE: 'NOT_AN_INVOICE',
  TOTAL_MISSING: 'TOTAL_MISSING',
  TOTAL_MISMATCH: 'TOTAL_MISMATCH',
  TOTAL_ROUNDING: 'TOTAL_ROUNDING',
  CURRENCY_MISMATCH: 'CURRENCY_MISMATCH',
  ISSUER_VAT_MISMATCH: 'ISSUER_VAT_MISMATCH',
  ISSUER_VAT_MISSING: 'ISSUER_VAT_MISSING',
  ORG_VAT_MISSING: 'ORG_VAT_MISSING',
  RECIPIENT_VAT_MISMATCH: 'RECIPIENT_VAT_MISMATCH',
  INVOICE_NUMBER_MISMATCH: 'INVOICE_NUMBER_MISMATCH',
  DATE_SUSPICIOUS: 'DATE_SUSPICIOUS',
  NET_PLUS_VAT_MISMATCH: 'NET_PLUS_VAT_MISMATCH',
} as const;

export type InvoiceCheckIssue = (typeof InvoiceCheckIssues)[keyof typeof InvoiceCheckIssues];

export const HARD_INVOICE_ISSUES: ReadonlySet<InvoiceCheckIssue> = new Set<InvoiceCheckIssue>([
  InvoiceCheckIssues.TOTAL_MISMATCH,
  InvoiceCheckIssues.CURRENCY_MISMATCH,
  InvoiceCheckIssues.ISSUER_VAT_MISMATCH,
  InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH,
]);

// Plain-text descriptions used in the admin notification email. The web app
// has its own copy of this vocabulary under config/constants/dropdowns.
export const InvoiceCheckIssueDescriptions: Record<InvoiceCheckIssue, string> = {
  NOT_AN_INVOICE: 'The uploaded file does not look like an invoice.',
  TOTAL_MISSING: 'No total amount could be read from the invoice.',
  TOTAL_MISMATCH: 'The invoice total does not equal the requested payout amount.',
  TOTAL_ROUNDING: 'The invoice total differs from the payout amount by a cent (likely rounding in the scan).',
  CURRENCY_MISMATCH: 'The invoice currency differs from the payout currency.',
  ISSUER_VAT_MISMATCH: "The issuer's VAT number does not match the organization's VAT number on file.",
  ISSUER_VAT_MISSING: 'No issuer VAT number could be read from the invoice.',
  ORG_VAT_MISSING: 'The organization has no VAT number on file, so the issuer could not be verified.',
  RECIPIENT_VAT_MISMATCH: "The invoice is not addressed to the platform's VAT number.",
  INVOICE_NUMBER_MISMATCH: 'The invoice number on the document differs from the one the store typed.',
  DATE_SUSPICIOUS: 'The invoice date is before the covered period ended, or in the future.',
  NET_PLUS_VAT_MISMATCH: 'Net amount plus VAT does not add up to the stated total.',
};

export interface InvoiceExpectation {
  amount: number; // minor units — what the Store was told to invoice
  currency: string;
  organization_vat_number: string | null;
  platform_vat_number: string | null;
  invoice_number: string | null; // typed by the Store, if any
  period_to: Date;
  now?: Date;
  is_image: boolean; // photos/scans get a one-cent rounding allowance
}

export interface InvoiceVerificationResult {
  verdict: InvoiceCheckVerdict;
  issues: InvoiceCheckIssue[];
}

// Greek VAT numbers are printed with or without the EL/GR prefix and with
// arbitrary spacing or dots; compare the bare digits/letters only.
export function normalizeVatNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  const compact = value.toUpperCase().replace(/[\s.\-/]/g, '');
  const stripped = compact.replace(/^(EL|GR)/, '');
  return stripped.length > 0 ? stripped : null;
}

export function normalizeInvoiceNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  const compact = value.toUpperCase().replace(/[\s.\-/_#]/g, '');
  return compact.length > 0 ? compact : null;
}

export function majorToMinor(value: number | null | undefined): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

function parseIsoDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function verifyInvoice(extracted: InvoiceExtraction, expected: InvoiceExpectation): InvoiceVerificationResult {
  const issues: InvoiceCheckIssue[] = [];
  const now = expected.now ?? new Date();

  if (!extracted.is_invoice) {
    return { verdict: InvoiceCheckVerdict.UNREADABLE, issues: [InvoiceCheckIssues.NOT_AN_INVOICE] };
  }

  const total = majorToMinor(extracted.total_amount);
  if (total === null) {
    return { verdict: InvoiceCheckVerdict.UNREADABLE, issues: [InvoiceCheckIssues.TOTAL_MISSING] };
  }

  const diff = Math.abs(total - expected.amount);
  if (diff > 1 || (diff === 1 && !expected.is_image)) {
    issues.push(InvoiceCheckIssues.TOTAL_MISMATCH);
  } else if (diff === 1) {
    issues.push(InvoiceCheckIssues.TOTAL_ROUNDING);
  }

  if (extracted.currency && extracted.currency.toUpperCase() !== expected.currency.toUpperCase()) {
    issues.push(InvoiceCheckIssues.CURRENCY_MISMATCH);
  }

  const issuerVat = normalizeVatNumber(extracted.issuer_vat_number);
  const orgVat = normalizeVatNumber(expected.organization_vat_number);
  if (!orgVat) {
    issues.push(InvoiceCheckIssues.ORG_VAT_MISSING);
  } else if (!issuerVat) {
    issues.push(InvoiceCheckIssues.ISSUER_VAT_MISSING);
  } else if (issuerVat !== orgVat) {
    issues.push(InvoiceCheckIssues.ISSUER_VAT_MISMATCH);
  }

  const recipientVat = normalizeVatNumber(extracted.recipient_vat_number);
  const platformVat = normalizeVatNumber(expected.platform_vat_number);
  if (platformVat && recipientVat && recipientVat !== platformVat) {
    issues.push(InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH);
  }

  const typedNumber = normalizeInvoiceNumber(expected.invoice_number);
  const printedNumber = normalizeInvoiceNumber(extracted.invoice_number);
  if (typedNumber && printedNumber && typedNumber !== printedNumber) {
    issues.push(InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH);
  }

  const invoiceDate = parseIsoDate(extracted.invoice_date);
  if (invoiceDate) {
    const earliest = new Date(expected.period_to.getTime() - DAY_MS);
    const latest = new Date(now.getTime() + DAY_MS);
    if (invoiceDate < earliest || invoiceDate > latest) {
      issues.push(InvoiceCheckIssues.DATE_SUSPICIOUS);
    }
  }

  const net = majorToMinor(extracted.net_amount);
  const vat = majorToMinor(extracted.vat_amount);
  if (net !== null && vat !== null && Math.abs(net + vat - total) > 1) {
    issues.push(InvoiceCheckIssues.NET_PLUS_VAT_MISMATCH);
  }

  const hasHardIssue = issues.some((issue) => HARD_INVOICE_ISSUES.has(issue));
  return { verdict: hasHardIssue ? InvoiceCheckVerdict.MISMATCH : InvoiceCheckVerdict.MATCH, issues };
}
