"use client";

import { type FC, useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CountryFlag } from "@/components/ui/country-flag";
import { LanguagePicker } from "@/components/ui/language-picker";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import type { Language } from "@/features/stores/interfaces/stores.interfaces";
import { StoreLanguageFormOptions } from "@/config/constants/dropdowns/stores/store-language-form.options";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const LocalizationSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [primaryLanguage, setPrimaryLanguage] = useState<Language>("EN");
  const [supportedLanguages, setSupportedLanguages] = useState<Language[]>(["EN"]);
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setPrimaryLanguage(store.primary_language);
    setSupportedLanguages(
      store.supported_languages.length ? store.supported_languages : [store.primary_language],
    );
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  if (isPending) {
    return <Skeleton className="h-64 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const updatePrimaryLanguage = (language: Language) => {
    setPrimaryLanguage(language);
    setHasChanges(true);
  };

  const toggleSupported = (language: Language) => {
    setSupportedLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language],
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    const supported = supportedLanguages.includes(primaryLanguage)
      ? supportedLanguages
      : [...supportedLanguages, primaryLanguage];

    updateStore.mutate(
      {
        id: store.id,
        payload: {
          primary_language: primaryLanguage,
          supported_languages: supported,
        },
      },
      {
        onSuccess: () => {
          setSupportedLanguages(supported);
          setHasChanges(false);
        },
      },
    );
  };

  return (
    <div className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <Globe className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">Localization</h2>
      </div>
      <p className="text-xs text-zinc-500">
        The primary language is what you type your branding text in.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="primary-language">Primary language</Label>
        <LanguagePicker
          id="primary-language"
          className="w-full"
          value={primaryLanguage}
          onValueChange={updatePrimaryLanguage}
        />
      </div>

      <div className="space-y-2">
        <Label>Supported languages</Label>
        <div className="grid grid-cols-1 gap-2 @xs:grid-cols-2 @md:grid-cols-3">
          {StoreLanguageFormOptions.map((option) => (
            <label key={option.id} className="flex min-w-0 items-center gap-2 text-xs">
              <Checkbox
                checked={supportedLanguages.includes(option.id)}
                onCheckedChange={() => toggleSupported(option.id)}
                disabled={option.id === primaryLanguage}
              />
              <CountryFlag countryCode={option.flagCountryCode} />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <Button
          type="button"
          onClick={handleSave}
          disabled={updateStore.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal hover:bg-brand-700"
        >
          {updateStore.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
