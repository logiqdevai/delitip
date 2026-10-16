import type { InvoiceCheckVerdict } from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { InvoiceCheckVerdictFormOptions } from "@/config/constants/dropdowns/payouts/invoice-check-verdict-form.options";

export const InvoiceCheckVerdictFilterOptions: {
  id: InvoiceCheckVerdict | "all";
  label: string;
}[] = [{ id: "all", label: "Any check result" }, ...InvoiceCheckVerdictFormOptions];
