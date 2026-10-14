"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import {
  useAppConfig,
  useUpdateAppConfig,
} from "@/features/app-config/hooks/use-app-config";
import {
  appConfigSchema,
  type AppConfigFormData,
} from "@/features/app-config/validation-schemas/app-config.schema";

interface FieldDefinition {
  name: keyof AppConfigFormData;
  label: string;
  hint: string;
  step: string;
}

const fields: FieldDefinition[] = [
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

export const AdminAppConfigPageContent: FC = () => {
  const { data, isLoading } = useAppConfig();
  const updateConfig = useUpdateAppConfig();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
    });
  }, [data, reset]);

  const onSubmit = handleSubmit((values) => {
    updateConfig.mutate(values);
  });

  return (
    <>
      <DashboardPageHeader
        title="App Config"
        description="Platform-wide finance settings. Changes apply to future tips and payouts only."
      />
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-4 max-w-xl space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
      >
        {fields.map(({ name, label, hint, step }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              {label}
            </label>
            <Input
              id={name}
              type="number"
              step={step}
              disabled={isLoading}
              aria-invalid={!!errors[name]}
              {...register(name, { valueAsNumber: true })}
            />
            <p className="mt-1 text-xs text-zinc-500">{hint}</p>
            {errors[name] ? (
              <p className="mt-1 text-xs text-red-600">
                {errors[name]?.message}
              </p>
            ) : null}
          </div>
        ))}
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
