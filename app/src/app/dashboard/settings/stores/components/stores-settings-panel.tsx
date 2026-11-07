"use client";

import { type FC, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Store as StoreIcon } from "lucide-react";
import { AddStoreDialog } from "@/components/layout/sidebar/add-store-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ConfirmationDialog,
  useConfirmationDialog,
} from "@/components/ui/confirmation-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { StoreCurrencyFormOptions } from "@/config/constants/dropdowns/stores/store-currency-form.options";
import { StoreIndustryFormOptions } from "@/config/constants/dropdowns/stores/store-industry-form.options";
import { useDropdownLabel } from "@/hooks/use-dropdown-options";
import { OrganizationRoles } from "@/features/organizations/interfaces/organizations.interfaces";
import { useDeleteStore, useStores } from "@/features/stores/hooks/use-stores";
import { useWorkspace } from "@/features/stores/hooks/use-workspace";
import type { Store } from "@/features/stores/interfaces/stores.interfaces";
import { useWorkspaceStore } from "@/stores/workspace.store";
import { getErrorMessage } from "@/lib/api-error";

export const StoresSettingsPanel: FC = () => {
  const t = useTranslations("dashboard.settings.stores");
  const optionLabel = useDropdownLabel();
  const {
    organizationId,
    storeId: currentStoreId,
    role,
    switchStore,
  } = useWorkspace();
  const storesQuery = useStores(organizationId ?? "");
  const setWorkspace = useWorkspaceStore((s) => s.setWorkspace);
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const deleteStore = useDeleteStore();
  const deleteConfirm = useConfirmationDialog();
  const [pendingDelete, setPendingDelete] = useState<Store | null>(null);

  const isOwner = role === OrganizationRoles.OWNER;
  const stores = storesQuery.data ?? [];
  const isLastStore = stores.length <= 1;

  if (!organizationId) return null;

  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-zinc-200/80 bg-white px-4 py-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StoreIcon className="size-4 text-zinc-400" strokeWidth={2} />
          <h2 className="text-sm font-bold text-ink-charcoal">{t("title")}</h2>
        </div>
        {isOwner ? (
          <Button
            type="button"
            size="sm"
            className="shrink-0 max-sm:w-full"
            onClick={() => setAddStoreOpen(true)}
          >
            <Plus className="size-4" strokeWidth={2} />
            {t("add")}
          </Button>
        ) : null}
      </div>

      {storesQuery.isPending ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : storesQuery.isError ? (
        <p className="text-xs text-red-600">{getErrorMessage(storesQuery.error)}</p>
      ) : (
        <div className="divide-y divide-zinc-100">
          {stores.map((store) => {
            const location = [store.address_line, store.city, store.country]
              .map((part) => part?.trim())
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={store.id}
                className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="size-10 rounded-lg after:rounded-lg">
                    {store.logo_document?.url ? (
                      <AvatarImage
                        src={store.logo_document.url}
                        alt=""
                        className="rounded-lg object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="rounded-lg bg-ink-charcoal text-xs font-bold text-paper-offwhite">
                      {store.name.trim().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-ink-charcoal">
                        {store.name}
                      </span>
                      {store.id === currentStoreId ? (
                        <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-800">
                          {t("current")}
                        </span>
                      ) : null}
                      {!store.is_active ? (
                        <span className="shrink-0 rounded-full bg-neutral-fill px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                          {t("inactive")}
                        </span>
                      ) : null}
                    </div>
                    <div className="truncate text-xs text-zinc-500">
                      {[optionLabel(StoreIndustryFormOptions, store.industry), location || null]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                    <div className="truncate text-xs text-zinc-400">
                      {optionLabel(StoreCurrencyFormOptions, store.currency)} · {store.timezone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-1">
                  {store.id !== currentStoreId ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="max-sm:flex-1"
                      onClick={() => switchStore(store.id)}
                    >
                      {t("switch")}
                    </Button>
                  ) : null}
                  {isOwner ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 max-sm:ml-auto"
                      disabled={isLastStore}
                      title={isLastStore ? t("lastStoreTitle") : undefined}
                      onClick={() => {
                        setPendingDelete(store);
                        deleteConfirm.openDialog();
                      }}
                    >
                      {t("delete")}
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOwner && isLastStore && stores.length > 0 ? (
        <p className="text-xs text-zinc-500">
          {t("lastStoreNote")}
        </p>
      ) : null}

      {isOwner ? (
        <AddStoreDialog
          open={addStoreOpen}
          onOpenChange={setAddStoreOpen}
          organizationId={organizationId}
          stores={stores}
          currentStore={stores.find((item) => item.id === currentStoreId) ?? null}
          onCreated={(created) => {
            // switchStore validates against this render's (pre-create) list,
            // so write the new selection to the workspace directly.
            setWorkspace({ organizationId, storeId: created.id });
          }}
        />
      ) : null}

      <ConfirmationDialog
        state={{
          ...deleteConfirm,
          onOpenChange: (open) => {
            deleteConfirm.onOpenChange(open);
            if (!open) setPendingDelete(null);
          },
        }}
        title={
          pendingDelete
            ? t("deleteDialog.title", { name: pendingDelete.name })
            : t("deleteDialog.titleFallback")
        }
        description={t("deleteDialog.description")}
        confirmLabel={t("deleteDialog.confirm")}
        isPending={deleteStore.isPending}
        onConfirm={async () => {
          if (!pendingDelete) return;
          await deleteStore.mutateAsync(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
