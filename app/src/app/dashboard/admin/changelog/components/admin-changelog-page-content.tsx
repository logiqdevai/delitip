"use client";

import { type FC, useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChangelogEntries } from "@/config/changelog";
import { ChangelogTypeFilterOptions } from "@/config/constants/dropdowns/shared/changelog-type-filter.options";
import type {
  ChangelogEntry,
  ChangelogType,
} from "@/interfaces/changelog.interfaces";
import { ChangelogEntryCard } from "./changelog-entry-card";

type ChangelogTypeFilter = ChangelogType | "all";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

const matchesSearch = (entry: ChangelogEntry, term: string) =>
  [entry.title, entry.description, entry.commit, entry.author, entry.agent]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(term));

export const AdminChangelogPageContent: FC = () => {
  const [type, setType] = useState<ChangelogTypeFilter>("all");
  const [search, setSearch] = useState("");

  const countsByType = useMemo(
    () =>
      ChangelogEntries.reduce<Record<string, number>>((totals, entry) => {
        totals[entry.type] = (totals[entry.type] ?? 0) + 1;
        return totals;
      }, {}),
    [],
  );

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = ChangelogEntries.filter(
      (entry) =>
        (type === "all" || entry.type === type) &&
        (!term || matchesSearch(entry, term)),
    );

    // Entries are already newest-first, so insertion order keeps the grouping sorted.
    const byDate = new Map<string, ChangelogEntry[]>();
    for (const entry of filtered) {
      const existing = byDate.get(entry.date);
      if (existing) {
        existing.push(entry);
      } else {
        byDate.set(entry.date, [entry]);
      }
    }

    return [...byDate.entries()];
  }, [type, search]);

  const totalShown = groups.reduce((total, [, entries]) => total + entries.length, 0);

  return (
    <>
      <DashboardPageHeader
        title="Changelog"
        description="Everything shipped to delitip, newest first."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search changes or commits"
              aria-label="Search changelog"
              className="rounded-xl border-zinc-200 bg-white pl-9 font-medium text-ink-charcoal shadow-xs"
            />
          </div>
        }
      />

      <Tabs
        value={type}
        onValueChange={(value) => setType(value as ChangelogTypeFilter)}
        className="min-w-0 max-w-full"
      >
        <TabsList
          variant="line"
          className="h-auto max-w-full flex-wrap"
        >
          {ChangelogTypeFilterOptions.map((option) => (
            <TabsTrigger key={option.id} value={option.id}>
              {option.label}
              <span className="text-caption font-semibold text-zinc-400">
                {option.id === "all"
                  ? ChangelogEntries.length
                  : (countsByType[option.id] ?? 0)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {totalShown === 0 ? (
        <Empty className="border border-dashed border-zinc-200 bg-white px-4 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <History />
            </EmptyMedia>
            <EmptyTitle>No changes found</EmptyTitle>
            <EmptyDescription>
              {search
                ? "No entries match your search."
                : "Nothing has been logged for this tag yet."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-7">
          {groups.map(([date, entries]) => (
            <section key={date}>
              <h2 className="text-caption font-bold tracking-wide text-zinc-400 uppercase">
                {formatDate(date)}
              </h2>
              <ul className="mt-2 list-none">
                {entries.map((entry) => (
                  <ChangelogEntryCard key={entry.commit} entry={entry} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
};
