"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Routes } from "@/routes/routes";
import type { HelpSearchEntry } from "@/interfaces/help-center.interfaces";

interface HelpSearchProps {
  searchIndex: HelpSearchEntry[];
}

export const HelpSearch: FC<HelpSearchProps> = ({ searchIndex }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<
      string,
      { categoryTitle: string; entries: HelpSearchEntry[] }
    >();
    for (const entry of searchIndex) {
      const group = groups.get(entry.categorySlug);
      if (group) {
        group.entries.push(entry);
      } else {
        groups.set(entry.categorySlug, {
          categoryTitle: entry.categoryTitle,
          entries: [entry],
        });
      }
    }
    return Array.from(groups.values());
  }, [searchIndex]);

  const handleSelect = (categorySlug: string, articleSlug: string) => {
    setOpen(false);
    router.push(Routes.help.article(categorySlug, articleSlug));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm transition hover:border-zinc-300"
      >
        <span>Search help articles…</span>
        <kbd className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs font-semibold text-zinc-400">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search help articles"
        description="Search across every Help Center article"
      >
        <Command
          filter={(value, search) =>
            value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0
          }
        >
          <CommandInput placeholder="Search help articles…" />
          <CommandList>
            <CommandEmpty>No articles found.</CommandEmpty>
            {groupedByCategory.map((group) => (
              <CommandGroup key={group.categoryTitle} heading={group.categoryTitle}>
                {group.entries.map((entry) => (
                  <CommandItem
                    key={`${entry.categorySlug}-${entry.articleSlug}`}
                    value={`${entry.categoryTitle} ${entry.title} ${entry.summary}`}
                    onSelect={() =>
                      handleSelect(entry.categorySlug, entry.articleSlug)
                    }
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{entry.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {entry.summary}
                      </span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};
