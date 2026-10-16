"use client";

import { type FC, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useAppConfig,
  useUpdateAppConfig,
} from "@/features/app-config/hooks/use-app-config";
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
  "platform_legal_name" | "platform_vat_number" | "platform_tax_office" | "platform_address"
>;

interface NumericFieldDefinition {
  name: NumericField;
  label: string;
  hint: string;
  step: string;
}

interface TextFieldDefinition {
  name: TextField;
  label: string;
  hint: string;
  placeholder: string;
}

const financeFields: NumericFieldDefinition[] = [
  {
    name: "tip_platform_commission_percentage",
    label: "Platform commission (%)",
    hint: "Taken from each tip. Snapshotted per transaction, so past tips are never recalculated.",
    step: "0.01",
  },
  {
    name: "tip_processor_fee_estimate_percentage",
    label: "Processor fee estimate (%)",
    hint: "Provisional percentage used for display until the real fee is settled.",
    step: "0.01",
  },
  {
    name: "tip_processor_fee_estimate_fixed_amount",
    label: "Processor fee estimate, fixed (minor units)",
    hint: "Added to the percentage estimate. 24 = €0.24.",
    step: "1",
  },
  {
    name: "vat_rate_percentage",
    label: "VAT rate (%)",
    hint: "Added on top of every tip at checkout. 0 means no VAT.",
    step: "0.01",
  },
  {
    name: "payout_hold_window_hours",
    label: "Payout hold window (hours)",
    hint: "How long a tip is held before it becomes payable.",
    step: "1",
  },
];

const invoiceDetailFields: TextFieldDefinition[] = [
  {
    name: "platform_legal_name",
    label: "Legal name",
    hint: "The company name stores must put on the invoice.",
    placeholder: "Delitip P.C.",
  },
  {
    name: "platform_vat_number",
    label: "VAT number",
    hint: "Also used to check the invoice is addressed to the platform.",
    placeholder: "EL123456789",
  },
  {
    name: "platform_tax_office",
    label: "Tax office",
    hint: "Δ.Ο.Υ. for Greek invoices.",
    placeholder: "Δ.Ο.Υ. Ηρακλείου",
  },
  {
    name: "platform_address",
    label: "Billing address",
    hint: "Street, postal code, city, country.",
    placeholder: "Pelasgon 32, 71202 Heraklion, Greece",
  },
];

const FieldShell: FC<{
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, hint, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-zinc-700">
      {label}
    </label>
    {children}
    <p className="mt-1 text-xs text-zinc-500">{hint}</p>
    {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
  </div>
);

export const AdminAppConfigPageContent: FC = () => {
  const { data, isLoading } = useAppConfig();
  const updateConfig = useUpdateAppConfig();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AppConfigFormData>({
    resolver: zodResolver(appConfigSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      tip_platform_commission_percentage: Number(data.tip_platform_commission_percentage),
      tip_processor_fee_estimate_percentage: Number(data.tip_processor_fee_estimate_percentage),
      tip_processor_fee_estimate_fixed_amount: data.tip_processor_fee_estimate_fixed_amount,
      vat_rate_percentage: Number(data.vat_rate_percentage),
      payout_hold_window_hours: data.payout_hold_window_hours,
      payout_invoice_required: data.payout_invoice_required,
      payout_invoice_ai_check_enabled: data.payout_invoice_ai_check_enabled,
      connected_account_payouts_enabled: data.connected_account_payouts_enabled,
      platform_legal_name: data.platform_legal_name ?? "",
      platform_vat_number: data.platform_vat_number ?? "",
      platform_tax_office: data.platform_tax_office ?? "",
      platform_address: data.platform_address ?? "",
      payout_invoice_instructions: data.payout_invoice_instructions ?? "",
    });
  }, [data, reset]);

  const invoiceRequired = useWatch({ control, name: "payout_invoice_required" });

  const onSubmit = handleSubmit((values) => {
    updateConfig.mutate(values);
  });

  return (
    <>
      <DashboardPageHeader
        title="App Config"
        description="Platform-wide finance and payout settings. Changes apply to future tips and payouts only."
      />
      <form onSubmit={onSubmit} noValidate className="mt-4 max-w-xl space-y-6">
        <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-bold text-ink-charcoal">Finance</h2>
          {financeFields.map(({ name, label, hint, step }) => (
            <FieldShell key={name} id={name} label={label} hint={hint} error={errors[name]?.message}>
              <Input
                id={name}
                type="number"
                step={step}
                disabled={isLoading}
                aria-invalid={!!errors[name]}
                {...register(name, { valueAsNumber: true })}
              />
            </FieldShell>
          ))}
        </section>

        <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
          <div>
            <h2 className="text-sm font-bold text-ink-charcoal">Payout invoices</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              When on, a store&apos;s own share is only paid after it uploads an invoice to the
              platform and an admin approves it. Staff paid directly to their own IBAN are not
              affected.
            </p>
          </div>

          <Controller
            control={control}
            name="payout_invoice_required"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-ink-charcoal">
                    Require an invoice before paying stores
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Replaces &quot;Pay out now&quot; with &quot;Request payout&quot; for the store&apos;s money.
                  </span>
                </span>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  aria-label="Require an invoice before paying stores"
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
                    Read invoices automatically
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Uses OpenAI to extract the total, VAT numbers and date and flag mismatches for the
                    admin. Requires an OpenAI key on the API.
                  </span>
                </span>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  aria-label="Read invoices automatically"
                />
              </label>
            )}
          />

          <div className={invoiceRequired ? undefined : "opacity-70"}>
            <p className="mb-3 text-xs font-semibold text-zinc-700">
              Who stores invoice
              <span className="ml-1 font-normal text-zinc-400">— shown to every store when it requests a payout</span>
            </p>
            <div className="space-y-4">
              {invoiceDetailFields.map(({ name, label, hint, placeholder }) => (
                <FieldShell key={name} id={name} label={label} hint={hint} error={errors[name]?.message}>
                  <Input
                    id={name}
                    type="text"
                    placeholder={placeholder}
                    disabled={isLoading}
                    aria-invalid={!!errors[name]}
                    {...register(name)}
                  />
                </FieldShell>
              ))}
              <FieldShell
                id="payout_invoice_instructions"
                label="Instructions for stores"
                hint="Free text, e.g. where to also email the PDF or which invoice series to use."
                error={errors.payout_invoice_instructions?.message}
              >
                <Textarea
                  id="payout_invoice_instructions"
                  rows={3}
                  disabled={isLoading}
                  aria-invalid={!!errors.payout_invoice_instructions}
                  {...register("payout_invoice_instructions")}
                />
              </FieldShell>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-sm font-bold text-ink-charcoal">Payout accounts</h2>
          <Controller
            control={control}
            name="connected_account_payouts_enabled"
            render={({ field }) => (
              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/60 px-4 py-3">
                <span>
                  <span className="block text-sm font-semibold text-ink-charcoal">
                    Connected-account payouts (Viva)
                  </span>
                  <span className="block text-xs text-zinc-500">
                    Shows &quot;Connect with Viva&quot; to stores. Turn on only once real Viva platform
                    credentials exist and a sandbox onboarding has been verified.
                  </span>
                </span>
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  aria-label="Connected-account payouts"
                />
              </label>
            )}
          />
        </section>

        <ActionButtonWithPending
          type="submit"
          isPending={updateConfig.isPending}
          disabled={isLoading || !isDirty}
        >
          Save changes
        </ActionButtonWithPending>
      </form>
    </>
  );
};
