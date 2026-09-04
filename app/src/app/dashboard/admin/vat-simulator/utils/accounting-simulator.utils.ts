// Pure calculation helpers for the tip → platform → store/employee VAT
// simulation. All money math happens in integer cents so repeated additions
// never accumulate floating-point drift; callers get plain euro numbers back.

export interface AccountingSimulatorInputs {
  tipNet: number;
  platformFeePercent: number; // % of the tip, e.g. 20 for 20%
  processorFeePercent: number; // % of the tip, e.g. 2.5 for 2.5%
  processorFeeFixed: number; // fixed net amount added on top of the % cut
  vatRateSales: number; // percentage, e.g. 24 for 24%
  vatRateStore: number;
  vatRateProcessor: number;
  reverseCharge: boolean;
}

export interface AccountingDocumentLine {
  key: "platformToCustomer" | "storeToPlatform" | "processorToPlatform";
  title: string;
  note: string;
  net: number;
  vatRate: number;
  vat: number;
  total: number;
}

export interface AccountingSimulatorSummary {
  platformRevenueNet: number;
  storeCostNet: number;
  processorCostNet: number;
  totalCostsNet: number;
  platformPreTaxProfit: number;
  outputVat: number;
  inputVatFromStore: number;
  inputVatFromProcessor: number;
  totalInputVat: number;
  vatPayable: number; // negative value means a VAT credit
}

export interface AccountingSimulatorResult {
  platformFeeNet: number;
  processorFeeNet: number;
  storeNet: number;
  isValid: boolean;
  documents: AccountingDocumentLine[];
  summary: AccountingSimulatorSummary;
}

const toCents = (value: number): number => Math.round(value * 100);
const fromCents = (cents: number): number => cents / 100;

// VAT on a net amount, rounded to the nearest cent — kept in integer-cent
// space so it never inherits binary-float rounding error from the net value.
const vatOnCents = (netCents: number, ratePercent: number): number =>
  Math.round((netCents * ratePercent) / 100);

export const EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS: AccountingSimulatorInputs = {
  tipNet: 10,
  platformFeePercent: 20,
  processorFeePercent: 2.5,
  processorFeeFixed: 0.75,
  vatRateSales: 24,
  vatRateStore: 24,
  vatRateProcessor: 24,
  reverseCharge: false,
};

export const calculateAccountingSimulation = (
  inputs: AccountingSimulatorInputs
): AccountingSimulatorResult => {
  const tipNetCents = toCents(inputs.tipNet);

  // Platform and processor fees are a % of the tip; the processor also adds
  // a fixed per-transaction amount on top of its percentage cut.
  const platformFeeNetCents = Math.round(
    (tipNetCents * inputs.platformFeePercent) / 100
  );
  const processorFeePercentCents = Math.round(
    (tipNetCents * inputs.processorFeePercent) / 100
  );
  const processorFeeFixedCents = toCents(inputs.processorFeeFixed);
  const processorFeeNetCents =
    processorFeePercentCents + processorFeeFixedCents;

  // The store/employee keeps whatever is left of the tip once the platform
  // fee and the processor fee (both taken from the tip, not added on top)
  // are subtracted.
  const storeNetCents = tipNetCents - platformFeeNetCents - processorFeeNetCents;
  const isValid = storeNetCents >= 0;

  // A B2B reverse-charge customer means the platform's outbound invoice
  // carries 0% VAT and the customer self-accounts for it instead.
  const salesVatCents = inputs.reverseCharge
    ? 0
    : vatOnCents(tipNetCents, inputs.vatRateSales);
  const storeVatCents = vatOnCents(storeNetCents, inputs.vatRateStore);
  const processorVatCents = vatOnCents(processorFeeNetCents, inputs.vatRateProcessor);

  const documents: AccountingDocumentLine[] = [
    {
      key: "platformToCustomer",
      title: "Platform → Customer",
      note: "Receipt/invoice for the tip",
      net: fromCents(tipNetCents),
      vatRate: inputs.reverseCharge ? 0 : inputs.vatRateSales,
      vat: fromCents(salesVatCents),
      total: fromCents(tipNetCents + salesVatCents),
    },
    {
      key: "storeToPlatform",
      title: "Store/Employee → Platform",
      note: "Invoice for the net amount owed to the store/employee",
      net: fromCents(storeNetCents),
      vatRate: inputs.vatRateStore,
      vat: fromCents(storeVatCents),
      total: fromCents(storeNetCents + storeVatCents),
    },
    {
      key: "processorToPlatform",
      title: "Processor → Platform",
      note: "Invoice for the payment processing fee",
      net: fromCents(processorFeeNetCents),
      vatRate: inputs.vatRateProcessor,
      vat: fromCents(processorVatCents),
      total: fromCents(processorFeeNetCents + processorVatCents),
    },
  ];

  const totalCostsCents = storeNetCents + processorFeeNetCents;
  // Platform's pre-tax profit is what's left of the tip after paying the
  // store/employee and the processor — by construction this equals the
  // platform fee.
  const platformPreTaxProfitCents = tipNetCents - totalCostsCents;
  const totalInputVatCents = storeVatCents + processorVatCents;
  const vatPayableCents = salesVatCents - totalInputVatCents;

  const summary: AccountingSimulatorSummary = {
    platformRevenueNet: fromCents(tipNetCents),
    storeCostNet: fromCents(storeNetCents),
    processorCostNet: fromCents(processorFeeNetCents),
    totalCostsNet: fromCents(totalCostsCents),
    platformPreTaxProfit: fromCents(platformPreTaxProfitCents),
    outputVat: fromCents(salesVatCents),
    inputVatFromStore: fromCents(storeVatCents),
    inputVatFromProcessor: fromCents(processorVatCents),
    totalInputVat: fromCents(totalInputVatCents),
    vatPayable: fromCents(vatPayableCents),
  };

  return {
    platformFeeNet: fromCents(platformFeeNetCents),
    processorFeeNet: fromCents(processorFeeNetCents),
    storeNet: fromCents(storeNetCents),
    isValid,
    documents,
    summary,
  };
};

export const formatEuro = (value: number): string =>
  `€${value.toFixed(2)}`;

export const formatPercent = (value: number): string => `${value}%`;
