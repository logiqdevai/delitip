import {
  InvoiceCheckIssues,
  type InvoiceCheckIssue,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const InvoiceCheckIssueDescriptionOptions: {
  id: InvoiceCheckIssue;
  description: string;
}[] = [
  {
    id: InvoiceCheckIssues.NOT_AN_INVOICE,
    description: "The uploaded file does not look like an invoice.",
  },
  {
    id: InvoiceCheckIssues.TOTAL_MISSING,
    description: "No total amount could be read from the invoice.",
  },
  {
    id: InvoiceCheckIssues.TOTAL_MISMATCH,
    description: "The invoice total does not equal the requested payout amount.",
  },
  {
    id: InvoiceCheckIssues.TOTAL_ROUNDING,
    description:
      "The invoice total differs from the payout amount by one cent — likely rounding in the scan.",
  },
  {
    id: InvoiceCheckIssues.CURRENCY_MISMATCH,
    description: "The invoice currency differs from the payout currency.",
  },
  {
    id: InvoiceCheckIssues.ISSUER_VAT_MISMATCH,
    description:
      "The issuer's VAT number does not match the organization's VAT number on file.",
  },
  {
    id: InvoiceCheckIssues.ISSUER_VAT_MISSING,
    description: "No issuer VAT number could be read from the invoice.",
  },
  {
    id: InvoiceCheckIssues.ORG_VAT_MISSING,
    description:
      "The organization has no VAT number in Tax Details, so the issuer could not be verified.",
  },
  {
    id: InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH,
    description: "The invoice is not addressed to the platform's VAT number.",
  },
  {
    id: InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH,
    description:
      "The invoice number on the document differs from the one the store typed.",
  },
  {
    id: InvoiceCheckIssues.DATE_SUSPICIOUS,
    description:
      "The invoice date is before the covered period ended, or in the future.",
  },
  {
    id: InvoiceCheckIssues.NET_PLUS_VAT_MISMATCH,
    description: "Net amount plus VAT does not add up to the stated total.",
  },
];

export function getInvoiceCheckIssueDescription(
  issue: InvoiceCheckIssue | string,
): string {
  return (
    InvoiceCheckIssueDescriptionOptions.find((option) => option.id === issue)
      ?.description ?? issue
  );
}
