"use client";

import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
  AddressAutocomplete,
  type ParsedAddress,
} from "@/components/ui/address-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryPicker } from "@/components/ui/country-picker";
import { useUpdateOrganization } from "@/features/organizations/hooks/use-organizations";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import {
  taxDetailsFormSchema,
  type TaxDetailsFormData,
} from "@/features/organizations/validation-schemas/organizations.schema";
import {
  GREECE_COUNTRY_CODE,
  getCountryCodeByName,
  getCountryLabel,
} from "@/config/constants/dropdowns/shared/country.options";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const TaxDetailsSettingsForm: FC = () => {
  const { organization, isPending } = useWorkspace();
  const updateOrganization = useUpdateOrganization();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<TaxDetailsFormData>({
    resolver: zodResolver(taxDetailsFormSchema),
    defaultValues: {
      legal_name: "",
      vat_number: "",
      profession: "",
      doy: "",
      address_line: "",
      city: "",
      country: "",
      postal_code: "",
      full_address: undefined,
    },
  });

  useEffect(() => {
    if (!organization) return;
    reset({
      legal_name: organization.legal_name ?? "",
      vat_number: organization.vat_number ?? "",
      profession: organization.profession ?? "",
      doy: organization.doy ?? "",
      address_line: organization.address_line ?? "",
      city: organization.city ?? "",
      country: organization.country ?? "",
      postal_code: organization.postal_code ?? "",
      full_address: organization.full_address ?? undefined,
    });
  }, [organization, reset]);

  useUnsavedChangesWarning(isDirty);

  const isGreece = getCountryCodeByName(watch("country")) === GREECE_COUNTRY_CODE;

  const onSubmit = handleSubmit((values) => {
    if (!organization) return;
    updateOrganization.mutate({
      id: organization.id,
      payload: {
        legal_name: values.legal_name || undefined,
        vat_number: values.vat_number || undefined,
        profession: values.profession || undefined,
        doy: values.doy || undefined,
        address_line: values.address_line || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        postal_code: values.postal_code || undefined,
        full_address: values.full_address,
      },
    });
  });

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
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

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2">
        <div className="min-w-0 space-y-1.5">
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
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="org-profession">Profession / business activity</Label>
          <Input
            id="org-profession"
            placeholder="e.g. Restaurant"
            aria-invalid={!!errors.profession}
            {...register("profession")}
          />
          {errors.profession ? (
            <p className="text-xs text-red-600">{errors.profession.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="org-address">Billing address</Label>
        <Controller
          name="address_line"
          control={control}
          render={({ field }) => (
            <AddressAutocomplete
              id="org-address"
              placeholder="Street address"
              value={field.value ?? ""}
              onValueChange={field.onChange}
              onPlaceSelect={(address: ParsedAddress) => {
                if (address.city) {
                  setValue("city", address.city, { shouldDirty: true });
                }
                if (address.country) {
                  setValue("country", address.country, { shouldDirty: true });
                }
                if (address.postalCode) {
                  setValue("postal_code", address.postalCode, { shouldDirty: true });
                }
                setValue("full_address", address, { shouldDirty: true });
              }}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-3">
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="org-city">City</Label>
          <Input id="org-city" placeholder="City" {...register("city")} />
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="org-country">Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountryPicker
                id="org-country"
                className="w-full"
                value={getCountryCodeByName(field.value) ?? null}
                onValueChange={(code) =>
                  field.onChange(code ? getCountryLabel(code) : "")
                }
              />
            )}
          />
        </div>
        <div className="min-w-0 space-y-1.5 @sm:col-span-2 @lg:col-span-1">
          <Label htmlFor="org-postal">Postal code</Label>
          <Input
            id="org-postal"
            placeholder="Postal code"
            {...register("postal_code")}
          />
        </div>
      </div>

      {isGreece ? (
        <div className="space-y-1.5">
          <Label htmlFor="org-doy">Tax office (Δ.Ο.Υ.)</Label>
          <Input
            id="org-doy"
            placeholder="e.g. Δ.Ο.Υ. Αθηνών"
            aria-invalid={!!errors.doy}
            {...register("doy")}
          />
          {errors.doy ? (
            <p className="text-xs text-red-600">{errors.doy.message}</p>
          ) : null}
        </div>
      ) : null}

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
