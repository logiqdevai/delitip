"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import { Info, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
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
import { useAppConfig } from "@/features/app-config/hooks/use-app-config";
import {
  calculateAccountingSimulation,
  EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS,
  formatEuro as formatEuroInLocale,
  formatPercent as formatPercentInLocale,
  type AccountingSimulatorInputs,
} from "../utils/accounting-simulator.utils";

// A numeric input field never lets the model see NaN — an empty or invalid
// string just falls back to 0 so downstream math stays well-defined.
const parseNumberInput = (raw: string): number => {
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const AccountingSimulatorWidget: FC = () => {
  const t = useTranslations("dashboard.adminSystem.vatSimulator");
  const locale = useLocale();
  const formatEuro = (value: number) => formatEuroInLocale(value, locale);
  const formatPercent = (value: number) => formatPercentInLocale(value, locale);
  const { data: appConfig } = useAppConfig();
  // The platform's own sales VAT rate comes from AppConfig; the store and
  // processor rates are third parties' and stay as example values.
  const defaultInputs = useMemo<AccountingSimulatorInputs>(
    () => ({
      ...EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS,
      vatRateSales: appConfig
        ? Number(appConfig.vat_rate_percentage)
        : EXAMPLE_ACCOUNTING_SIMULATOR_INPUTS.vatRateSales,
    }),
    [appConfig]
  );
  const [inputs, setInputs] = useState<AccountingSimulatorInputs>(defaultInputs);

  useEffect(() => {
    setInputs((current) => ({
      ...current,
      vatRateSales: defaultInputs.vatRateSales,
    }));
  }, [defaultInputs.vatRateSales]);

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
              <CardTitle>{t("inputs.title")}</CardTitle>
              <CardDescription>{t("inputs.description")}</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInputs(defaultInputs)}
              className="shrink-0"
            >
              <Sparkles data-icon="inline-start" className="size-3.5" />
              {t("inputs.example")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="tip-net">{t("inputs.tipAmount")}</FieldLabel>
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
            <FieldDescription>{t("inputs.tipAmountHint")}</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="platform-fee-percent">
              {t("inputs.platformFee")}
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
              {t("inputs.platformFeeHint", {
                amount: formatEuro(result.platformFeeNet),
              })}
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="processor-fee-percent">
              {t("inputs.processorFee")}
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
              {t("inputs.processorFeeHint", {
                amount: formatEuro(result.processorFeeNet),
              })}
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-3 gap-2">
            <Field>
              <FieldLabel htmlFor="vat-sales">{t("inputs.salesVat")}</FieldLabel>
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
              <FieldLabel htmlFor="vat-store">{t("inputs.storeVat")}</FieldLabel>
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
              <FieldLabel htmlFor="vat-processor">
                {t("inputs.processorVat")}
              </FieldLabel>
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
                {t("inputs.reverseCharge")}
              </FieldLabel>
              <FieldDescription>{t("inputs.reverseChargeHint")}</FieldDescription>
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
              {t("inputs.storeNet")}{" "}
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
            <AlertDescription>{t("invalid")}</AlertDescription>
          </Alert>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t("documents.title")}</CardTitle>
                <CardDescription>{t("documents.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("documents.columns.document")}</TableHead>
                      <TableHead className="text-right">
                        {t("documents.columns.net")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("documents.columns.vat")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("documents.columns.total")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.documents.map((doc) => (
                      <TableRow key={doc.key}>
                        <TableCell className="whitespace-normal">
                          <div className="font-medium">
                            {t(`documents.${doc.key}.title`)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {t(`documents.${doc.key}.note`)}
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
                <CardTitle>{t("summary.title")}</CardTitle>
                <CardDescription>{t("summary.description")}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1.5 text-sm">
                <SummaryRow
                  label={t("summary.platformRevenueNet")}
                  value={formatEuro(result.summary.platformRevenueNet)}
                />
                <SummaryRow
                  label={t("summary.storeCostNet")}
                  value={formatEuro(result.summary.storeCostNet)}
                />
                <SummaryRow
                  label={t("summary.processorCostNet")}
                  value={formatEuro(result.summary.processorCostNet)}
                />
                <SummaryRow
                  label={t("summary.totalCostsNet")}
                  value={formatEuro(result.summary.totalCostsNet)}
                />
                <SummaryRow
                  label={t("summary.platformPreTaxProfit")}
                  value={formatEuro(result.summary.platformPreTaxProfit)}
                  emphasis
                />

                <div className="my-1 border-t" />

                <SummaryRow
                  label={t("summary.outputVat")}
                  value={formatEuro(result.summary.outputVat)}
                />
                <SummaryRow
                  label={t("summary.inputVatFromStore")}
                  value={formatEuro(result.summary.inputVatFromStore)}
                />
                <SummaryRow
                  label={t("summary.inputVatFromProcessor")}
                  value={formatEuro(result.summary.inputVatFromProcessor)}
                />
                <SummaryRow
                  label={t("summary.totalInputVat")}
                  value={formatEuro(result.summary.totalInputVat)}
                />

                <div className="my-1 border-t" />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="font-medium">
                    {result.summary.vatPayable >= 0
                      ? t("summary.vatPayable")
                      : t("summary.vatCredit")}
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
          <AlertDescription>{t("disclaimer")}</AlertDescription>
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
