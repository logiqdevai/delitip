"use client";

import { type FC, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SettingsStepNav } from "../../components/settings-step-nav";
import { ReviewRedirectFields } from "./review-redirect-fields";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";

export const ReviewRedirectSettingsForm: FC = () => {
  const { store, isPending } = useWorkspace();
  const updateStore = useUpdateStore();

  const [loadedStoreId, setLoadedStoreId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [threshold, setThreshold] = useState<number>(4);
  const [hasChanges, setHasChanges] = useState(false);

  if (store && store.id !== loadedStoreId) {
    setLoadedStoreId(store.id);
    setRedirectUrl(store.public_review_redirect_url ?? "");
    setThreshold(store.public_review_rating_threshold ?? 4);
    setHasChanges(false);
  }

  useUnsavedChangesWarning(hasChanges);

  const updateRedirectUrl = (value: string) => {
    setRedirectUrl(value);
    setHasChanges(true);
  };

  const updateThreshold = (value: number) => {
    setThreshold(value);
    setHasChanges(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!store) return;
    updateStore.mutate(
      {
        id: store.id,
        payload: {
          public_review_redirect_url: redirectUrl.trim() || undefined,
          public_review_rating_threshold: threshold,
        },
      },
      { onSuccess: () => setHasChanges(false) },
    );
  };

  if (isPending) {
    return <Skeleton className="h-56 max-w-2xl rounded-2xl" />;
  }

  if (!store) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs"
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Public review redirect
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Customers who rate you at or above this threshold are prompted to
          share feedback on an external site such as Google.
        </p>
      </div>

      <ReviewRedirectFields
        threshold={threshold}
        onThresholdChange={updateThreshold}
        redirectUrl={redirectUrl}
        onRedirectUrlChange={updateRedirectUrl}
      />

      <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-2">
        <SettingsStepNav />
        <Button
          type="submit"
          disabled={updateStore.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal"
        >
          {updateStore.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
