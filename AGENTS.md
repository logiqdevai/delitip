<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## API rules (`api/**`)

@.cursor/rules/api-code-structure-and-best-practices.mdc

## App rules (`app/**`)

@.cursor/rules/app-code-structure-and-best-practices.mdc

## Local development

For local API work, use `.env.staging` (`npm run start:staging` in `api/`), not `.env.local` — `.env.local` has empty/placeholder integration keys (e.g. `RESEND_API_KEY`), so flows like email sending fail locally with it. `.env.staging` has working keys.
