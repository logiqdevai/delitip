import {
  InvoiceCheckIssues,
  type InvoiceCheckIssue,
} from "@/features/payout-requests/interfaces/payout-requests.interfaces";

export const InvoiceCheckIssueDescriptionOptions: {
  id: InvoiceCheckIssue;
  descriptionKey: string;
}[] = [
  {
    id: InvoiceCheckIssues.NOT_AN_INVOICE,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.NOT_AN_INVOICE",
  },
  {
    id: InvoiceCheckIssues.NET_MISSING,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.NET_MISSING",
  },
  {
    id: InvoiceCheckIssues.NET_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.NET_MISMATCH",
  },
  {
    id: InvoiceCheckIssues.NET_ROUNDING,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.NET_ROUNDING",
  },
  {
    id: InvoiceCheckIssues.CURRENCY_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.CURRENCY_MISMATCH",
  },
  {
    id: InvoiceCheckIssues.ISSUER_VAT_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.ISSUER_VAT_MISMATCH",
  },
  {
    id: InvoiceCheckIssues.ISSUER_VAT_MISSING,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.ISSUER_VAT_MISSING",
  },
  {
    id: InvoiceCheckIssues.ORG_VAT_MISSING,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.ORG_VAT_MISSING",
  },
  {
    id: InvoiceCheckIssues.RECIPIENT_VAT_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.RECIPIENT_VAT_MISMATCH",
  },
  {
    id: InvoiceCheckIssues.INVOICE_NUMBER_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.INVOICE_NUMBER_MISMATCH",
  },
  {
    id: InvoiceCheckIssues.DATE_SUSPICIOUS,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.DATE_SUSPICIOUS",
  },
  {
    id: InvoiceCheckIssues.NET_PLUS_VAT_MISMATCH,
    descriptionKey: "dashboard.enums.invoiceCheckIssue.NET_PLUS_VAT_MISMATCH",
  },
];
