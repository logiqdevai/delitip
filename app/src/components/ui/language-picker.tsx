"use client";

import { type FC, useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryFlag } from "@/components/ui/country-flag";
import { StoreLanguageFormOptions } from "@/config/constants/dropdowns/stores/store-language-form.options";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface LanguagePickerProps {
  value: Language;
  onValueChange: (value: Language) => void;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  className?: string;
  size?: "sm" | "default";
  /** Renders the trigger as just a flag, no label — for mobile / compact layouts. */
  compact?: boolean;
  /** Restricts the option list to these languages. Defaults to every store language. */
  languages?: Language[];
  /** Which label to display: the English admin name (default) or the language's own native name. */
  labelSource?: "admin" | "native";
  "aria-label"?: string;
}

export const LanguagePicker: FC<LanguagePickerProps> = ({
  value,
  onValueChange,
  disabled = false,
  invalid = false,
  id: idProp,
  className,
  size = "default",
  compact = false,
  languages,
  labelSource = "admin",
  "aria-label": ariaLabel,
}) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const options = languages
    ? StoreLanguageFormOptions.filter((option) => languages.includes(option.id))
    : StoreLanguageFormOptions;
  const labelFor = (option: (typeof options)[number]) =>
    labelSource === "native" ? option.nativeLabel : option.label;

  return (
    <Select
      items={options.map((option) => ({
        label: labelFor(option),
        value: option.id,
      }))}
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as Language);
      }}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel ?? (compact ? "Language" : undefined)}
        className={cn(compact && "w-auto gap-1 px-2", className)}
      >
        <SelectValue>
          {(selected: Language | null) => {
            const option = options.find((item) => item.id === selected);
            if (!option) return null;
            return (
              <>
                <CountryFlag countryCode={option.flagCountryCode} />
                {compact ? null : labelFor(option)}
              </>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              <CountryFlag countryCode={option.flagCountryCode} />
              {labelFor(option)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
