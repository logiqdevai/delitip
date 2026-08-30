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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryPicker } from "@/components/ui/country-picker";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import {
  storeProfileFormSchema,
  type StoreProfileFormData,
} from "@/features/stores/validation-schemas/stores.schema";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import {
  getCountryCodeByName,
  getCountryLabel,
} from "@/config/constants/dropdowns/shared/country.options";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const BusinessProfileSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StoreProfileFormData>({
    resolver: zodResolver(storeProfileFormSchema),
    defaultValues: {
      name: "",
      industry: "OTHER",
      address_line: "",
      city: "",
      country: "",
      postal_code: "",
      full_address: undefined,
    },
  });

  useEffect(() => {
    if (!store) return;
    reset({
      name: store.name,
      industry: store.industry,
      address_line: store.address_line ?? "",
      city: store.city ?? "",
      country: store.country ?? "",
      postal_code: store.postal_code ?? "",
      full_address: store.full_address ?? undefined,
    });
  }, [store, reset]);

  useUnsavedChangesWarning(isDirty);

  const onSubmit = handleSubmit((values) => {
    if (!store) return;
    updateStore.mutate({
      id: store.id,
      payload: {
        name: values.name,
        industry: values.industry,
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

  if (!store) return null;

  return (
    <form
      onSubmit={onSubmit}
      className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
      noValidate
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Business profile
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Core details customers and your team see across delitip.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="store-name">Business name</Label>
        <Input
          id="store-name"
          placeholder="e.g. Artisan Café & Bar"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="store-industry">Industry</Label>
        <Controller
          name="industry"
          control={control}
          render={({ field }) => (
            <Select
              items={StoreIndustryFormOptions.map((option) => ({
                label: option.label,
                value: option.id,
              }))}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger id="store-industry" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {StoreIndustryFormOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="store-address">Address</Label>
        <Controller
          name="address_line"
          control={control}
          render={({ field }) => (
            <AddressAutocomplete
              id="store-address"
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
          <Label htmlFor="store-city">City</Label>
          <Input id="store-city" placeholder="City" {...register("city")} />
        </div>
        <div className="min-w-0 space-y-1.5">
          <Label htmlFor="store-country">Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CountryPicker
                id="store-country"
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
          <Label htmlFor="store-postal">Postal code</Label>
          <Input
            id="store-postal"
            placeholder="Postal code"
            {...register("postal_code")}
          />
        </div>
      </div>

      <div className="pt-2">
        <ActionButtonWithPending type="submit" isPending={updateStore.isPending}>
          Save Changes
        </ActionButtonWithPending>
      </div>
    </form>
  );
};
