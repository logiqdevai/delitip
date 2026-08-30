"use client";

import { type FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { MultilingualLanguageControl } from "@/components/ui/multilingual-language-control";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface MultilingualInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "defaultValue"
  > {
  storeId: string;
  /** Languages the value can currently be switched to. */
  languages: Language[];
  /** Language shown by default when the field first mounts. */
  primaryLanguage: Language;
  /** Map of lowercase language code -> text. */
  value: Record<string, string>;
  onValueChange: (value: Record<string, string>) => void;
  invalid?: boolean;
}

export const MultilingualInput: FC<MultilingualInputProps> = ({
  storeId,
  languages,
  primaryLanguage,
  value,
  onValueChange,
  invalid,
  className,
  ...props
}) => {
  const [activeLanguage, setActiveLanguage] = useState<Language>(primaryLanguage);
  const key = activeLanguage.toLowerCase();
  const text = value[key] ?? "";

  return (
    <div className="relative">
      <Input
        value={text}
        onChange={(event) =>
          onValueChange({ ...value, [key]: event.target.value })
        }
        aria-invalid={invalid || undefined}
        className={cn("pr-11", className)}
        {...props}
      />
      <MultilingualLanguageControl
        storeId={storeId}
        primaryLanguage={primaryLanguage}
        supportedLanguages={languages}
        activeLanguage={activeLanguage}
        onActiveLanguageChange={setActiveLanguage}
        className="absolute top-1/2 right-1 -translate-y-1/2"
      />
    </div>
  );
};
