import entries from "./changelog.json";
import type { ChangelogEntry } from "@/interfaces/changelog.interfaces";

const REPO_COMMIT_URL = "https://github.com/logiqdevai/delitip/commit";

/**
 * Written by the `/scoped-commit` skill, one entry per commit, appended to the
 * end of the file. Reversed once here so the UI always reads newest-first.
 */
export const ChangelogEntries: ChangelogEntry[] = (
  entries as ChangelogEntry[]
)
  .slice()
  .reverse();

export const getChangelogCommitUrl = (commit: string): string =>
  `${REPO_COMMIT_URL}/${commit}`;
