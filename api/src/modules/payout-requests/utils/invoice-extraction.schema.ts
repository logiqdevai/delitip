import { z } from 'zod';

// What the model is asked to read off the invoice. Every field is nullable
// so a partial read still comes back as a well-formed object instead of a
// schema failure; the verifier decides what a missing value means.
export const InvoiceExtractionSchema = z.object({
  is_invoice: z
    .boolean()
    .describe(
      'true only if the document is an invoice or receipt for services/goods (not a bank statement, quote, photo of something else, etc.)',
    ),
  issuer_name: z.string().nullable().describe('Legal/trading name of the party that ISSUED the invoice (the supplier)'),
  issuer_vat_number: z.string().nullable().describe('VAT / tax identification number of the issuer, exactly as printed'),
  recipient_name: z.string().nullable().describe('Name of the party the invoice is addressed TO (the customer / bill-to)'),
  recipient_vat_number: z.string().nullable().describe('VAT / tax identification number of the recipient, exactly as printed'),
  invoice_number: z.string().nullable().describe('Invoice number / series as printed'),
  invoice_date: z.string().nullable().describe('Issue date in YYYY-MM-DD'),
  currency: z.string().nullable().describe('ISO 4217 currency code, e.g. EUR'),
  net_amount: z.number().nullable().describe('Amount before VAT (net / subtotal), in major units (e.g. 123.45)'),
  vat_rate_percentage: z.number().nullable().describe('VAT rate applied, in percent (e.g. 24). 0 if VAT-exempt / reverse charge'),
  vat_amount: z.number().nullable().describe('VAT amount, in major units'),
  total_amount: z.number().nullable().describe('Grand total payable including VAT, in major units'),
  notes: z.string().nullable().describe('Anything unusual worth telling a human reviewer, in one short sentence'),
});

export type InvoiceExtraction = z.infer<typeof InvoiceExtractionSchema>;

export const INVOICE_EXTRACTION_SYSTEM_PROMPT =
  'You read supplier invoices for an accounts-payable team. Extract only what is printed on the document. ' +
  'Never guess or infer values that are not visible; use null instead. Amounts are decimal numbers in major currency units. ' +
  'Greek invoices may label VAT as ΦΠΑ and the tax number as ΑΦΜ; the tax office is Δ.Ο.Υ.';

export const INVOICE_EXTRACTION_PROMPT =
  'Extract the structured fields from this document. It should be an invoice issued by a business to the platform operator for a tip payout.';

// Cheap vision-capable model used to read invoices. Change it here; it is
// deliberately not an env var.
export const INVOICE_EXTRACTION_MODEL = 'gpt-4o-mini';
