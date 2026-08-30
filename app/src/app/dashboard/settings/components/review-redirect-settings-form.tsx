"use client";

import { type FC, type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateStore } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { cn } from "@/lib/utils";

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

const fieldClassName =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/40 p-2.5 text-xs font-medium text-ink-charcoal focus:ring-2 focus:ring-electric-lime focus:outline-none";

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
      className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs"
    >
      <div>
        <h2 className="text-sm font-bold text-ink-charcoal">
          Public review redirect
        </h2>
        <p className="mt-0.5 text-xs text-zinc-500">
          Customers who rate you at or above this threshold are prompted to
          share their review publicly. Below it, they&apos;re guided to
          private feedback instead.
        </p>
      </div>

      <div>
        <label
          htmlFor="rating-threshold"
          className="mb-1 block text-xs font-semibold text-zinc-700"
        >
          Public prompt threshold
        </label>
        <Select
          items={RATING_OPTIONS.map((rating) => ({
            label: `${rating}+ stars`,
            value: String(rating),
          }))}
          value={String(threshold)}
          onValueChange={(value) => updateThreshold(Number(value))}
        >
          <SelectTrigger id="rating-threshold" className={cn(fieldClassName, "w-full")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {RATING_OPTIONS.map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating}+ stars
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="redirect-url"
          className="mb-1 block text-xs font-semibold text-zinc-700"
        >
          Public review link (e.g. Google Business Profile)
        </label>
        <input
          id="redirect-url"
          type="url"
          placeholder="https://g.page/r/your-business/review"
          value={redirectUrl}
          onChange={(event) => updateRedirectUrl(event.target.value)}
          className={fieldClassName}
        />
        <p className="mt-1 text-[11px] text-zinc-400">
          Leave blank to skip the public redirect — high-rated customers still
          see a thank-you, just without an outbound link.
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={updateStore.isPending}
          className="rounded-xl bg-electric-lime px-4 text-chip font-semibold text-ink-charcoal hover:bg-brand-700"
        >
          {updateStore.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
