"use client";

import { type FC, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@/lib/i18n-zod-resolver";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  useAppConfig,
  useUpdateAppConfig,
} from "@/features/app-config/hooks/use-app-config";
import type { UpdateAppConfigPayload } from "@/features/app-config/interfaces/app-config.interfaces";
import {
  appConfigSchema,
  type AppConfigFormData,
} from "@/features/app-config/validation-schemas/app-config.schema";

type NumericField = Extract<
  keyof AppConfigFormData,
  | "tip_platform_commission_percentage"
  | "tip_processor_fee_estimate_percentage"
  | "tip_processor_fee_estimate_fixed_amount"
  | "vat_rate_percentage"
  | "payout_hold_window_hours"
>;

type TextField = Extract<
  keyof AppConfigFormData,
  | "platform_legal_name"
  | "platform_vat_number"
  | "platform_tax_office"
  | "platform_address"
>;

// Labels, hints and placeholders live in `dashboard.adminSystem.appConfig.fields.<name>`.
interface NumericFieldDefinition {
  name: NumericField;
  step: string;
}

interface TextFieldDefinition {
  name: TextField;
}

const financeFields: NumericFieldDefinition[] = [
  { name: "tip_platform_commission_percentage", step: "0.01" },
  { name: "tip_processor_fee_estimate_percentage", step: "0.01" },
  { name: "tip_processor_fee_estimate_fixed_amount", step: "1" },
  { name: "vat_rate_percentage", step: "0.01" },
  { name: "payout_hold_window_hours", step: "1" },
];

const invoiceDetailFields: TextFieldDefinition[] = [
  { name: "platform_legal_name" },
  { name: "platform_vat_number" },
  { name: "platform_tax_office" },
  { name: "platform_address" },
];

const FieldShell: FC<{
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, hint, error, children }) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1.5 block text-xs font-semibold text-zinc-700"
    >
      {label}
    </label>
    {children}
    <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
  </div>
);

