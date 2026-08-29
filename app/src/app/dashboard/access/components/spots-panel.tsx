"use client";

import { type FC, type FormEvent, useState } from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import {
  useCreateSpot,
  useDeleteSpot,
  useSpots,
  useUpdateSpot,
} from "@/features/spots/hooks/use-spots";
import type { Spot } from "@/features/spots/interfaces/spots.interfaces";
import { cn } from "@/lib/utils";

export const SpotsPanel: FC<{ storeId: string }> = ({ storeId }) => {
  const spotsQuery = useSpots(storeId, { limit: 100 });
  const createSpot = useCreateSpot(storeId);
  const updateSpot = useUpdateSpot();
  const deleteSpot = useDeleteSpot();
  const deleteConfirm = useConfirmationDialog();
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Spot | null>(null);

  const spots = spotsQuery.data?.data ?? [];

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    createSpot.mutate(
      { name: trimmed },
      { onSuccess: () => setName("") },
    );
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">Spots</h2>
      </div>
      <p className="text-xs text-zinc-500">
        Physical locations (tables, rooms, counters) you can attach to a QR
        code.
      </p>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Table 12"
          className="h-8 flex-1 text-xs"
        />
        <Button
          type="submit"
          size="sm"
          disabled={createSpot.isPending || !name.trim()}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          Add
        </Button>
      </form>

      {spotsQuery.isPending ? (
        <Skeleton className="h-16 w-full rounded-xl" />
      ) : spots.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-center text-xs text-zinc-500">
          No spots yet.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {spots.map((spot) => (
            <li
              key={spot.id}
              className={cn(
                "flex items-center gap-1.5 rounded-full border py-1 pr-1.5 pl-3 text-xs",
                spot.is_active
                  ? "border-zinc-200 bg-white text-ink-charcoal"
                  : "border-zinc-100 bg-zinc-50 text-zinc-400",
              )}
            >
              <button
                type="button"
                className="font-medium"
                onClick={() =>
                  updateSpot.mutate({
                    id: spot.id,
                    payload: { is_active: !spot.is_active },
                  })
                }
                title={spot.is_active ? "Deactivate" : "Activate"}
              >
                {spot.name}
              </button>
              <button
                type="button"
                className="flex size-5 items-center justify-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  setPendingDelete(spot);
                  deleteConfirm.openDialog();
                }}
                aria-label={`Delete ${spot.name}`}
              >
                <Trash2 className="size-3" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmationDialog
        state={{
          ...deleteConfirm,
          onOpenChange: (open) => {
            deleteConfirm.onOpenChange(open);
            if (!open) setPendingDelete(null);
          },
        }}
        title="Delete spot?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be removed and unassigned from any QR codes using it.`
            : "This spot will be removed."
        }
        confirmLabel="Delete"
        isPending={deleteSpot.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteSpot.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
