"use client";

import { type FC, useMemo, useState } from "react";
import { History, Search, X } from "lucide-react";
import { DashboardPageHeader } from "@/app/dashboard/components/dashboard-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ChangelogEntries } from "@/config/changelog";
import { ChangelogTypeFilterOptions } from "@/config/constants/dropdowns/shared/changelog-type-filter.options";
import { SessionMoodFilterOptions } from "@/config/constants/dropdowns/shared/session-mood-filter.options";
import type {
  ChangelogEntry,
  ChangelogType,
  SessionMood,
} from "@/interfaces/changelog.interfaces";
import { ChangelogEntryCard } from "./changelog-entry-card";

type ChangelogTypeFilter = ChangelogType | "all";
type SessionMoodFilter = SessionMood | "all";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });

const matchesSearch = (entry: ChangelogEntry, term: string) =>
  [
    entry.title,
    entry.description,
    entry.commit,
    entry.author,
    entry.agent,
    entry.sessionMood,
    entry.sessionNote,
  ]
    .filter(Boolean)
    .some((field) => field!.toLowerCase().includes(term));

export const AdminChangelogPageContent: FC = () => {
  const [type, setType] = useState<ChangelogTypeFilter>("all");
  const [mood, setMood] = useState<SessionMoodFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
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
        (mood === "all" || entry.sessionMood === mood) &&
        (!dateFrom || entry.date >= dateFrom) &&
        (!dateTo || entry.date <= dateTo) &&
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
  }, [type, mood, dateFrom, dateTo, search]);

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

      <div className="flex flex-col gap-3">
        <Tabs
          value={type}
          onValueChange={(value) => setType(value as ChangelogTypeFilter)}
          className="min-w-0 max-w-full"
        >
          <TabsList
            className="h-auto max-w-full flex-wrap justify-start gap-y-1 *:data-[slot=tabs-trigger]:flex-none"
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

        <div className="flex flex-wrap items-center gap-2">
          <Select
            items={SessionMoodFilterOptions.map((option) => ({
              label: option.label,
              value: option.id,
            }))}
            value={mood}
            onValueChange={(next) => {
              if (next) setMood(next as SessionMoodFilter);
            }}
          >
            <SelectTrigger
              aria-label="Filter by session"
              className="min-w-36 rounded-xl border-zinc-200 bg-white px-3.5 font-medium text-ink-charcoal shadow-xs"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SessionMoodFilterOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="From date"
            aria-label="From date"
            className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
          />
          <span className="text-xs text-zinc-400">to</span>
          <DatePicker
            value={dateTo}
            onChange={setDateTo}
            placeholder="To date"
            aria-label="To date"
            className="rounded-xl border-zinc-200 bg-white font-medium text-ink-charcoal shadow-xs"
          />

          {dateFrom || dateTo ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="rounded-xl text-chip font-semibold text-zinc-500"
            >
              <X data-icon="inline-start" className="size-3.5" />
              Clear dates
            </Button>
          ) : null}
        </div>
      </div>

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
                : "Nothing has been logged for these filters yet."}
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
