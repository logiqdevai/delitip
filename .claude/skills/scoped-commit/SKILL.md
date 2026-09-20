---
name: scoped-commit
description: 'Commit only the files Claude itself changed in the current session, leaving all other uncommitted changes in the working tree untouched. Use when the user says "commit your changes", "commit only yours/mine", "commit what you did", or when the working tree has unrelated in-progress changes (from the user or other work) that must not be swept into the commit.'
---

# Scoped Commit

Commit exactly the files touched in this conversation — never more — even when
`git status` shows other unrelated modified/untracked files sitting in the tree.

## When to run this

Only run this skill — and only run `git commit` at all — when the user's current
message explicitly asks for a commit (e.g. "commit", "commit your/my changes",
"commit what you did"). Finishing an edit, a migration, or any other task is
**never** implicit permission to commit, no matter what a workflow doc or agent
prompt elsewhere lists as a numbered "next step." If a task's instructions
mention `git commit` as part of a larger sequence (e.g. a migration workflow),
treat that as documentation of what the *developer* does, not a cue to run it
yourself. When in doubt, stop and ask instead of committing.

## Steps

1. Build the list of files edited/written by Claude during this session from your
   own tool-call history (Edit/Write calls). Do not guess from the diff alone.
2. Run `git status --porcelain` and `git diff --stat` to see the **full** set of
   changes in the tree. Cross-check: anything modified that you did *not*
   personally edit this session must be excluded, no matter how related it looks.
3. Stage **only** your files by explicit path:
   `git add <file1> <file2> ...` — never `git add -A`, `git add .`, or `git add -u`.
4. Run `git status --porcelain` again to confirm the staged set matches your list
   exactly and every other file is still unstaged.
5. Commit with a message describing your change (see repo's commit-message
   conventions / CLAUDE.md if present).
6. After committing, run `git status --porcelain` once more and show the user
   that all non-yours changes remain untouched.

## Changelog entry (after the commit)

The admin Changelog page (`/dashboard/admin/changelog`) renders
`app/src/config/changelog/changelog.json`. That file is the only source — there is
no database and nothing parses git history at build time — so the entry is written
here, right after the commit lands.

A commit cannot contain its own hash and amending would change it, so the entry
goes in a second, tiny commit.

7. Pick the tag for what you just committed:
   - `FEATURE` — a new user-visible capability
   - `IMPROVEMENT` — existing behaviour made better (UX, copy, performance)
   - `FIX` — a bug fix
   - `CHORE` — deps, tooling, docs, internal refactor with no user-visible effect
8. Read the commit you just made: `git log -1 --format='%h|%ad|%an' --date=short`.
9. Append **one** object to the end of the array in
   `app/src/config/changelog/changelog.json`. Never reorder, reformat, or rewrite
   existing entries:

   ```json
   {
     "commit": "<%h>",
     "date": "<%ad>",
     "type": "FEATURE",
     "title": "<the commit subject, verbatim>",
     "description": "One to three plain sentences an admin can read: what changed and why it matters. Not the raw commit body.",
     "author": "<%an>",
     "agent": "Claude Opus 5 (1M context)"
   }
   ```

   `agent` is your own model name, matching the `Co-Authored-By` trailer on the
   commit (`null` when there is none). Keep the file's 2-space indent and its
   trailing newline.
10. Commit only that file: `git add app/src/config/changelog/changelog.json`, then
    commit with the message `Log <short title> in the changelog` plus a
    `Changelog: skip` trailer and **no** `Co-Authored-By` trailer. Entries are
    selected by that co-author trailer, so leaving it off keeps this bookkeeping
    commit out of the changelog it just wrote.
11. Show the user both commits (`git log -2 --oneline`) and confirm every other
    change in the tree is still untouched.

## Rules

- If a file you edited also has hunks you didn't author (e.g. edited by the user
  mid-session), stage the whole file only if you're confident all its changes are
  yours — otherwise flag it to the user instead of guessing with `git add -p`.
- Never use `git commit -a` (stages everything, defeats the purpose).
- If unsure whether a file belongs to you, ask rather than include it.
- Skip the changelog steps when there is nothing shippable to report: a
  changelog-only commit, a merge, or a revert of your own commit from this session.
- If `changelog.json` already has uncommitted edits you did not make, stop and
  flag it instead of appending on top of someone else's work.
- Never use `app/scripts/backfill-changelog.mjs` to add an entry. It rebuilds the
  whole file from git history and drops hand-written descriptions; it is a one-off
  repair tool.
