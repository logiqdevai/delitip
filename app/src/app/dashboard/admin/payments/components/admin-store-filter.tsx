"use client";

import { type FC } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useAdminStores } from "@/features/stores/hooks/use-stores";

interface AdminStoreFilterProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export const AdminStoreFilter: FC<AdminStoreFilterProps> = ({
  value,
  onValueChange,
}) => {
  const storesQuery = useAdminStores();
  const stores = storesQuery.data ?? [];
  const storeIds = stores.map((store) => store.id);
  const storeNameById = new Map(stores.map((store) => [store.id, store.name]));

  return (
    <Combobox
      items={storeIds}
      value={value}
      onValueChange={(next) => onValueChange((next as string | null) ?? null)}
      itemToStringLabel={(id: string) => storeNameById.get(id) ?? id}
    >
      <ComboboxInput
        placeholder="All stores"
        aria-label="Filter by store"
        showClear
        className="w-44 rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
      />
      <ComboboxContent>
        <ComboboxList>
          {(id: string) => (
            <ComboboxItem key={id} value={id}>
              {storeNameById.get(id) ?? id}
            </ComboboxItem>
          )}
        </ComboboxList>
        <ComboboxEmpty>No stores found</ComboboxEmpty>
      </ComboboxContent>
    </Combobox>
  );
};
