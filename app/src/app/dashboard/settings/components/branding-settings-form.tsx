"use client";

import { type FC, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useUploadDocument } from "@/features/documents/hooks/use-documents";
import { DocumentTypes } from "@/features/documents/interfaces/documents.interfaces";
import { useStore, useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

const ImageUploadField: FC<{
  label: string;
  currentUrl?: string | null;
  onUploaded: (documentId: string) => void;
}> = ({ label, currentUrl, onUploaded }) => {
  const uploadDocument = useUploadDocument();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt=""
            className="size-14 rounded-xl border border-zinc-200 object-cover"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-zinc-300">
            <ImagePlus className="size-5" strokeWidth={2} />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            uploadDocument.mutate(
              { file, type: DocumentTypes.LOGO },
              { onSuccess: (document) => onUploaded(document.id) },
            );
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploadDocument.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {uploadDocument.isPending ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export const BrandingSettingsForm: FC = () => {
  const { store: workspaceStore, isPending } = useWorkspace();
  const storeDetailQuery = useStore(workspaceStore?.id ?? "");
  const store = storeDetailQuery.data ?? workspaceStore;
  const updateStore = useUpdateStore();

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#84cc16");
  const [secondaryColor, setSecondaryColor] = useState("#18181b");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setPrimaryColor(store.primary_color?.trim() || "#84cc16");
    setSecondaryColor(store.secondary_color?.trim() || "#18181b");
    setWelcomeMessage(store.welcome_message?.[store.primary_language] ?? "");
    setThankYouMessage(store.thank_you_message?.[store.primary_language] ?? "");
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  if (isPending) {
    return <Skeleton className="h-96 max-w-2xl rounded-2xl" />;
  }

  if (!store) return null;

  const handleSave = () => {
    updateStore.mutate(
      {
        id: store.id,
        payload: {
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          welcome_message: welcomeMessage || undefined,
          thank_you_message: thankYouMessage || undefined,
        },
      },
      { onSuccess: () => setHasChanges(false) },
    );
  };

  const updatePrimaryColor = (value: string) => {
    setPrimaryColor(value);
    setHasChanges(true);
  };
  const updateSecondaryColor = (value: string) => {
    setSecondaryColor(value);
    setHasChanges(true);
  };
  const updateWelcomeMessage = (value: string) => {
    setWelcomeMessage(value);
    setHasChanges(true);
  };
  const updateThankYouMessage = (value: string) => {
    setThankYouMessage(value);
    setHasChanges(true);
  };

  return (
    <div className="max-w-2xl space-y-5 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">Branding</h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          What customers see on your public tip page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploadField
          label="Logo"
          currentUrl={store.logo_document?.url}
          onUploaded={(documentId) =>
            updateStore.mutate({ id: store.id, payload: { logo_document_id: documentId } })
          }
        />
        <ImageUploadField
          label="Cover image"
          currentUrl={store.cover_document?.url}
          onUploaded={(documentId) =>
            updateStore.mutate({ id: store.id, payload: { cover_document_id: documentId } })
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="primary-color">Primary color</Label>
          <div className="flex items-center gap-2">
            <input
              id="primary-color"
              type="color"
              value={primaryColor}
              onChange={(event) => updatePrimaryColor(event.target.value)}
              className="size-9 shrink-0 cursor-pointer rounded-lg border border-zinc-200"
            />
            <Input value={primaryColor} onChange={(event) => updatePrimaryColor(event.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="secondary-color">Secondary color</Label>
          <div className="flex items-center gap-2">
            <input
              id="secondary-color"
              type="color"
              value={secondaryColor}
              onChange={(event) => updateSecondaryColor(event.target.value)}
              className="size-9 shrink-0 cursor-pointer rounded-lg border border-zinc-200"
            />
            <Input value={secondaryColor} onChange={(event) => updateSecondaryColor(event.target.value)} />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="welcome-message">Welcome message</Label>
        <Textarea
          id="welcome-message"
          rows={2}
          value={welcomeMessage}
          onChange={(event) => updateWelcomeMessage(event.target.value)}
          placeholder={`Welcome to ${store.name}. Leave a tip for great service.`}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thank-you-message">Thank-you message</Label>
        <Textarea
          id="thank-you-message"
          rows={2}
          value={thankYouMessage}
          onChange={(event) => updateThankYouMessage(event.target.value)}
          placeholder="Thank you! Your tip means a lot to our team."
        />
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
