export const ChangelogTypes = {
  FEATURE: "FEATURE",
  IMPROVEMENT: "IMPROVEMENT",
  FIX: "FIX",
  CHORE: "CHORE",
} as const;

export type ChangelogType =
  (typeof ChangelogTypes)[keyof typeof ChangelogTypes];

export interface ChangelogEntry {
  /** Short sha of the commit this entry documents. */
  commit: string;
  /** Commit author date, "YYYY-MM-DD". */
  date: string;
  type: ChangelogType;
  /** Commit subject. */
  title: string;
  /** Plain-English summary of the change — may be empty for older commits. */
  description: string;
  /** Git author name. */
  author: string;
  /** AI agent credited on the commit, e.g. "Claude Opus 5" — null when none. */
  agent: string | null;
}
