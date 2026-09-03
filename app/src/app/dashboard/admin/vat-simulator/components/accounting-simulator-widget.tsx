"use client";

import { type FC, useMemo, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel, FieldDescription } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  calculateAccountingSimulation,
  EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS,
  formatEuro,
  formatPercent,
  type AccountingSimulatorInputs,
} from "../utils/accounting-simulator.utils";

// A numeric input field never lets the model see NaN — an empty or invalid
// string just falls back to 0 so downstream math stays well-defined.
const parseNumberInput = (raw: string): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const AccountingSimulatorWidget: FC = () => {
  const [inputs, setInputs] = useState<AccountingSimulatorInputs>(
    EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS
  );

  const result = useMemo(() => calculateAccountingSimulation(inputs), [inputs]);

  const updateField = <K extends keyof AccountingSimulatorInputs>(
    key: K,
    value: AccountingSimulatorInputs[K]
  ) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:items-start">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>
                Net tip amount (before VAT), plus the platform and processor
                fees taken out of it.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInputs(EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS)}
              className="shrink-0"
            >
              <Sparkles data-icon="inline-start" className="size-3.5" />
              Example
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="tip-net">Tip amount (net)</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>€</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="tip-net"
                type="number"
                inputMode="decimal"
                step="0.01"
                min={0}
                value={inputs.tipNet}
                onChange={(event) =>
                  updateField("tipNet", parseNumberInput(event.target.value))
                }
              />
            </InputGroup>
            <FieldDescription>
              What the customer tips, before VAT.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="platform-fee-percent">
              Platform fee
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="platform-fee-percent"
                type="number"
                inputMode="decimal"
                step="0.1"
                min={0}
                max={100}
                value={inputs.platformFeePercent}
                onChange={(event) =>
                  updateField(
                    "platformFeePercent",
                    parseNumberInput(event.target.value)
                  )
                }
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>%</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FieldDescription>
              % of the tip, taken out of it — not added on top. ={" "}
              {formatEuro(result.platformFeeNet)}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="processor-fee-percent">
              Payment processor fee
            </FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              <InputGroup>
                <InputGroupInput
                  id="processor-fee-percent"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min={0}
                  max={100}
                  value={inputs.processorFeePercent}
                  onChange={(event) =>
                    updateField(
                      "processorFeePercent",
                      parseNumberInput(event.target.value)
                    )
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>€</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="processor-fee-fixed"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  value={inputs.processorFeeFixed}
                  onChange={(event) =>
                    updateField(
                      "processorFeeFixed",
                      parseNumberInput(event.target.value)
                    )
                  }
                />
              </InputGroup>
            </div>
            <FieldDescription>
              e.g. Viva Wallet&apos;s cut — % of the tip plus a fixed amount
              per transaction. = {formatEuro(result.processorFeeNet)}
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field>
              <FieldLabel htmlFor="vat-sales">Sales VAT</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="vat-sales"
                  type="number"
                  inputMode="decimal"
                  step="1"
                  min={0}
                  max={100}
                  value={inputs.vatRateSales}
                  onChange={(event) =>
                    updateField(
                      "vatRateSales",
                      parseNumberInput(event.target.value)
                    )
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="vat-store">Store VAT</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="vat-store"
                  type="number"
                  inputMode="decimal"
                  step="1"
                  min={0}
                  max={100}
                  value={inputs.vatRateStore}
                  onChange={(event) =>
                    updateField(
                      "vatRateStore",
                      parseNumberInput(event.target.value)
                    )
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="vat-processor">Processor VAT</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="vat-processor"
                  type="number"
                  inputMode="decimal"
                  step="1"
                  min={0}
                  max={100}
                  value={inputs.vatRateProcessor}
                  onChange={(event) =>
                    updateField(
                      "vatRateProcessor",
                      parseNumberInput(event.target.value)
                    )
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>%</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="reverse-charge">
                Customer is B2B with reverse charge
              </FieldLabel>
              <FieldDescription>
                Platform&apos;s sale gets 0% VAT; the customer self-accounts
                for it.
              </FieldDescription>
            </FieldContent>
            <Switch
              id="reverse-charge"
              checked={inputs.reverseCharge}
              onCheckedChange={(checked) =>
                updateField("reverseCharge", checked)
              }
            />
          </Field>

          <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">
              Store/employee net (auto-calculated):{" "}
            </span>
            <span
              className={cn(
                "font-medium",
                !result.isValid && "text-destructive"
              )}
            >
              {formatEuro(result.storeNet)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {!result.isValid ? (
          <Alert variant="destructive">
            <Info />
            <AlertDescription>
              The platform fee and processor fee together exceed the tip, so
              the store/employee net amount would be negative. Lower the fees
              or raise the tip before reading the results below.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Invoices &amp; receipts</CardTitle>
                <CardDescription>
                  Every document this flow generates, net → VAT → total.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead className="text-right">VAT</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.documents.map((doc) => (
                      <TableRow key={doc.key}>
                        <TableCell className="whitespace-normal">
                          <div className="font-medium">{doc.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {doc.note}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatEuro(doc.net)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatEuro(doc.vat)}
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({formatPercent(doc.vatRate)})
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatEuro(doc.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                  Platform profit and the VAT due to the state.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5 text-sm">
                <SummaryRow
                  label="Platform revenue (net)"
                  value={formatEuro(result.summary.platformRevenueNet)}
                />
                <SummaryRow
                  label="Store/employee cost (net)"
                  value={formatEuro(result.summary.storeCostNet)}
                />
                <SummaryRow
                  label="Processor fee cost (net)"
                  value={formatEuro(result.summary.processorCostNet)}
                />
                <SummaryRow
                  label="Total costs (net)"
                  value={formatEuro(result.summary.totalCostsNet)}
                />
                <SummaryRow
                  label="Platform pre-tax profit"
                  value={formatEuro(result.summary.platformPreTaxProfit)}
                  emphasis
                />

                <div className="my-1 border-t" />

                <SummaryRow
                  label="Output VAT (on sales)"
                  value={formatEuro(result.summary.outputVat)}
                />
                <SummaryRow
                  label="Input VAT — from store"
                  value={formatEuro(result.summary.inputVatFromStore)}
                />
                <SummaryRow
                  label="Input VAT — from processor"
                  value={formatEuro(result.summary.inputVatFromProcessor)}
                />
                <SummaryRow
                  label="Total input VAT"
                  value={formatEuro(result.summary.totalInputVat)}
                />

                <div className="my-1 border-t" />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="font-medium">
                    {result.summary.vatPayable >= 0
                      ? "VAT payable to the state"
                      : "VAT credit"}
                  </span>
                  <Badge
                    variant={
                      result.summary.vatPayable >= 0
                        ? "destructive"
                        : "secondary"
                    }
                    className="h-6 px-2.5 text-sm font-semibold"
                  >
                    {formatEuro(Math.abs(result.summary.vatPayable))}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Alert>
          <Info />
          <AlertDescription>
            This is a simplified simulation. Consult your accountant for real
            accounting.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
  emphasis?: boolean;
}

const SummaryRow: FC<SummaryRowProps> = ({ label, value, emphasis }) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-muted-foreground">{label}</span>
    <span className={cn(emphasis && "font-semibold")}>{value}</span>
  </div>
);
