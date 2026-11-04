import type { InvoiceCheckVerdict } from "@/features/payout-requests/interfaces/payout-requests.interfaces";
import { InvoiceCheckVerdictFormOptions } from "@/config/constants/dropdowns/payouts/invoice-check-verdict-form.options";
import type { DropdownOptionSource } from "@/hooks/use-dropdown-options";

export const InvoiceCheckVerdictFilterOptions: DropdownOptionSource<InvoiceCheckVerdict>[] =
  [
    { id: "all", labelKey: "dashboard.enums.invoiceCheckVerdict.all" },
    ...InvoiceCheckVerdictFormOptions,
  ];
