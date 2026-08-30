"use client";

import { type FC, type FormEvent, useState } from "react";
import { Check, MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
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

  const startEdit = (spot: Spot) => {
    setEditingId(spot.id);
    setEditName(spot.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = (spot: Spot) => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === spot.name) {
      cancelEdit();
      return;
    }
    updateSpot.mutate(
      { id: spot.id, payload: { name: trimmed } },
      { onSuccess: () => cancelEdit() },
    );
  };

  const toggleActive = (spot: Spot) => {
    updateSpot.mutate({
      id: spot.id,
      payload: { is_active: !spot.is_active },
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2">
        <MapPin className="size-4 text-zinc-400" strokeWidth={2} />
        <h2 className="text-sm font-bold text-ink-charcoal">Spots</h2>
      </div>
      <p className="text-xs text-zinc-500">
        Tables, rooms, and counters you can attach to QR codes. Turn a spot off
        to hide it from new QR assignments without deleting it.
      </p>

      <form onSubmit={handleCreate} className="flex gap-2">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Table 12"
          aria-label="New spot name"
          className="flex-1"
        />
        <Button type="submit" disabled={createSpot.isPending || !name.trim()}>
          <Plus data-icon="inline-start" />
          Add spot
        </Button>
      </form>

      {spotsQuery.isPending ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ) : spots.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-3 text-center text-xs text-zinc-500">
          No spots yet. Add one above, then attach it when you create a QR
          code.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/80">
          {spots.map((spot) => {
            const isEditing = editingId === spot.id;
            const isUpdating =
              updateSpot.isPending && updateSpot.variables?.id === spot.id;

            return (
              <li
                key={spot.id}
                className={cn(
                  "flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
                  !spot.is_active && "bg-zinc-50/80",
                )}
              >
                {isEditing ? (
                  <form
                    className="flex min-w-0 flex-1 items-center gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      saveEdit(spot);
                    }}
                  >
                    <Input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      aria-label={`Rename ${spot.name}`}
                      autoFocus
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      variant="secondary"
                      disabled={isUpdating || !editName.trim()}
                      aria-label="Save name"
                    >
                      <Check className="size-3.5" strokeWidth={2} />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={cancelEdit}
                      disabled={isUpdating}
                      aria-label="Cancel rename"
                    >
                      <X className="size-3.5" strokeWidth={2} />
                    </Button>
                  </form>
                ) : (
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-ink-charcoal">
                      {spot.name}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-caption font-bold",
                        spot.is_active
                          ? "bg-brand-50 text-brand-700"
                          : "bg-neutral-fill font-medium text-zinc-500",
                      )}
                    >
                      {spot.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                )}

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                  <label className="flex cursor-pointer items-center gap-2 pr-1 text-xs text-zinc-600">
                    <Switch
                      size="sm"
                      checked={spot.is_active}
                      disabled={isUpdating || isEditing}
                      onCheckedChange={() => toggleActive(spot)}
                      aria-label={
                        spot.is_active
                          ? `Deactivate ${spot.name}`
                          : `Activate ${spot.name}`
                      }
                    />
                    <span className="hidden sm:inline">
                      {spot.is_active ? "On" : "Off"}
                    </span>
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="size-8 px-0"
                    disabled={isEditing}
                    onClick={() => startEdit(spot)}
                    aria-label={`Rename ${spot.name}`}
                  >
                    <Pencil className="size-3.5" strokeWidth={2} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="size-8 px-0 text-zinc-500 hover:text-red-700"
                    disabled={isEditing}
                    onClick={() => {
                      setPendingDelete(spot);
                      deleteConfirm.openDialog();
                    }}
                    aria-label={`Delete ${spot.name}`}
                  >
                    <Trash2 className="size-3.5" strokeWidth={2} />
                  </Button>
                </div>
              </li>
            );
          })}
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
