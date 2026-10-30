"use client";

import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsStepNav } from "../../components/settings-step-nav";
import {
  BrandingColorFields,
  BrandingMessageFields,
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
} from "./branding-fields";
import { BrandingImagePickers } from "./branding-image-pickers";
import { useStore, useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const BrandingSettingsForm: FC = () => {
  const { store: workspaceStore, isPending } = useWorkspace();
  const storeDetailQuery = useStore(workspaceStore?.id ?? "");
  const store = storeDetailQuery.data ?? workspaceStore;
  const updateStore = useUpdateStore();

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_SECONDARY_COLOR);
  const [welcomeMessage, setWelcomeMessage] = useState<Record<string, string>>(
    {},
  );
  const [thankYouMessage, setThankYouMessage] = useState<
    Record<string, string>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setPrimaryColor(store.primary_color?.trim() || DEFAULT_PRIMARY_COLOR);
    setSecondaryColor(store.secondary_color?.trim() || DEFAULT_SECONDARY_COLOR);
    setWelcomeMessage(store.welcome_message ?? {});
    setThankYouMessage(store.thank_you_message ?? {});
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const fieldLanguages = store.supported_languages.length
    ? store.supported_languages
    : [store.primary_language];

  const handleSave = async () => {
    await updateStore.mutateAsync({
      id: store.id,
      payload: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        welcome_message_translations: welcomeMessage,
        thank_you_message_translations: thankYouMessage,
      },
    });

    setHasChanges(false);
  };

  const updatePrimaryColor = (value: string) => {
    setPrimaryColor(value);
    setHasChanges(true);
  };
  const updateSecondaryColor = (value: string) => {
    setSecondaryColor(value);
    setHasChanges(true);
  };
  const updateWelcomeMessage = (value: Record<string, string>) => {
    setWelcomeMessage(value);
    setHasChanges(true);
  };
  const updateThankYouMessage = (value: Record<string, string>) => {
    setThankYouMessage(value);
    setHasChanges(true);
  };

  return (
    <div className="@container max-w-2xl space-y-5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Branding</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          What customers see on your public tip page.
        </p>
      </div>

      <BrandingImagePickers store={store} />

      <BrandingColorFields
        primary={primaryColor}
        secondary={secondaryColor}
        onPrimaryChange={updatePrimaryColor}
        onSecondaryChange={updateSecondaryColor}
      />

      <BrandingMessageFields
        storeId={store.id}
        storeName={store.name}
        languages={fieldLanguages}
        primaryLanguage={store.primary_language}
        welcome={welcomeMessage}
        thankYou={thankYouMessage}
        onWelcomeChange={updateWelcomeMessage}
        onThankYouChange={updateThankYouMessage}
      />

      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-1">
        <SettingsStepNav />
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={updateStore.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal"
        >
          {updateStore.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
