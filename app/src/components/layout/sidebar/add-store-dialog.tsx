"use client";

import { type FC, useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@/lib/i18n-zod-resolver";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ActionButtonWithPending } from "@/components/ui/action-button-with-pending";
import {
  AddressAutocomplete,
  type ParsedAddress,
} from "@/components/ui/address-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryPicker } from "@/components/ui/country-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  getCountryCodeByName,
  getCountryStorageName,
} from "@/config/constants/dropdowns/shared/country.options";
import { StoreCopyFormOptions } from "@/config/constants/dropdowns/stores/store-copy-options.options";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { getBrowserTimezone } from "@/config/constants/dropdowns/stores/store-timezone-form.options";
import {
  useDropdownDescription,
  useDropdownLabel,
  useDropdownOptions,
} from "@/hooks/use-dropdown-options";
import { useCreateStore } from "@/features/stores/hooks/use-stores";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import {
  StoreCopyOptions,
  StoreIndustries,
} from "@/features/stores/interfaces/stores.interfaces";
import {
  createStoreFormSchema,
  type CreateStoreFormData,
} from "@/features/stores/validation-schemas/stores.schema";

const NO_COPY_SOURCE = "none";

// Step 1 fields — validated before moving on to the copy-settings step.
const DETAILS_FIELDS = [
  "name",
  "industry",
  "address_line",
  "city",
  "country",
  "postal_code",
] as const;

type AddStoreStep = "details" | "copy";

const getDefaultValues = (sourceStoreId: string | undefined): CreateStoreFormData => ({
  name: "",
  industry: StoreIndustries.RESTAURANT,
  address_line: "",
  city: "",
  country: "",
  postal_code: "",
  copy_from_store_id: sourceStoreId ?? NO_COPY_SOURCE,
  copy_options: StoreCopyFormOptions.map((option) => option.id),
});

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  stores: Store[];
  // Preselected as the store to copy settings from.
  currentStore: Store | null;
  onCreated: (store: Store) => void;
}

export const AddStoreDialog: FC<AddStoreDialogProps> = ({
  open,
  onOpenChange,
  organizationId,
  stores,
  currentStore,
  onCreated,
}) => {
  const t = useTranslations("dashboard.shell.addStore");
  const industryOptions = useDropdownOptions(StoreIndustryFormOptions);
  const optionLabel = useDropdownLabel();
  const optionDescription = useDropdownDescription();
  const createStore = useCreateStore(organizationId);
  const isPending = createStore.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateStoreFormData>({
    resolver: zodResolver(createStoreFormSchema),
    defaultValues: getDefaultValues(currentStore?.id),
  });

  const [step, setStep] = useState<AddStoreStep>("details");

  useEffect(() => {
    if (open) reset(getDefaultValues(currentStore?.id));
  }, [open, reset, currentStore?.id]);

  const handleOpenChange = (next: boolean) => {
    if (!next) setStep("details");
    onOpenChange(next);
  };

  const goToCopyStep = async () => {
    if (await trigger(DETAILS_FIELDS)) setStep("copy");
  };

  const isCopying =
    useWatch({ control, name: "copy_from_store_id" }) !== NO_COPY_SOURCE;

  const onSubmit = handleSubmit(async (values) => {
    const copyOptions = isCopying ? values.copy_options : [];
    const copiesLocalization = copyOptions.includes(StoreCopyOptions.LOCALIZATION);
    try {
      const store = await createStore.mutateAsync({
        name: values.name,
        industry: values.industry,
        timezone: copiesLocalization ? undefined : getBrowserTimezone(),
        address_line: values.address_line || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        postal_code: values.postal_code || undefined,
        full_address: values.full_address,
        ...(copyOptions.length > 0
          ? {
              copy_from_store_id: values.copy_from_store_id,
              copy_options: copyOptions,
            }
          : {}),
      });
      onCreated(store);
      handleOpenChange(false);
    } catch {}
  });

  const copySourceItems = [
    { label: t("noCopy"), value: NO_COPY_SOURCE },
    ...stores.map((item) => ({ label: item.name, value: item.id })),
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isPending) return;
        handleOpenChange(next);
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-lg"
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
            {t("step", { current: step === "details" ? 1 : 2 })}
          </p>
          <DialogTitle>
            {step === "details" ? t("titleDetails") : t("titleCopy")}
          </DialogTitle>
          <DialogDescription>
            {step === "details"
              ? t("descriptionDetails")
              : t("descriptionCopy")}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            if (step === "copy") return onSubmit(event);
            event.preventDefault();
            void goToCopyStep();
          }}
          className="space-y-4"
          noValidate
        >
          {step === "details" ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="add-store-name">{t("name")}</Label>
                <Input
                  id="add-store-name"
                  placeholder={t("namePlaceholder")}
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-xs text-red-600">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-store-industry">{t("businessType")}</Label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select
                      items={industryOptions.map((option) => ({
                        label: option.label,
                        value: option.id,
                      }))}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="add-store-industry"
                        className="w-full"
                        aria-invalid={!!errors.industry}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {industryOptions.map((option) => (
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
                <Label htmlFor="add-store-address">{t("address")}</Label>
                <Controller
                  name="address_line"
                  control={control}
                  render={({ field }) => (
                    <AddressAutocomplete
                      id="add-store-address"
                      autoComplete="street-address"
                      placeholder={t("addressPlaceholder")}
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
                  <Label htmlFor="add-store-city">{t("city")}</Label>
                  <Input
                    id="add-store-city"
                    placeholder={t("cityPlaceholder")}
                    {...register("city")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="add-store-country">{t("country")}</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <CountryPicker
                        id="add-store-country"
                        className="w-full"
                        value={getCountryCodeByName(field.value) ?? null}
                        onValueChange={(code) =>
                          field.onChange(code ? getCountryStorageName(code) : "")
                        }
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="add-store-postal">{t("postalCode")}</Label>
                  <Input
                    id="add-store-postal"
                    placeholder={t("postalCodePlaceholder")}
                    {...register("postal_code")}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-store-copy-source">{t("copyFrom")}</Label>
                <Controller
                  name="copy_from_store_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      items={copySourceItems}
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? NO_COPY_SOURCE)}
                    >
                      <SelectTrigger id="add-store-copy-source" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {copySourceItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {isCopying ? (
                <>
                  <Controller
                    name="copy_options"
                    control={control}
                    render={({ field }) => (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {StoreCopyFormOptions.map((option) => (
                          <label
                            key={option.id}
                            className="flex cursor-pointer items-start gap-2.5 rounded-lg px-1 py-1.5"
                          >
                            <Checkbox
                              className="mt-0.5"
                              checked={field.value.includes(option.id)}
                              onCheckedChange={(next) =>
                                field.onChange(
                                  next === true
                                    ? [...field.value, option.id]
                                    : field.value.filter((id) => id !== option.id),
                                )
                              }
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-ink-charcoal">
                                {optionLabel(StoreCopyFormOptions, option.id)}
                              </span>
                              <span className="block text-xs text-zinc-500">
                                {optionDescription(
                                  StoreCopyFormOptions,
                                  option.id,
                                )}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  />
                  <p className="text-xs text-zinc-500">
                    {t("neverCopied")}
                  </p>
                </>
              ) : null}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            {step === "details" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("next")}
                  <ArrowRight data-icon="inline-end" className="size-3.5" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setStep("details")}
                >
                  <ArrowLeft data-icon="inline-start" className="size-3.5" />
                  {t("back")}
                </Button>
                <ActionButtonWithPending type="submit" isPending={isPending}>
                  {t("submit")}
                </ActionButtonWithPending>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