export const AdminAppConfigPageContent: FC = () => {
  const t = useTranslations("dashboard.adminSystem.appConfig");
  const { data, isError, refetch } = useAppConfig();
  const updateConfig = useUpdateAppConfig();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<AppConfigFormData>({
    resolver: zodResolver(appConfigSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      tip_platform_commission_percentage: Number(
        data.tip_platform_commission_percentage,
      ),
      tip_processor_fee_estimate_percentage: Number(
        data.tip_processor_fee_estimate_percentage,
      ),
      tip_processor_fee_estimate_fixed_amount:
        data.tip_processor_fee_estimate_fixed_amount,
      vat_rate_percentage: Number(data.vat_rate_percentage),
      payout_hold_window_hours: data.payout_hold_window_hours,
      // `?? false`: a flag the API doesn't return yet (e.g. an API running
      // from before its migration) must not make the form invalid.
      payout_invoice_required: data.payout_invoice_required ?? false,
      payout_invoice_ai_check_enabled:
        data.payout_invoice_ai_check_enabled ?? false,
      connected_account_payouts_enabled:
        data.connected_account_payouts_enabled ?? false,
      tip_payouts_store_only: data.tip_payouts_store_only ?? true,
      platform_legal_name: data.platform_legal_name ?? "",
      platform_vat_number: data.platform_vat_number ?? "",
      platform_tax_office: data.platform_tax_office ?? "",
      platform_address: data.platform_address ?? "",
      payout_invoice_instructions: data.payout_invoice_instructions ?? "",
    });
  }, [data, reset]);

  const invoiceRequired = useWatch({
    control,
    name: "payout_invoice_required",
  });

  const onSubmit = handleSubmit(
    (values) => {
      const changedNames = Object.keys(
        dirtyFields,
      ) as (keyof AppConfigFormData)[];
      const changed: UpdateAppConfigPayload = {};
      for (const name of changedNames) {
        Object.assign(changed, { [name]: values[name] });
      }
      updateConfig.mutate(changed);
    },
    (formErrors) => {
      const messages = Object.entries(formErrors).map(([name, error]) => {
        const label = t.has(`fields.${name}.label`)
          ? t(`fields.${name}.label`)
          : name;
        return `${label}: ${error?.message ?? t("errors.checkValue")}`;
      });
      toast.add({
        title: t("errors.nothingSaved"),
        description: messages.join(" · ") || t("errors.needAttention"),
        type: "error",
      });
    },
  );

  return (
    <>
      <DashboardPageHeader
        title={t("title")}
        description={t("description")}
      />
      {isError ? (
        <div className="mt-4 flex max-w-xl items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{t("loadError")}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
          >
            {t("retry")}
          </Button>
        </div>
      ) : null}
      <form onSubmit={onSubmit} noValidate className="mt-4 max-w-xl space-y-6">
        <Tabs defaultValue="finance">
          <TabsList>
            <TabsTrigger value="finance">{t("tabs.finance")}</TabsTrigger>
            <TabsTrigger value="invoices">{t("tabs.invoices")}</TabsTrigger>
            <TabsTrigger value="accounts">{t("tabs.accounts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="finance" keepMounted className="mt-4">
            <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-bold text-ink-charcoal">
                {t("tabs.finance")}
              </h2>
              {financeFields.map(({ name, step }) => (
                <FieldShell
                  key={name}
                  id={name}
                  label={t(`fields.${name}.label`)}
                  hint={t(`fields.${name}.hint`)}
                  error={errors[name]?.message}
                >
                  <Input
                    id={name}
                    type="number"
                    step={step}
                    disabled={updateConfig.isPending}
                    aria-invalid={!!errors[name]}
                    {...register(name, { valueAsNumber: true })}
                  />
                </FieldShell>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="invoices" keepMounted className="mt-4">
            <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
              <div>
                <h2 className="text-sm font-bold text-ink-charcoal">
                  {t("invoices.title")}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {t("invoices.description")}
                </p>
              </div>

              <Controller
                control={control}
                name="payout_invoice_required"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-ink-charcoal">
                        {t("invoices.required.label")}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {t("invoices.required.hint")}
                      </span>
                    </span>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={updateConfig.isPending}
                      aria-label={t("invoices.required.label")}
                    />
                  </label>
                )}
              />

              <Controller
                control={control}
                name="payout_invoice_ai_check_enabled"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-ink-charcoal">
                        {t("invoices.aiCheck.label")}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {t("invoices.aiCheck.hint")}
                      </span>
                    </span>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={updateConfig.isPending}
                      aria-label={t("invoices.aiCheck.label")}
                    />
                  </label>
                )}
              />

              <div className={invoiceRequired ? undefined : "opacity-70"}>
                <p className="mb-3 text-xs font-semibold text-zinc-700">
                  {t("invoices.whoStoresInvoice")}
                  <span className="ml-1 font-normal text-zinc-400">
                    {t("invoices.shownToStores")}
                  </span>
                </p>
                <div className="space-y-4">
                  {invoiceDetailFields.map(
                    ({ name }) => (
                      <FieldShell
                        key={name}
                        id={name}
                        label={t(`fields.${name}.label`)}
                        hint={t(`fields.${name}.hint`)}
                        error={errors[name]?.message}
                      >
                        <Input
                          id={name}
                          type="text"
                          placeholder={t(`fields.${name}.placeholder`)}
                          disabled={updateConfig.isPending}
                          aria-invalid={!!errors[name]}
                          {...register(name)}
                        />
                      </FieldShell>
                    ),
                  )}
                  <FieldShell
                    id="payout_invoice_instructions"
                    label={t("fields.payout_invoice_instructions.label")}
                    hint={t("fields.payout_invoice_instructions.hint")}
                    error={errors.payout_invoice_instructions?.message}
                  >
                    <Textarea
                      id="payout_invoice_instructions"
                      rows={3}
                      disabled={updateConfig.isPending}
                      aria-invalid={!!errors.payout_invoice_instructions}
                      {...register("payout_invoice_instructions")}
                    />
                  </FieldShell>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="accounts" keepMounted className="mt-4">
            <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-sm font-bold text-ink-charcoal">
                {t("accounts.title")}
              </h2>
              <Controller
                control={control}
                name="connected_account_payouts_enabled"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-ink-charcoal">
                        {t("accounts.connected.label")}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {t("accounts.connected.hint")}
                      </span>
                    </span>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={updateConfig.isPending}
                      aria-label={t("accounts.connected.ariaLabel")}
                    />
                  </label>
                )}
              />
              <Controller
                control={control}
                name="tip_payouts_store_only"
                render={({ field }) => (
                  <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                    <span>
                      <span className="block text-sm font-semibold text-ink-charcoal">
                        {t("accounts.storeOnly.label")}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {t("accounts.storeOnly.hint")}
                      </span>
                    </span>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      disabled={updateConfig.isPending}
                      aria-label={t("accounts.storeOnly.label")}
                    />
                  </label>
                )}
              />
            </section>
          </TabsContent>
        </Tabs>

        <ActionButtonWithPending
          type="submit"
          isPending={updateConfig.isPending}
          disabled={!data || !isDirty}
        >
          {t("save")}
        </ActionButtonWithPending>
      </form>
    </>
  );
};
