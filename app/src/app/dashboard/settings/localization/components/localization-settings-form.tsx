"use client";

import { type FC, useState } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useUpdateStore,
  useUpdateStoreTranslation,
} from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import {
  StoreTranslatableFields,
  type Language,
} from "@/features/stores/interfaces/stores.interfaces";
import { StoreLanguageFormOptions } from "@/config/constants/dropdowns/stores/store-language-form.options";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

const getLanguageLabel = (language: Language): string =>
  StoreLanguageFormOptions.find((option) => option.id === language)?.label ??
  language;

const TranslationRow: FC<{
  storeId: string;
  language: Language;
  initialWelcome: string;
  initialThankYou: string;
}> = ({ storeId, language, initialWelcome, initialThankYou }) => {
  const updateTranslation = useUpdateStoreTranslation();
  const [welcome, setWelcome] = useState(initialWelcome);
  const [thankYou, setThankYou] = useState(initialThankYou);
  const dirty = welcome !== initialWelcome || thankYou !== initialThankYou;

  const handleSave = async () => {
    if (welcome !== initialWelcome) {
      await updateTranslation.mutateAsync({
        id: storeId,
        field: StoreTranslatableFields.WELCOME_MESSAGE,
        payload: { language, text: welcome },
      });
    }
    if (thankYou !== initialThankYou) {
      await updateTranslation.mutateAsync({
        id: storeId,
        field: StoreTranslatableFields.THANK_YOU_MESSAGE,
        payload: { language, text: thankYou },
      });
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-zinc-200/80 p-3">
      <p className="text-xs font-bold text-ink-charcoal">
        {getLanguageLabel(language)}
      </p>
      <div className="space-y-1">
        <Label className="text-[11px] text-zinc-500">Welcome message</Label>
        <Textarea
          rows={2}
          placeholder="Welcome message in this language"
          value={welcome}
          onChange={(event) => setWelcome(event.target.value)}
          className="text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[11px] text-zinc-500">Thank-you message</Label>
        <Textarea
          rows={2}
          placeholder="Thank-you message in this language"
          value={thankYou}
          onChange={(event) => setThankYou(event.target.value)}
          className="text-xs"
        />
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!dirty || updateTranslation.isPending}
        onClick={() => void handleSave()}
      >
        {updateTranslation.isPending ? "Saving…" : "Save"}
      </Button>
    </div>
  );
};

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
      { onSuccess: () => setHasChanges(false) },
    );
  };

  const otherLanguages = store.supported_languages.filter(
    (language) => language !== store.primary_language,
  );

  return (
    <div className="@container max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <Globe className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">Localization</h2>
      </div>
      <p className="text-xs text-zinc-500">
        The primary language is what you type your branding text in; content
        is auto-translated into every supported language.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="primary-language">Primary language</Label>
        <Select
          items={StoreLanguageFormOptions.map((option) => ({
            label: option.label,
            value: option.id,
          }))}
          value={primaryLanguage}
          onValueChange={(value) => {
            if (value) updatePrimaryLanguage(value as Language);
          }}
        >
          <SelectTrigger id="primary-language" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {StoreLanguageFormOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] text-amber-800">
        A customer-facing language switcher on the tip flow itself isn&apos;t
        built yet — that needs full UI copy translated for every string on{" "}
        <code>/{"{storeSlug}"}/q/{"{code}"}</code>, which doesn&apos;t exist
        in this codebase yet. This only configures which languages the Store
        supports.
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

      {otherLanguages.length > 0 ? (
        <div className="space-y-3 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-xs font-bold text-ink-charcoal">
              Per-language messages
            </p>
            <p className="text-[11px] text-zinc-500">
              Welcome/thank-you messages start as a copy of your primary
              language. Hand-edit each supported language here so the tip
              flow shows real, correct text once a switcher exists.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 @md:grid-cols-2">
            {otherLanguages.map((language) => (
              <TranslationRow
                key={language}
                storeId={store.id}
                language={language}
                initialWelcome={
                  store.welcome_message?.[language.toLowerCase()] ?? ""
                }
                initialThankYou={
                  store.thank_you_message?.[language.toLowerCase()] ?? ""
                }
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};
