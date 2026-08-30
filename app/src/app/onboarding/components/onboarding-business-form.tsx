"use client";

import { type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import { Button } from "@/components/ui/button";
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
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { StoreCurrencyFormOptions } from "@/config/constants/dropdowns/stores/store-currency-form.options";
import { getStoreTimezoneOptions } from "@/config/constants/dropdowns/stores/store-timezone-form.options";
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
  canSkip: boolean;
  onCompleted: () => void;
  onSkip: () => void;
}

export const OnboardingBusinessForm: FC<OnboardingBusinessFormProps> = ({
  defaultValues,
  context,
  canSkip,
  onCompleted,
  onSkip,
}) => {
  const completeSetup = useCompleteBusinessSetup();
  const timezoneOptions = getStoreTimezoneOptions(defaultValues.timezone);

  const {
    register,
    control,
    handleSubmit,
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-timezone">Timezone</Label>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select
                  items={timezoneOptions.map((option) => ({
                    label: option.label,
                    value: option.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="onboarding-timezone"
                    className="w-full"
                    aria-invalid={!!errors.timezone}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timezoneOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.timezone ? (
              <p className="text-xs text-red-600">{errors.timezone.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="onboarding-currency">Currency</Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select
                  items={StoreCurrencyFormOptions.map((option) => ({
                    label: option.label,
                    value: option.id,
                  }))}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="onboarding-currency"
                    className="w-full"
                    aria-invalid={!!errors.currency}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {StoreCurrencyFormOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currency ? (
              <p className="text-xs text-red-600">{errors.currency.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="onboarding-address">
            Address <span className="font-normal text-zinc-400">(optional)</span>
          </Label>
          <Input
            id="onboarding-address"
            autoComplete="street-address"
            placeholder="Street, city"
            aria-invalid={!!errors.address_line}
            {...register("address_line")}
          />
          {errors.address_line ? (
            <p className="text-xs text-red-600">{errors.address_line.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <ActionButtonWithPending
            type="submit"
            isPending={completeSetup.isPending}
            className="h-10 flex-1 rounded-xl bg-electric-lime text-ink-charcoal shadow-lg shadow-electric-lime/30 hover:bg-brand-700"
          >
            Save and continue
            <ArrowRight data-icon="inline-end" className="size-3.5" />
          </ActionButtonWithPending>
          {canSkip ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-zinc-600"
              disabled={completeSetup.isPending}
              onClick={onSkip}
            >
              Skip to dashboard
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
};
