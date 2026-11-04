"use client";

import { type FC, useId } from "react";
import { useTranslations } from "next-intl";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { CountryFlag } from "@/components/ui/country-flag";
import {
  useCountryName,
  useCountryOptions,
} from "@/hooks/use-country-options";

interface CountryPickerProps {
  value: string | null | undefined;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

export const CountryPicker: FC<CountryPickerProps> = ({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  invalid = false,
  id: idProp,
  className,
  "aria-label": ariaLabel,
}) => {
  const t = useTranslations("dashboard.shell.ui");
  const countryOptions = useCountryOptions();
  const countryName = useCountryName();
  const countryCodes = countryOptions.map((option) => option.id);
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Combobox
      items={countryCodes}
      value={value ?? null}
      onValueChange={(next) => onValueChange((next as string | null) ?? null)}
      itemToStringLabel={(code: string) => countryName(code)}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder ?? t("selectCountry")}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={className}
      >
        {value ? (
          <InputGroupAddon align="inline-start">
            <CountryFlag countryCode={value} />
          </InputGroupAddon>
        ) : null}
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxList>
          {(code: string) => (
            <ComboboxItem key={code} value={code}>
              <CountryFlag countryCode={code} />
              {countryName(code)}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>{t("noCountries")}</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
};
