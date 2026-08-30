"use client";

import { type FC, useState } from "react";
import { Check, ChevronLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CountryFlag } from "@/components/ui/country-flag";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StoreLanguageFormOptions } from "@/config/constants/dropdowns/stores/store-language-form.options";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";
import { cn } from "@/lib/utils";

interface MultilingualLanguageControlProps {
  storeId: string;
  primaryLanguage: Language;
  /** Languages this field can currently be switched to. */
  supportedLanguages: Language[];
  activeLanguage: Language;
  onActiveLanguageChange: (language: Language) => void;
  className?: string;
}

/** The language-picker slot for a multilingual field. Lets the user switch
 * which language they're editing, and add more supported languages inline
 * (via the store) without leaving the form. */
export const MultilingualLanguageControl: FC<
  MultilingualLanguageControlProps
> = ({
  storeId,
  primaryLanguage,
  supportedLanguages,
  activeLanguage,
  onActiveLanguageChange,
  className,
}) => {
  const updateStore = useUpdateStore();
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setManaging(false);
  };

  const activeOption = StoreLanguageFormOptions.find(
    (option) => option.id === activeLanguage,
  );

  const toggleLanguage = (language: Language) => {
    if (language === primaryLanguage) return;
    const next = supportedLanguages.includes(language)
      ? supportedLanguages.filter((item) => item !== language)
      : [...supportedLanguages, language];
    updateStore.mutate({ id: storeId, payload: { supported_languages: next } });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "gap-1 text-zinc-500 hover:text-zinc-700",
          className,
        )}
        aria-label="Language"
      >
        {activeOption ? (
          <CountryFlag countryCode={activeOption.flagCountryCode} />
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {managing ? (
          <>
            <p className="px-1.5 pt-1 pb-1.5 text-[11px] font-semibold text-zinc-500">
              Supported languages
            </p>
            <div className="max-h-40 space-y-0.5 overflow-y-auto">
              {StoreLanguageFormOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-zinc-50"
                >
                  <Checkbox
                    checked={
                      option.id === primaryLanguage ||
                      supportedLanguages.includes(option.id)
                    }
                    onCheckedChange={() => toggleLanguage(option.id)}
                    disabled={
                      option.id === primaryLanguage || updateStore.isPending
                    }
                  />
                  <CountryFlag countryCode={option.flagCountryCode} />
                  {option.label}
                </label>
              ))}
            </div>
            <button
              type="button"
              className="mt-0.5 flex w-full items-center gap-1.5 border-t border-zinc-100 px-1.5 pt-1 pb-0.5 text-xs text-zinc-500 hover:text-zinc-700"
              onClick={() => setManaging(false)}
            >
              <ChevronLeft className="size-3.5" />
              Back
            </button>
          </>
        ) : (
          <>
            <div className="max-h-40 space-y-0.5 overflow-y-auto">
              {supportedLanguages.map((language) => {
                const option = StoreLanguageFormOptions.find(
                  (item) => item.id === language,
                );
                if (!option) return null;
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      onActiveLanguageChange(language);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-xs hover:bg-zinc-50",
                      language === activeLanguage && "bg-zinc-50 font-medium",
                    )}
                  >
                    <CountryFlag countryCode={option.flagCountryCode} />
                    {option.label}
                    {language === activeLanguage ? (
                      <Check className="ml-auto size-3.5" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="mt-0.5 flex w-full items-center gap-1.5 border-t border-zinc-100 px-1.5 pt-1 pb-0.5 text-xs text-zinc-500 hover:text-zinc-700"
              onClick={() => setManaging(true)}
            >
              <Plus className="size-3.5" />
              Add languages
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
