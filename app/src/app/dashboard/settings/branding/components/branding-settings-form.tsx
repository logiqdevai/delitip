"use client";

import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import { ImagePicker } from "@/components/ui/image-picker";
import { Label } from "@/components/ui/label";
import { MultilingualTextarea } from "@/components/ui/multilingual-textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeleteDocument,
  useUploadDocument,
} from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import {
  useStore,
  useUpdateStore,
  useUpdateStoreTranslation,
} from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { StoreTranslatableFields } from "@/features/stores/interfaces/stores.interfaces";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const BrandingSettingsForm: FC = () => {
  const { store: workspaceStore, isPending } = useWorkspace();
  const storeDetailQuery = useStore(workspaceStore?.id ?? "");
  const store = storeDetailQuery.data ?? workspaceStore;
  const updateStore = useUpdateStore();
  const updateTranslation = useUpdateStoreTranslation();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();
  const [uploadingMode, setUploadingMode] = useState<"logo" | "cover" | null>(
    null,
  );

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#84cc16");
  const [secondaryColor, setSecondaryColor] = useState("#18181b");
  const [welcomeMessage, setWelcomeMessage] = useState<Record<string, string>>(
    {},
  );
  const [thankYouMessage, setThankYouMessage] = useState<
    Record<string, string>
  >({});
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setPrimaryColor(store.primary_color?.trim() || "#84cc16");
    setSecondaryColor(store.secondary_color?.trim() || "#18181b");
    setWelcomeMessage(store.welcome_message ?? {});
    setThankYouMessage(store.thank_you_message ?? {});
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const primaryKey = store.primary_language.toLowerCase();
  const fieldLanguages = store.supported_languages.length
    ? store.supported_languages
    : [store.primary_language];
  const otherLanguages = fieldLanguages.filter(
    (language) => language !== store.primary_language,
  );

  const handleSave = async () => {
    await updateStore.mutateAsync({
      id: store.id,
      payload: {
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        welcome_message: welcomeMessage[primaryKey] || undefined,
        thank_you_message: thankYouMessage[primaryKey] || undefined,
      },
    });

    await Promise.all(
      otherLanguages.flatMap((language) => {
        const key = language.toLowerCase();
        const calls: Promise<unknown>[] = [];
        const welcomeText = welcomeMessage[key]?.trim() ?? "";
        const thankYouText = thankYouMessage[key]?.trim() ?? "";
        // The translation endpoint rejects empty text, and clearing a
        // translation back to blank isn't a case we support here — only
        // send the ones the user actually filled in and changed.
        if (welcomeText && welcomeText !== (store.welcome_message?.[key] ?? "")) {
          calls.push(
            updateTranslation.mutateAsync({
              id: store.id,
              field: StoreTranslatableFields.WELCOME_MESSAGE,
              payload: { language, text: welcomeText },
            }),
          );
        }
        if (
          thankYouText &&
          thankYouText !== (store.thank_you_message?.[key] ?? "")
        ) {
          calls.push(
            updateTranslation.mutateAsync({
              id: store.id,
              field: StoreTranslatableFields.THANK_YOU_MESSAGE,
              payload: { language, text: thankYouText },
            }),
          );
        }
        return calls;
      }),
    );

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
    <div className="@container max-w-2xl space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Branding</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          What customers see on your public tip page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
        <ImagePicker
          mode="logo"
          value={store.logo_document?.url}
          isPending={uploadingMode === "logo"}
          disabled={deleteDocument.isPending || updateStore.isPending}
          onChange={(file) => {
            setUploadingMode("logo");
            uploadDocument.mutate(
              { file, type: DocumentTypes.LOGO },
              {
                onSuccess: (document) =>
                  updateStore.mutate({
                    id: store.id,
                    payload: { logo_document_id: document.id },
                  }),
                onSettled: () => setUploadingMode(null),
              },
            );
          }}
          onClear={
            store.logo_document_id
              ? () =>
                  deleteDocument.mutate(store.logo_document_id!, {
                    onSuccess: () =>
                      updateStore.mutate({
                        id: store.id,
                        payload: { logo_document_id: null },
                      }),
                  })
              : undefined
          }
        />
        <ImagePicker
          mode="cover"
          value={store.cover_document?.url}
          isPending={uploadingMode === "cover"}
          disabled={deleteDocument.isPending || updateStore.isPending}
          onChange={(file) => {
            setUploadingMode("cover");
            uploadDocument.mutate(
              { file, type: DocumentTypes.BANNER },
              {
                onSuccess: (document) =>
                  updateStore.mutate({
                    id: store.id,
                    payload: { cover_document_id: document.id },
                  }),
                onSettled: () => setUploadingMode(null),
              },
            );
          }}
          onClear={
            store.cover_document_id
              ? () =>
                  deleteDocument.mutate(store.cover_document_id!, {
                    onSuccess: () =>
                      updateStore.mutate({
                        id: store.id,
                        payload: { cover_document_id: null },
                      }),
                  })
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2">
        <ColorPicker
          id="primary-color"
          label="Primary color"
          value={primaryColor}
          placeholder="#84cc16"
          onChange={updatePrimaryColor}
        />
        <ColorPicker
          id="secondary-color"
          label="Secondary color"
          value={secondaryColor}
          placeholder="#18181b"
          onChange={updateSecondaryColor}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="welcome-message">Welcome message</Label>
        <MultilingualTextarea
          id="welcome-message"
          storeId={store.id}
          rows={2}
          languages={fieldLanguages}
          primaryLanguage={store.primary_language}
          value={welcomeMessage}
          onValueChange={updateWelcomeMessage}
          placeholder={`Welcome to ${store.name}. Leave a tip for great service.`}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thank-you-message">Thank-you message</Label>
        <MultilingualTextarea
          id="thank-you-message"
          storeId={store.id}
          rows={2}
          languages={fieldLanguages}
          primaryLanguage={store.primary_language}
          value={thankYouMessage}
          onValueChange={updateThankYouMessage}
          placeholder="Thank you! Your tip means a lot to our team."
        />
      </div>

      <div className="pt-1">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={updateStore.isPending || updateTranslation.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal hover:bg-brand-700"
        >
          {updateStore.isPending || updateTranslation.isPending
            ? "Saving…"
            : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
