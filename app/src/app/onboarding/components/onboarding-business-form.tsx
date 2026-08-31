"use client";

import { type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
  AddressAutocomplete,
  type ParsedAddress,
} from "@/components/ui/address-autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryPicker } from "@/components/ui/country-picker";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { TeamSizeFormOptions } from "@/config/constants/dropdowns/businesses/team-size-form.options";
import {
  getCountryCodeByName,
  getCountryLabel,
} from "@/config/constants/dropdowns/shared/country.options";
import type { BusinessSetupContext } from "@/features/organizations/hooks/use-organizations";
import { useCompleteBusinessSetup } from "@/features/organizations/hooks/use-organizations";
import {
  businessSetupSchema,
  type BusinessSetupFormData,
} from "@/features/stores/validation-schemas/stores.schema";
import { Currencies } from "@/features/stores/interfaces/stores.interfaces";

interface OnboardingBusinessFormProps {
  defaultValues: BusinessSetupFormData;
  context: BusinessSetupContext;
  onCompleted: () => void;
}

export const OnboardingBusinessForm: FC<OnboardingBusinessFormProps> = ({
  defaultValues,
  context,
  onCompleted,
}) => {
  const completeSetup = useCompleteBusinessSetup();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BusinessSetupFormData>({
    resolver: zodResolver(businessSetupSchema),
    defaultValues: {
      ...defaultValues,
      currency: defaultValues.currency || Currencies.EUR,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await completeSetup.mutateAsync({ values, context });
      onCompleted();
    } catch {}
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          Business profile
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink-charcoal">
          Set up your business
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Tell us about your venue so customers and staff land in the right
          place.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="onboarding-name">Business name</Label>
          <Input
            id="onboarding-name"
            autoComplete="organization"
            placeholder="e.g. Artisan Café & Bar"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-industry">Business type</Label>
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
                  <SelectTrigger
                    id="onboarding-industry"
                    className="w-full"
                    aria-invalid={!!errors.industry}
                  >
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
            {errors.industry ? (
              <p className="text-xs text-red-600">{errors.industry.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-team-size">Estimated team size</Label>
            <Controller
              name="teamSize"
              control={control}
              render={({ field }) => (
                <Select
                  items={TeamSizeFormOptions.map((option) => ({
                    label: option.label,
                    value: option.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="onboarding-team-size"
                    className="w-full"
                    aria-invalid={!!errors.teamSize}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TeamSizeFormOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.teamSize ? (
              <p className="text-xs text-red-600">{errors.teamSize.message}</p>
            ) : null}
          </div>
        </div>

        <input type="hidden" {...register("timezone")} />
        <input type="hidden" {...register("currency")} />

        <div className="space-y-1.5">
          <Label htmlFor="onboarding-address">
            Address <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Controller
            name="address_line"
            control={control}
            render={({ field }) => (
              <AddressAutocomplete
                id="onboarding-address"
                autoComplete="street-address"
                placeholder="Street, city"
                aria-invalid={!!errors.address_line}
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
          {errors.address_line ? (
            <p className="text-xs text-red-600">{errors.address_line.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-city">City</Label>
            <Input id="onboarding-city" placeholder="City" {...register("city")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-country">Country</Label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <CountryPicker
                  id="onboarding-country"
                  className="w-full"
                  value={getCountryCodeByName(field.value) ?? null}
                  onValueChange={(code) =>
                    field.onChange(code ? getCountryLabel(code) : "")
                  }
                />
              )}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-1">
            <Label htmlFor="onboarding-postal">Postal code</Label>
            <Input
              id="onboarding-postal"
              placeholder="Postal code"
              {...register("postal_code")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <ActionButtonWithPending
            type="submit"
            isPending={completeSetup.isPending}
            className="flex-1 rounded-xl bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/30 hover:bg-brand-700"
          >
            Save and continue
            <ArrowRight data-icon="inline-end" className="size-3.5" />
          </ActionButtonWithPending>
        </div>
      </form>
    </div>
  );
};
