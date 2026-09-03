"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateOrganization } from "@/features/organizations/hooks/use-organizations";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import {
  taxDetailsFormSchema,
  type TaxDetailsFormData,
} from "@/features/organizations/validation-schemas/organizations.schema";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const TaxDetailsSettingsForm: FC = () => {
  const { organization, isPending } = useWorkspace();
  const updateOrganization = useUpdateOrganization();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TaxDetailsFormData>({
    resolver: zodResolver(taxDetailsFormSchema),
    defaultValues: {
      legal_name: "",
      vat_number: "",
    },
  });

  useEffect(() => {
    if (!organization) return;
    reset({
      legal_name: organization.legal_name ?? "",
      vat_number: organization.vat_number ?? "",
    });
  }, [organization, reset]);

  useUnsavedChangesWarning(isDirty);

  const onSubmit = handleSubmit((values) => {
    if (!organization) return;
    updateOrganization.mutate({
      id: organization.id,
      payload: {
        legal_name: values.legal_name || undefined,
        vat_number: values.vat_number || undefined,
      },
    });
  });

  if (isPending) {
    return <Skeleton className="h-64 max-w-2xl rounded-2xl" />;
  }

  if (!organization) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
      noValidate
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Tax details</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Billing identity used on invoices for your organization.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="org-legal-name">Legal name</Label>
        <Input
          id="org-legal-name"
          placeholder="Registered legal entity name"
          aria-invalid={!!errors.legal_name}
          {...register("legal_name")}
        />
        {errors.legal_name ? (
          <p className="text-xs text-red-600">{errors.legal_name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="org-vat-number">VAT number</Label>
        <Input
          id="org-vat-number"
          placeholder="e.g. EL123456789"
          aria-invalid={!!errors.vat_number}
          {...register("vat_number")}
        />
        {errors.vat_number ? (
          <p className="text-xs text-red-600">{errors.vat_number.message}</p>
        ) : null}
      </div>

      <div className="pt-2">
        <ActionButtonWithPending
          type="submit"
          isPending={updateOrganization.isPending}
        >
          Save Changes
        </ActionButtonWithPending>
      </div>
    </form>
  );
};
