"use client";

import { type FC, useId } from "react";
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
  CountryOptions,
  getCountryLabel,
} from "@/config/constants/dropdowns/shared/country.options";

const countryCodes: string[] = CountryOptions.map((option) => option.id);

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
  placeholder = "Select country",
  disabled = false,
  invalid = false,
  id: idProp,
  className,
  "aria-label": ariaLabel,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  return (
    <Combobox
      items={countryCodes}
      value={value ?? null}
      onValueChange={(next) => onValueChange((next as string | null) ?? null)}
      itemToStringLabel={(code: string) => getCountryLabel(code)}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
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
              {getCountryLabel(code)}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No countries found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
};
