// Rebuilds src/config/changelog/changelog.json from git history.
//
// One-off backfill / repair tool. Day-to-day, the `/scoped-commit` skill appends
// a single entry per commit, so this script is NOT wired into `npm run build`.
// Rerunning it overwrites the file and therefore drops any description that was
// hand-edited after the fact.
//
// Usage: node scripts/backfill-changelog.mjs

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FIELD = "\u001f";
const RECORD = "\u001e";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(scriptDir, "..");
const repoDir = resolve(appDir, "..");
const outputFile = resolve(appDir, "src/config/changelog/changelog.json");

// Only commits written through the skill: they carry an AI co-author trailer.
const AI_COAUTHOR = "^Co-[Aa]uthored-[Bb]y: (Claude|Cursor)";

const TRAILER_LINE =
  /^(Co-[Aa]uthored-[Bb]y|Claude-Session|Changelog|Changelog-Type|Signed-off-by|Change-Id):/i;

const TYPE_HEURISTICS = [
  [/^(add|added|adds|introduce|introduces|ship|ships|create|creates)$/, "FEATURE"],
  [/^(fix|fixes|fixed|prevent|prevents|correct|corrects|repair|repairs)$/, "FIX"],
  [
    /^(update|updates|show|shows|tidy|improve|improves|require|requires|refactor|refactors|rename|renames|move|moves|make|makes|replace|replaces|hide|hides|link|links|sync|syncs|switch|switches)$/,
    "IMPROVEMENT",
  ],
];

const inferType = (subject) => {
  const firstWord = subject.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  for (const [pattern, type] of TYPE_HEURISTICS) {
    if (pattern.test(firstWord)) return type;
  }
  return "CHORE";
};

const toDescription = (bodyLines) => {
  const kept = bodyLines.filter((line) => !TRAILER_LINE.test(line.trim()));

  // Bullet bodies read badly once flattened, so keep the items as clauses.
  const isBulleted = kept.some((line) => /^\s*[-*]\s+/.test(line));
  const joined = isBulleted
    ? kept
        .join("\n")
        .split(/\n(?=\s*[-*]\s+)/)
        .map((item) => item.replace(/^\s*[-*]\s+/, "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .join("; ")
    : kept.join(" ");

  const prose = joined.replace(/\s+/g, " ").trim();
  if (!prose) return "";

  let description = prose;
  if (!isBulleted) {
    const sentences = prose.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [prose];
    description = sentences.slice(0, 2).join(" ").trim();
  }
  if (description.length > 320) {
    description = `${description.slice(0, 317).trimEnd()}...`;
  }
  return description;
};

const readTrailer = (bodyLines, name) => {
  const match = bodyLines.find((line) =>
    new RegExp(`^${name}:`, "i").test(line.trim()),
  );
  return match ? match.slice(match.indexOf(":") + 1).trim() : null;
};

const raw = execFileSync(
  "git",
  [
    "log",
    "--reverse",
    "--no-merges",
    "-E",
    `--grep=${AI_COAUTHOR}`,
    "--date=short",
    `--format=%h${FIELD}%ad${FIELD}%an${FIELD}%B${RECORD}`,
  ],
  { cwd: repoDir, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
);

const entries = [];

for (const record of raw.split(RECORD)) {
  const trimmed = record.replace(/^\s+/, "");
  if (!trimmed) continue;

  const [commit, date, author, message = ""] = trimmed.split(FIELD);
  const lines = message.split("\n");
  const subject = (lines[0] ?? "").trim();
  const bodyLines = lines.slice(1);

  if (!subject) continue;
  if (/^skip$/i.test(readTrailer(bodyLines, "Changelog") ?? "")) continue;

  const coAuthor = readTrailer(bodyLines, "Co-Authored-By");

  entries.push({
    commit,
    date,
    type: (readTrailer(bodyLines, "Changelog-Type") || inferType(subject)).toUpperCase(),
    title: subject,
    description: toDescription(bodyLines),
    author,
    agent: coAuthor ? coAuthor.replace(/\s*<[^>]*>\s*$/, "").trim() : null,
  });
}

mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

const counts = entries.reduce((totals, entry) => {
  totals[entry.type] = (totals[entry.type] ?? 0) + 1;
  return totals;
}, {});

console.log(`Wrote ${entries.length} changelog entries to ${outputFile}`);
console.log(
  Object.entries(counts)
    .map(([type, count]) => `  ${type}: ${count}`)
    .join("\n"),
);
console.log(
  "\nNote: this rebuilds the file from git. Descriptions edited by hand after a\ncommit was logged are not preserved.",
);
