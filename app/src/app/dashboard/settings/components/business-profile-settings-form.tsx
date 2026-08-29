"use client";

import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import {
  storeProfileFormSchema,
  type StoreProfileFormData,
} from "@/features/stores/validation-schemas/stores.schema";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { StoreCurrencyFormOptions } from "@/config/constants/dropdowns/stores/store-currency-form.options";
import { getStoreTimezoneOptions } from "@/config/constants/dropdowns/stores/store-timezone-form.options";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const BusinessProfileSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreProfileFormData>({
    resolver: zodResolver(storeProfileFormSchema),
    defaultValues: {
      name: "",
      industry: "OTHER",
      timezone: "UTC",
      currency: "EUR",
      address_line: "",
      city: "",
      country: "",
      postal_code: "",
    },
  });

  useEffect(() => {
    if (!store) return;
    reset({
      name: store.name,
      industry: store.industry,
      timezone: store.timezone,
      currency: store.currency,
      address_line: store.address_line ?? "",
      city: store.city ?? "",
      country: store.country ?? "",
      postal_code: store.postal_code ?? "",
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
        timezone: values.timezone,
        currency: values.currency,
        address_line: values.address_line || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        postal_code: values.postal_code || undefined,
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
      className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
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
        <Input id="store-name" aria-invalid={!!errors.name} {...register("name")} />
        {errors.name ? (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="store-industry">Industry</Label>
          <NativeSelect id="store-industry" className="w-full" {...register("industry")}>
            {StoreIndustryFormOptions.map((option) => (
              <NativeSelectOption key={option.id} value={option.id}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="store-currency">Currency</Label>
          <NativeSelect id="store-currency" className="w-full" {...register("currency")}>
            {StoreCurrencyFormOptions.map((option) => (
              <NativeSelectOption key={option.id} value={option.id}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="store-timezone">Timezone</Label>
        <NativeSelect id="store-timezone" className="w-full" {...register("timezone")}>
          {getStoreTimezoneOptions(store.timezone).map((option) => (
            <NativeSelectOption key={option.id} value={option.id}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="store-address">Address</Label>
        <Input id="store-address" placeholder="Street address" {...register("address_line")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="store-city">City</Label>
          <Input id="store-city" {...register("city")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="store-country">Country</Label>
          <Input id="store-country" {...register("country")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="store-postal">Postal code</Label>
          <Input id="store-postal" {...register("postal_code")} />
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
