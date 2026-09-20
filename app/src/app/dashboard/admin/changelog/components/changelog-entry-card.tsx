"use client";

import { type FC } from "react";
import {
  Annoyed,
  BookOpen,
  Bot,
  Compass,
  GitCommitHorizontal,
  Smile,
  Swords,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getChangelogCommitUrl } from "@/config/changelog";
import { getChangelogTypeLabel } from "@/config/constants/dropdowns/shared/changelog-type-form.options";
import { getSessionMoodLabel } from "@/config/constants/dropdowns/shared/session-mood-form.options";
import type {
  ChangelogEntry,
  ChangelogType,
  SessionMood,
} from "@/interfaces/changelog.interfaces";
import { cn } from "@/lib/utils";

const typeChipClass: Record<ChangelogType, string> = {
  FEATURE: "bg-brand-50 text-brand-800",
  IMPROVEMENT: "bg-sky-50 text-sky-700",
  FIX: "bg-amber-50 text-amber-700",
  CHORE: "bg-neutral-fill text-zinc-600",
};

const typeDotClass: Record<ChangelogType, string> = {
  FEATURE: "bg-brand-400",
  IMPROVEMENT: "bg-sky-400",
  FIX: "bg-amber-400",
  CHORE: "bg-zinc-300",
};

const moodIcon: Record<SessionMood, LucideIcon> = {
  HAPPY: Smile,
  FOCUSED: Target,
  RUSHED: Zap,
  EXPLANATORY: BookOpen,
  EXPLORATORY: Compass,
  FRUSTRATED: Annoyed,
  BLUNT: Swords,
};

const moodIconClass: Record<SessionMood, string> = {
  HAPPY: "text-brand-700",
  FOCUSED: "text-sky-600",
  RUSHED: "text-violet-600",
  EXPLANATORY: "text-indigo-600",
  EXPLORATORY: "text-teal-600",
  FRUSTRATED: "text-orange-600",
  BLUNT: "text-rose-600",
};

interface ChangelogEntryCardProps {
  entry: ChangelogEntry;
}

export const ChangelogEntryCard: FC<ChangelogEntryCardProps> = ({ entry }) => {
  const MoodIcon = entry.sessionMood ? moodIcon[entry.sessionMood] : null;

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center pt-5">
        <span
          className={cn(
            "size-2.5 shrink-0 rounded-full ring-3 ring-white",
            typeDotClass[entry.type] ?? typeDotClass.CHORE,
          )}
        />
        <span className="mt-1 w-px flex-1 bg-zinc-200" />
      </div>

      <div className="min-w-0 flex-1 pb-3">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-caption font-bold",
                typeChipClass[entry.type] ?? typeChipClass.CHORE,
              )}
            >
              {getChangelogTypeLabel(entry.type)}
            </span>
            <h3 className="min-w-0 text-chip font-semibold text-ink-charcoal">
              {entry.title}
            </h3>
          </div>

          {entry.description ? (
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {entry.description}
            </p>
          ) : null}

          {entry.sessionMood && MoodIcon ? (
            <p className="mt-2 flex items-start gap-1.5 text-caption text-zinc-500">
              <MoodIcon
                className={cn(
                  "mt-px size-3.5 shrink-0",
                  moodIconClass[entry.sessionMood],
                )}
                strokeWidth={2}
              />
              <span>
                <span className="font-semibold text-zinc-600">
                  {getSessionMoodLabel(entry.sessionMood)}
                </span>
                {entry.sessionNote ? (
                  <>
                    {" — "}
                    <span className="italic">{entry.sessionNote}</span>
                  </>
                ) : null}
              </span>
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-caption text-zinc-500">
            <span className="font-medium text-zinc-600">{entry.author}</span>

            {entry.agent ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-fill px-2 py-0.5 font-semibold text-zinc-600">
                <Bot className="size-3" strokeWidth={2} />
                AI
              </span>
            ) : null}

            <a
              href={getChangelogCommitUrl(entry.commit)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-zinc-400 transition-colors hover:text-ink-charcoal"
            >
              <GitCommitHorizontal className="size-3.5" strokeWidth={2} />
              {entry.commit}
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};
