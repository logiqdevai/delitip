export const ChangelogTypes = {
  FEATURE: "FEATURE",
  IMPROVEMENT: "IMPROVEMENT",
  FIX: "FIX",
  CHORE: "CHORE",
} as const;

export type ChangelogType =
  (typeof ChangelogTypes)[keyof typeof ChangelogTypes];

export const SessionMoods = {
  HAPPY: "HAPPY",
  FOCUSED: "FOCUSED",
  RUSHED: "RUSHED",
  EXPLANATORY: "EXPLANATORY",
  EXPLORATORY: "EXPLORATORY",
  FRUSTRATED: "FRUSTRATED",
  BLUNT: "BLUNT",
} as const;

export type SessionMood = (typeof SessionMoods)[keyof typeof SessionMoods];

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
  /** How the session ran. Absent on entries backfilled from git history. */
  sessionMood?: SessionMood;
  /** One factual sentence about the session. Absent when sessionMood is. */
  sessionNote?: string;
}
