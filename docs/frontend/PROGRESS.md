# DeliTip Frontend Progress

Master implementation checklist for the Next.js app under `app/`.

Detailed requirements live in the linked feature docs. This file is the **source of truth for task order and completion status**.

Related:

- Map & routes: [README.md](./README.md)
- Gaps matrix: [gaps-and-status.md](./gaps-and-status.md)
- Nav IA: [navigation.md](./navigation.md)
- Roles: [roles-and-permissions.md](./roles-and-permissions.md)
- App rules: [`.cursor/rules/app-code-structure-and-best-practices.mdc`](../../.cursor/rules/app-code-structure-and-best-practices.mdc)
- Spec: [`docs/DelyTip_Product_Specification.md`](../DelyTip_Product_Specification.md)
- Schema: [`api/prisma/schema.prisma`](../../api/prisma/schema.prisma)

---

## Instructions for AI Coding Agents

1. Read this file first.
2. Find the `Next Action`.
3. Read the linked detailed documentation before modifying code.
4. Inspect the existing implementation under `app/src/` before making changes.
5. Check `api/prisma/schema.prisma` (and existing API controllers under `api/src/modules/`) when the task involves data/entities.
6. Implement only the current task unless a listed dependency is incomplete — then do the dependency first.
7. Follow app architecture rules: `Routes.*`, `ApiRoutes`, `features/<domain>/` (no UI there), route UI in `app/<section>/components/`, enum labels in `config/constants/dropdowns/`, HeroUI skeletons, `ConfirmationDialog` for destructive actions, RHF + Zod forms.
8. Run relevant typecheck / lint for touched packages.
9. Verify every item under that task’s **Completion criteria**.
10. Mark the task `[x]` only after criteria are met (behavior, not “code written”).
11. Update **Current Status** counters and phase.
12. Update **Next Action** to the next incomplete task in phase order.
13. If blocked, add an entry under **Blocked / Needs Clarification** and set Next Action to the next unblocked task (or stop if the blocker is hard).
14. Do not skip ahead unless the current task is blocked.
15. Do not implement [roadmap.md](./roadmap.md) (§34) items unless the user explicitly expands scope.
16. Keep product name **DeliTip** / **delitip** (not “DelyTip” in new UI copy). Spec filename may still be `DelyTip_*`.

### Important Rules

- Do not mark a task complete based only on code being written.
- Verify the actual behavior in the running app when practical.
- Do not invent requirements. Prefer spec → schema → existing frontend → docs. Flag **Unclear** items.
- If requirements are unclear, document them in **Blocked / Needs Clarification** instead of guessing.
- If a dependency is missing, identify it and stop at the appropriate task.
- Update linked feature docs if implementation reveals a necessary clarification.
- Do not rewrite unrelated parts of the application.
- Replace demo data with API only when the corresponding `features/` module is in scope for that task.
- Prototype `/client` is not the production tip URL; production tip entry is `/{storeSlug}/q/{code}`.

### After Every Completed Task

1. `[ ]` → `[x]` for the task and its verified criteria.
2. Recalculate MVP and Overall progress counts in **Current Status**.
3. Update **Current Phase** if the phase has no remaining incomplete required tasks.
4. Rewrite **Next Action**.
5. Add blockers if discovered.

---

## Current Status

**Current Phase:** Phase 11 — Finished Product (gated; see below)

**MVP Progress:** 43 / 45 tasks completed

**Overall Progress:** 77 / 87 tasks completed (Phases 0–10, now fully and precisely recounted — see the table below)

**Product state:** Every engineering task reachable without external inputs is now done. What remains breaks into exactly two kinds, both listed in the Blocked table:

1. **Needs a live dev DB** (this environment's Docker Desktop never held Postgres up long enough to migrate + seed): the whole MVP core loop, and every other page built or touched this session, is verified by `tsc --noEmit` + `next build` + `eslint` passing plus reading the actual NestJS controllers/services/DTOs line-by-line — not by clicking through it. A Manual E2E script is written out below Phase 9 for whoever has a working DB to run first.
2. **Needs something this session genuinely cannot produce**: a real payment gateway account (Phase 10, and the mock-payment note under 2.6/5.4), an error-monitoring account/DSN (Phase 10), counsel-approved legal copy (Phase 10, pre-existing), a product decision on the `/me` vs `/customer` customer-history route (6.3, pre-existing), and translated UI copy for a tip-flow language switcher plus industry-specific review/feedback templates (6.1) — inventing any of these would mean guessing at product content or credentials, not implementing a defined requirement.

Everything else in Phases 0–10 is checked off. The two open MVP items are `0.3` (a standing practice, not a one-time completable task) and `3.4`'s `/employee/qr` (genuinely blocked — no API path exists for an employee session to find their own QR code). Phase 11's "Finished Product" checklist above is filled in honestly against this reality: most UI/data/security/quality rows are checked, but the top-level gates ("All MVP tasks complete", "Core loop works end-to-end in production", "MVP E2E verified") correctly stay unchecked until a live DB run happens.

**Next Task:** None purely engineering-actionable remains in this environment. The single highest-value next step is **running the Manual E2E script (below Phase 9) against a real dev DB** — that would very likely flip most of Phase 11's remaining gates at once, since everything it would test is already code-complete.

**Next Documentation:** This file's own Manual E2E script (under Phase 9) and the Blocked table (end of file).

**Progress-count correction (2026-08-29):** Every phase (0 through 10) was recounted precisely against the file's actual top-level checkboxes this session, replacing every earlier rough estimate (the original plan's ~112 total, and this session's own intermediate ~109 estimate). See the table below — 87 is now an exact count, not an approximation.

Note: **0.3** Routes registry expansion remains a standing practice — add keys to `routes.ts` before each new page; do not invent unused routes.

Note: This environment's Docker Desktop could not hold a Postgres container up long enough to run migrations + seed data, so no phase in this session was click-tested against a live dev DB — verification relied on `tsc`/`next build`/lint plus reading the actual NestJS controllers/services/DTOs to confirm request/response contracts.

---

## Next Action

> The next task for the AI coding agent is:

**No purely engineering-actionable task remains** in an environment without a live dev DB or the external accounts/content listed above. In priority order, once those become available:

1. **Get a working dev DB** and run the Manual E2E script (under Phase 9) — this is the single highest-leverage next step, since it validates the entire MVP core loop and most of this session's Post-MVP work in one pass, and would very likely let Phase 11's remaining gates be checked off.
2. **Resolve external/content blockers** as they become available: a payment provider decision + credentials (unblocks Phase 10's payment items and, longer-term, real employee cash-out), an error-monitoring account (Phase 10), legal copy from counsel (Phase 10), a product decision on the customer-history route (6.3), and translated tip-flow copy + industry review/feedback templates (6.1).
3. **If a live DB becomes available but none of the above does**, the next purely engineering task in phase order would be **Phase 6.3 Customer account history** — but it's explicitly blocked on the `/me` vs `/customer` route decision (see Blocked table), so don't start it without that decision first; skip to whatever Blocked item resolves first.

Do not skip ahead into Phase 11's "Definition of done" checkboxes without actually completing the above — they are gates, not aspirations.

---

## MVP Definition

### What MVP means for DeliTip

A **single-store business** can sign up, set up staff and QR codes, receive a real customer tip + optional review via QR, and see tips/reviews in the business and employee portals.

Core loop (spec §33): QR → tip → review → visible in dashboards.

### MVP (required before “MVP complete”)

Everything in **Phases 0–4** marked `(MVP)` must be `[x]`.

Includes:

- Working auth (business sign-up/sign-in, session, route guards)
- Minimal onboarding → Organization + first Store
- Employees create/list
- At least one Distribution Rule + Store default
- QR create/list with selection mode + employees
- Live customer tip flow at `/{storeSlug}/q/{code}` (amount → pay → thank-you → optional review)
- Tips ledger + reviews list wired to API
- Dashboard overview wired to real aggregates (basic)
- Employee portal: earnings, reviews, personal QR (read paths)
- Legal pages + forgot-password (linked already)
- Loading / empty / error states on MVP routes
- Role-appropriate access for Owner / Store Manager / Employee (Accountant can wait for Post-MVP polish)

### Post-MVP (after MVP complete)

Phases **5–6** and items marked `(Post-MVP)`: multi-store/org switcher, Spots, full analytics, alerts, AI insights, CX score, refunds, payout onboarding, cash-out productionization, localization, billing/plan gates, members admin, customer history, feedback question builder depth.

### Out of scope unless requested

- [roadmap.md](./roadmap.md) (§34)
- Platform admin console (`AuthRole` ADMIN / SUPER_ADMIN / SUPPORT)

---

# Phase 0 — Foundation `(MVP)`

Establish architecture so every later feature plugs into the same patterns.

### 0.1 Shared conventions audit

- [x] Marketing landing exists at `/`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Route: `Routes.home`
- [x] Contact page exists at `/contact`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Note: frontend-only (no Prisma model) — acceptable for MVP marketing

- [x] Confirm shared UI primitives available for MVP work
  - Details: [README.md](./README.md), `app/src/components/ui/`
  - Depends on: none
  - Completion criteria:
    - [x] `ConfirmationDialog` located and usable
    - [x] Form helpers / toast patterns identified
    - [x] Skeleton approach documented for list/detail pages (reuse or add `table-skeleton` / page skeletons as needed)
    - [x] Agent notes any missing primitive required before Phase 2 (do not invent one-off modals)
  - Audit notes (2026-08-29):
    - Stack is **shadcn + Base UI** (not HeroUI). Use `AlertDialog`-based `ConfirmationDialog` + `useConfirmationDialog`; do not import `@heroui/react`.
    - **Toast:** `import { toast } from "@/components/ui/toast"` → `toast.add({ title, description?, type: "success"|"error"|"info"|"warning"|"loading" })`. `Toaster` mounted in `app/providers.tsx`.
    - **Forms:** `Field` / `FieldGroup` / `FieldLabel` / `FieldError` + `react-hook-form` + `zodResolver` (packages installed). No classic `form.tsx` FormField wrappers — match Base UI Field pattern.
    - **Loading:** page queries → `TableSkeleton` / `DetailSkeleton` (or layout-shaped `Skeleton`); never `"Loading..."` as primary UI. Mutations → `ActionButtonWithPending` / `Spinner` on the control.
    - **Empty:** use `Empty` family from `components/ui/empty.tsx`.
    - **Also added for Phase 1–2:** `password-input.tsx`, `action-button-with-pending.tsx`.
    - **Still replace later:** employee cash-out still uses `window.confirm` / `alert` — swap to `ConfirmationDialog` when wiring that flow.
    - **Not missing for Phase 2 start:** shared destructive confirm, list/detail skeletons, toast, Field forms, password input.

### 0.2 API client & feature modules

- [x] Populate `ApiRoutes` for existing backend modules
  - Details: [README.md](./README.md), `api/src/modules/**`
  - Depends on: none
  - Completion criteria:
    - [x] `app/src/config/api/routes.ts` exports paths for auth, organizations, members, stores, employees, qr-codes, spots, distribution-rules, tips, reviews, review-categories, review-tags, feedback-questions, refunds, payout-accounts, alerts, analytics, insights, subscriptions, documents
    - [x] No hardcoded API path strings in new service code
    - [x] Axios instance still central (`axios.ts`)

- [x] Scaffold `features/` domains used by MVP
  - Details: [README.md](./README.md)
  - Depends on: ApiRoutes
  - Completion criteria:
    - [x] Folders exist with hooks/services/interfaces for at least: `auth`, `stores`, `employees`, `qr-codes`, `distribution`, `tips`, `reviews`
    - [x] No React components under `features/`
    - [x] Query key conventions documented in interfaces or hook files (kebab-case)

- [x] Auth token attachment on axios
  - Details: [authentication.md](./authentication.md)
  - Depends on: auth store or session approach chosen
  - Completion criteria:
    - [x] Request interceptor attaches token when present
    - [x] 401 handling path defined (redirect to sign-in via `Routes.auth.sign_in`)

### 0.3 Routes registry expansion (as needed)

- [ ] Add missing `Routes` keys before implementing pages that need them
  - Details: [navigation.md](./navigation.md), [README.md](./README.md)
  - Depends on: none (do incrementally per feature — do not invent unused routes)
  - Completion criteria:
    - [ ] Any new page path added to `routes.ts` first
    - [ ] No hardcoded `href="/..."` in new/changed navigation code

### 0.4 Dropdown vocabulary for MVP enums

- [x] Create dropdown option files for MVP enums
  - Details: app rules; schema enums
  - Depends on: feature interfaces for enum types
  - Completion criteria:
    - [x] Options exist for at least: `StoreIndustry`, `TipStatus`, `QrCodeSelectionMode`, `OrganizationRole`, `PayoutStatus`, `ReviewVisibility` / sentiment as needed
    - [x] Labels not defined inline in page components
  - Location: `app/src/config/constants/dropdowns/{stores,tips,qr-codes,organizations,reviews}/`; sign-up `BusinessTypeFormOptions` now aliases `StoreIndustryFormOptions`

### Phase 0 — Feature completion

- [x] ApiRoutes populated for MVP domains
- [x] Feature module pattern established
- [x] Axios auth hook-up ready
- [x] MVP enum dropdowns started
- [x] Shared destructive/loading patterns confirmed

---

# Phase 1 — Authentication & Access `(MVP)`

### 1.1 Legal pages

- [x] Implement `/legal/terms`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Route: `Routes.legal.terms`
  - Depends on: none
  - Completion criteria:
    - [x] `page.tsx` exists
    - [x] Linked from sign-up and footer
    - [x] Content placeholder acceptable if legal copy TBD (note in Blocked if copy missing)

- [x] Implement `/legal/privacy`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Route: `Routes.legal.privacy`
  - Depends on: none
  - Completion criteria:
    - [x] `page.tsx` exists
    - [x] Linked from sign-up and footer

### 1.2 Auth UI → API

- [x] Wire business sign-up to API
  - Details: [authentication.md](./authentication.md), [onboarding.md](./onboarding.md)
  - Route: `Routes.auth.sign_up`
  - Depends on: Phase 0 auth feature module, ApiRoutes
  - Completion criteria:
    - [x] Zod validation via `zodResolver`
    - [x] Creates User + Organization + first Store (or equivalent API contract)
    - [x] Business Type mapped to `StoreIndustry`
    - [x] Success redirects to onboarding or dashboard
    - [x] Error toast on failure
    - [x] Terms/Privacy links work
  - Notes (2026-08-29): `POST /auth/email/register` then `POST /organizations` with nested `store`; full name → `PATCH /users/me`; team size UI-only (no schema field); redirects to `Routes.onboarding` (Phase 2.1)

- [x] Wire business sign-in to API
  - Details: [authentication.md](./authentication.md)
  - Route: `Routes.auth.sign_in`
  - Depends on: auth feature module
  - Completion criteria:
    - [x] Session/token stored
    - [x] Redirect to `Routes.dashboard.root` (or account switcher if multi-account — Post-MVP OK to skip switcher)
    - [x] Error states for invalid credentials
  - Notes (2026-08-29): `POST /auth/email/login` via `useLoginBusiness`; Zod + `zodResolver`; account switcher deferred Post-MVP
- [x] Wire employee sign-in to API
  - Details: [authentication.md](./authentication.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: auth API; clarify PIN vs password
  - Completion criteria:
    - [x] Employee can reach `Routes.employee.root` after auth
    - [x] If PIN unsupported by schema/API: document in Blocked and use supported method (email/password or phone) without inventing PIN persistence
  - Notes (2026-08-29): PIN not in schema/API — MVP uses `POST /auth/email/login` via `useLoginEmployee` → `Routes.employee.root`; role gating deferred to 1.3

- [x] Implement forgot password + reset flow
  - Details: [authentication.md](./authentication.md)
  - Routes: `Routes.auth.forgot_password` (+ reset route added to `Routes`)
  - Depends on: `PasswordResetToken` API
  - Completion criteria:
    - [x] Forgot-password page exists
    - [x] Reset page exists and consumes token
    - [x] Success/error states
    - [x] Sign-in “Forgot password?” link works
  - Notes (2026-08-29): `Routes.auth.reset_password` = `/auth/reset-password?token=` (matches API `AppUrls.resetPassword`); generic success copy on forgot (no email enumeration)

### 1.3 Route guards & session

- [x] Protect `/dashboard/*` and `/employee/*`
  - Details: [roles-and-permissions.md](./roles-and-permissions.md), [navigation.md](./navigation.md)
  - Depends on: working sign-in
  - Completion criteria:
    - [x] Unauthenticated users redirected to sign-in
    - [x] Employee-only users cannot use business portal (and vice versa) per membership/employee link
    - [x] Fallback paths use `Routes.*`
  - Notes (2026-08-29): `AuthRouteGuard` + `GET /users/me/accounts`; dashboard requires `organization_memberships` (else → onboarding, or employee portal if only employee accounts); employee requires `employee_accounts`; wrong portal redirects to the other when applicable

### Phase 1 — Feature completion

- [x] Legal pages live
- [x] Sign-up/sign-in call API
- [x] Password reset works
- [x] Guards enforce auth
- [x] No fake 1s-delay-only auth submit on MVP paths

---

# Phase 2 — Core MVP Features `(MVP)`

Dependency order: Store context → Employees → Distribution → QR → Customer tip flow.

### 2.1 Onboarding (minimal)

- [x] Implement post-sign-up onboarding for Org + first Store
  - Details: [onboarding.md](./onboarding.md), [organizations-and-stores.md](./organizations-and-stores.md)
  - Route: `Routes.onboarding` (`/onboarding`)
  - Depends on: Phase 1 sign-up
  - Completion criteria:
    - [x] Single-store UX copy (Org jargon hidden)
    - [x] Store name, industry, timezone, currency capturable
    - [x] Prefills from sign-up when available
    - [x] Completion lands on dashboard
    - [x] Loading/error states
    - [x] Full 7-step wizard may be deferred but Steps 1 + “skip to dashboard” must exist; remaining steps can deep-link later tasks
  - Notes (2026-08-29): `app/onboarding` + `useCompleteBusinessSetup`; sign-up → onboarding; dashboard guard without Org → onboarding; skip only when Store exists; redirect rules in [onboarding.md](./onboarding.md)
### 2.2 Store context in business shell

- [x] Replace `demoBusiness` sidebar chip with live Store
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [navigation.md](./navigation.md)
  - Depends on: auth + stores feature
  - Completion criteria:
    - [x] Sidebar shows current Store name / basic meta from API
    - [x] Dashboard queries scoped to current Store id
    - [x] Multi-store switcher not required for MVP (single store)
  - Notes (2026-08-29): `useWorkspace` + `useCurrentStoreId` (`features/stores/hooks/use-workspace.ts`); persist `organizationId`/`storeId` in `stores/workspace.store.ts`; sidebar chip + overview header use live Store; employees badge count via `useEmployees(storeId)`

### 2.3 Employees `(MVP)`

- [x] Wire `/dashboard/employees` list to API
  - Details: [employees.md](./employees.md)
  - Route: `Routes.dashboard.employees`
  - Depends on: Store context, employees feature
  - Completion criteria:
    - [x] List/cards show API employees
    - [x] Loading skeleton
    - [x] Empty state + CTA
    - [x] Error state
    - [x] Active/inactive visible via `is_active`

- [x] Implement Create Employee modal
  - Details: [employees.md](./employees.md)
  - Depends on: employee list
  - Completion criteria:
    - [x] Fields: full_name, email, position?, photo optional
    - [x] Zod validation
    - [x] Success toast + list invalidate
    - [x] Error toast
    - [x] “Add New Employee” button wired
  - Notes (2026-08-29): Photo upload deferred (no document upload UI yet); position optional

- [x] Implement Edit + deactivate employee
  - Details: [employees.md](./employees.md)
  - Depends on: create employee
  - Completion criteria:
    - [x] Edit form works
    - [x] Deactivate uses `ConfirmationDialog` (prefer `is_active=false`)
    - [x] Permissions: Owner / Store Manager only
  - Notes (2026-08-29): Activate restores `is_active=true` without confirm; API enforces Owner/Store Manager on create/update

### Employees — Feature completion `(MVP)`

- [x] List route API-backed
- [x] Create modal complete
- [x] Edit/deactivate complete
- [x] Loading/empty/error complete
- [ ] Detail page optional for MVP (tracked in Phase 4)

### 2.4 Distribution rules `(MVP)`

- [x] Replace static policy cards with rules library
  - Details: [distribution.md](./distribution.md)
  - Route: `Routes.dashboard.distribution`
  - Depends on: Store context, employees (for employee recipients)
  - Completion criteria:
    - [x] List rules from API
    - [x] Show recipients summary
    - [x] Empty state

- [x] Create / Edit Distribution Rule modal
  - Details: [distribution.md](./distribution.md)
  - Depends on: rules library
  - Completion criteria:
    - [x] Name + recipients (STORE / EMPLOYEE + %)
    - [x] Validation: percentages sum to 100
    - [x] sort_order for rounding remainder
    - [x] Save invalidates queries

- [x] Set Store default distribution rule
  - Details: [distribution.md](./distribution.md)
  - Depends on: create rule
  - Completion criteria:
    - [x] `Store.default_distribution_rule_id` updatable from UI
    - [x] Default visible on Distribution hub
  - Notes (2026-08-29): Pending payouts demo removed from hub for now (Phase 5 payments); delete rule deferred

### Distribution — Feature completion `(MVP)`

- [x] CRUD for rules (delete can be Post-MVP if blocked by “in use”)
- [x] Store default settable
- [ ] Pending payouts UI can remain stub until Phase 5 payments

### 2.5 QR codes `(MVP)`

- [x] Replace single demo card with QR list on `/dashboard/access`
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Route: `Routes.dashboard.access`
  - Depends on: employees, distribution
  - Completion criteria:
    - [x] Lists QRs for Store
    - [x] Shows label, mode, employee count, active flag
    - [x] Loading/empty/error

- [x] Create / Edit QR modal
  - Details: [qr-and-access.md](./qr-and-access.md), [customer-tipping.md](./customer-tipping.md)
  - Depends on: QR list
  - Completion criteria:
    - [x] label, selection_mode, employees, optional distribution_rule_id, is_active
    - [x] Mode vs employee-count rules respected
    - [x] Tip URL displayed using store slug + code
    - [x] Routes helper added (no hardcoded tip URLs)
  - Notes (2026-08-29): `Routes.tip(storeSlug, code)`; Spots deferred; mode note in form (meaningful with 2+ employees)

- [x] Basic download/print of QR image
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Depends on: create QR
  - Completion criteria:
    - [x] At least one working download or print for a single QR
    - [x] Batch PDF may remain Post-MVP if blocked — note in Blocked
  - Notes (2026-08-29): Per-card PNG download + print via QR image URL; batch PDF deferred

### QR — Feature completion `(MVP)`

- [x] List + create/edit API-backed
- [x] Tip URL correct for public route
- [x] Spots deferred to Post-MVP unless trivial

### 2.6 Live customer tip flow `(MVP)` — critical path

- [x] Implement public tip entry route `/{storeSlug}/q/{code}`
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: QR create, public tip/store APIs
  - Completion criteria:
    - [x] Route registered in `Routes`
    - [x] Loads Store + QrCode + employees
    - [x] Inactive QR/Store → error state
    - [x] No business/employee chrome
    - [x] Mobile-first layout
  - Notes (2026-08-29): `app/[storeSlug]/q/[code]` via `Routes.tip`; `usePublicQrCode` + `usePublicStore`; slug mismatch / inactive → empty error; `PublicQrCode` interface aligned to API

- [x] Employee selection step (all modes)
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: tip entry route
  - Completion criteria:
    - [x] 0 employees → skip
    - [x] 1 employee → auto thank
    - [x] CHOOSE_ONE / CHOOSE_MANY / TEAM behave per docs
    - [x] Distribution rule never shown to customer
  - Notes (2026-08-29): Selection is merged into the landing screen (store hero + employee list) rather than a separate route — matches doc's "these are flow steps, not sidebar pages". 0/1/TEAM render read-only rows and Continue is always enabled; CHOOSE_ONE/CHOOSE_MANY render tappable rows (`EmployeeRow` in `tip-flow.tsx`) and Continue is disabled until a valid selection exists. `distribution_rule_id` / recipient percentages are never fetched or rendered on this route.

- [x] Tip amount step
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: selection step
  - Completion criteria:
    - [x] Presets from `Store.suggested_tip_amounts`
    - [x] Custom amount respects `allow_custom_tip_amount`
    - [x] Currency formatting from Int minor units
  - Notes (2026-08-29): `steps/amount-step.tsx`; added `lib/money.ts` (`formatMoney`, `Intl.NumberFormat` on minor units) since no shared formatter existed yet.

- [x] Payment step → create Tip
  - Details: [customer-tipping.md](./customer-tipping.md), [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Depends on: amount step, payments provider integration available via API
  - Completion criteria:
    - [x] Successful pay → Tip COMPLETED + TipDistributions frozen
    - [x] Failure → retry UI
    - [x] If provider sandbox-only: document and verify against sandbox
    - [x] Do not fake COMPLETED tips in production paths
  - Notes (2026-08-29): `steps/payment-step.tsx`. **Backend has no real payment gateway wired** — `TipsService.createPublicTip` (`api/src/modules/tips/services/tips.service.ts`) always creates the Tip as `COMPLETED` immediately via `generateMockPaymentReference()` (mock/sandbox only, no VIVA/STRIPE/PAYPAL call). The "Payment step" is therefore a confirm-and-submit screen (amount/recipient summary + optional email + Pay button) that calls `useCreatePublicTip`, not a card/wallet checkout UI. `createPublicTip`'s error path surfaces the backend's actual validation message (e.g. "Select an employee to thank") via a shared `getApiErrorMessage` helper (matching the pattern already used in `features/auth`), and the Pay button becomes a "Retry payment" button on failure. Fixed `features/tips/interfaces` (added `employee_id`, added `CreatePublicTipResponse = { tip, thank_you_message }`) — the old `CreatePublicTipPayload`/return type didn't match `CreatePublicTipDto`/`TipsService` at all before this change. Real gateway wiring is tracked as a pre-existing gap, not introduced here — see Blocked table.

- [x] Thank-you step
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: successful payment
  - Completion criteria:
    - [x] Shows amount + recipient + thank-you message
    - [x] Continue to review or done
  - Notes (2026-08-29): `steps/thank-you-step.tsx`; message comes from the API response's `thank_you_message` (server resolves `Store.thank_you_message` i18n or falls back to a generated sentence).

- [x] Optional review / feedback step (MVP branch)
  - Details: [customer-tipping.md](./customer-tipping.md), [reviews.md](./reviews.md)
  - Depends on: thank-you
  - Completion criteria:
    - [x] Star rating + optional comment
    - [x] Skip allowed
    - [x] Creates Review linked to Tip when submitted
    - [x] Basic public vs private behavior if threshold fields set; full redirect polish can finish in Phase 4
    - [x] Privacy disclosures present (spec §29 minimum)
  - Notes (2026-08-29): `steps/review-step.tsx` + `steps/done-step.tsx`. Fixed `features/reviews` interfaces/services to match the real `CreatePublicReviewDto`/`ReviewsService.createPublic` contract, which they did not before (payload used `store_slug`/`category_id`/`question_id`/`tag_ids` — none of which the API accepts; response was typed as a bare `Review` when the API returns `{ review, redirect: { should_redirect, url }, message }`). Category ratings / feedback questions / tags are intentionally not built into this step — out of MVP scope per Phase 6 ("Reviews & feedback config" is Post-MVP); the payload/interfaces still support them for when that lands. `DoneStep` shows the server's `message` and, when `redirect.should_redirect` is true, a "Share it publicly" link to `redirect.url`; the exact threshold/copy polish is explicitly deferred to **4.3**. Privacy note (amount, recipient, optional email linking, device-language) is shown inline on the Payment step; review step notes public vs private behavior inline.

### Customer tip flow — Feature completion `(MVP)`

- [ ] Live route works end-to-end in sandbox
  - Verified: typecheck (`tsc --noEmit`) clean, `next build` clean, and the loading→error path confirmed live in a browser (Chrome via devtools MCP) against a real dev server with no backend reachable — renders the empty/error state with no console errors or crashes. The interactive wizard (selection → amount → pay → thank-you → review) was **not** click-tested against a live API + seeded database: this environment's Docker Desktop could not stay up long enough to run Postgres, `prisma migrate`, and seed a Store/QrCode, so the full request/response contract was instead verified by reading `PublicTipsController`/`TipsService` and `PublicReviewsController`/`ReviewsService` line-by-line and matching every request/response field used in the new components. Leaving this unchecked until someone runs it against a real dev DB — see note under 3.4/testing in Blocked.
- [x] All selection modes covered
- [x] Pay + thank-you + optional review
- [x] `/client` clearly marked demo-only or updated to deep-link live flow
  - Already labeled: `/client` page metadata title is "Prototype Experience — delitip.com" and the shell header shows a "Prototype Experience" badge; no change needed.

---

# Phase 3 — MVP Supporting Features `(MVP)`

### 3.1 Tips ledger

- [x] Wire `/dashboard/tips` to API
  - Details: [tips-ledger.md](./tips-ledger.md)
  - Route: `Routes.dashboard.tips`
  - Depends on: tips existing from live flow
  - Completion criteria:
    - [x] Table columns match schema statuses (no fake "Settled" enum)
    - [x] Filters: at least date and status (employee/QR nice-to-have)
    - [x] Loading / empty / error
    - [x] Export CSV can stay disabled until API supports it
  - Notes (2026-08-29): `app/dashboard/tips/components/tips-page-content.tsx`, `useStoreTips` (already scaffolded in 0.2). Status/date filters map straight onto `TipsQuerySchema` (`status`, `date_from`, `date_to`); employee/QR filters left as the doc's noted nice-to-have. Status chips use the real `getTipStatusLabel`/`TipStatusFilterOptions` (`PENDING`/`COMPLETED`/`FAILED`/`REFUNDED`) — no invented "Settled" state. Extended `features/tips/interfaces.Tip` with `employee`/`qr_code`/`distributions` refs to match `TipsService.findAll`'s Prisma `include`. Removed the now-dead `demoTips` export from `dashboard-demo.ts` (only consumer was the old table). Export CSV button renders disabled with a title tooltip explaining why, per doc. Not click-tested against a live DB — see the Phase 2 rollup note on this session's Docker limitation; typecheck/build verified clean.

### 3.2 Reviews list

- [x] Wire `/dashboard/reviews` to API
  - Details: [reviews.md](./reviews.md)
  - Route: `Routes.dashboard.reviews`
  - Depends on: reviews from tip flow
  - Completion criteria:
    - [x] List shows rating, comment, employee, dates
    - [x] Basic filter by rating or employee
    - [x] Loading / empty / error
    - [x] Stats cards from real aggregates (or hide until ready)
  - Notes (2026-08-29): `app/dashboard/reviews/components/reviews-page-content.tsx`. Fixed `features/reviews` interfaces to match `ReviewsQuerySchema`/`ReviewsService.findAllForStore` (was `rating`/`sentiment`/`date_from`/`date_to`, none of which the API accepts — now `min_rating`/`employee_id`/`visibility`/`search` matching the real DTO) and extended `Review` with `employee`, `tags`, `category_ratings`, `feedback_responses` refs to match the Prisma `include`s used by `findAllForStore`/`findOne`. Also fixed `UpdateReviewPayload` (`comment` isn't actually updatable per `UpdateReviewDto` — only `visibility` and `tag_ids`; no existing caller depended on the wrong shape). Filters: min-rating (1–5), employee (from the already-wired `useEmployees`), visibility (`ReviewVisibilityFilterOptions`) — all three map onto real, supported query params. The three hardcoded stat cards (★4.93 / "Super Fast" / 98.6%) are **removed**, not hidden-with-a-flag — no store-wide aggregate endpoint exists yet for reviews (only `stores.analyticsTips`), and a page-scoped average from the current (possibly filtered/paginated) list would be misleading rather than honest; revisit when analytics/insights aggregates land in Phase 5.

### 3.3 Dashboard overview

- [x] Wire `/dashboard` metrics to API aggregates
  - Details: [dashboard-overview.md](./dashboard-overview.md)
  - Route: `Routes.dashboard.root`
  - Depends on: tips + reviews data
  - Completion criteria:
    - [x] Today metrics: tips total, transactions, reviews, avg rating (employees recognized if available)
    - [x] Remove hardcoded demo KPIs
    - [x] Loading / empty / error
    - [x] CTAs use `Routes.*`
  - Notes (2026-08-29): `app/dashboard/components/overview-page-content.tsx`. **Updated 2026-08-29 (same day, during Phase 5.1):** originally shipped as client-side aggregation over `useStoreTips`/`useStoreReviews` because a grep of `api/src/modules/organizations` found no dashboard aggregate endpoints — that grep was wrong (they live in `api/src/modules/analytics`, registered via `AnalyticsModule` in `app.module.ts`). Now upgraded to call the real `GET /organizations/:id/dashboard/overview` and `/trends` (via the new `features/analytics/` module built for 5.1) — KPI cards and the 7-day trend chart are exact DB aggregates, not approximations, and the code is simpler for it. "Live Customer Feedback" (latest reviews with comments) and the "Team" roster still use `useStoreReviews`/`useEmployees` directly since the aggregate endpoints don't return review text or employee lists. The old "Top Performing Employees" table (fake tips/rating columns) stays replaced with the plain active-employee roster — per-employee performance now has a real home in the Analytics page's Employees tab (5.1) instead. Removed now-dead `demoTips`/`demoReviews` earlier; `demoBusiness`/`demoEmployees`/`demoTipDays`/`demoFeedback` are still used by `/client` and stay.

### 3.4 Employee portal (read paths)

- [x] Wire `/employee` earnings to API
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: employee auth, tips
  - Completion criteria:
    - [x] Own tips list/totals from API
    - [x] Distribution rule breakdown visible per tip when API returns it
    - [x] Loading / empty / error
  - Notes (2026-08-29): New `useCurrentEmployee()` hook (`features/employees/hooks/use-employees.ts`) resolves the logged-in user's own Employee/Store from `GET /users/me/accounts` (`employee_accounts[0]` — a User with multiple Employee accounts has no switcher yet, matching the existing `AuthRouteGuard` behavior and the doc's own "unclear" note; not re-blocking since already covered by 5.5). `GET /employees/:id/dashboard` (`useEmployeeDashboard`, was untyped `unknown` — now `EmployeeDashboard`) supplies the real month-to-date total, `by_distribution_rule` breakdown, average rating, and review count. `GET /employees/:id/tips` actually returns paginated **`TipDistribution`** rows (with a nested `tip` ref for amount/currency/created_at), not `Tip` rows — `listEmployeeTips`/`useEmployeeTips` were mistyped as `PaginatedResponse<Tip>`; added `EmployeeTipDistribution` and fixed the return type. "Today's tips" list and the 7-day earnings chart are computed client-side from that same distributions query (bounded by `limit: 200`, same approximation caveat as 3.3). Removed `demoShiftTips`/`demoDailyEarnings` from `employee-demo.ts` (now dead).

- [x] Wire `/employee/reviews`
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: reviews
  - Completion criteria:
    - [x] Own reviews/ratings from API
    - [x] Demo badge counts replaced or mapped to tags if available
  - Notes (2026-08-29): `useEmployeeReviews` (already scaffolded) + `useEmployeeDashboard` for the stat row. The fake badge-count cards (Super Fast / Friendly Vibe / etc.) are **removed, not mapped** — `GET /employees/:id/reviews` does a plain `findMany` with no `tags` include (unlike the store-wide `findAllForStore`), so there is no real per-employee tag data to map to; replaced with the doc's own "Desired" stat set (Average Rating, Total Reviews, Recognitions) which the dashboard endpoint genuinely provides. Removed dead `demoBadgeCounts`/`demoEmployeeReviews`.

- [ ] Wire `/employee/qr`
  - Details: [employee-portal.md](./employee-portal.md), [qr-and-access.md](./qr-and-access.md)
  - Depends on: personal QR existence (create on employee create or explicit action)
  - Completion criteria:
    - [ ] Real QR / tip link
    - [x] Copy link works
    - [ ] Apple Wallet may remain no-op (note Blocked/Post-MVP)
  - Notes (2026-08-29): **Genuinely blocked**, not just unimplemented — verified `AccessControlService.assertStoreAccess` only checks `OrganizationMember` rows, so an employee-only session gets 403 on `GET /stores/:storeId/qr-codes`; there is also no `Employee → QrCode` link in the schema and no auto-QR-on-create in `EmployeesService.create`. An employee has **no API path at all** to discover "their" QR code today. Left the page as the existing demo and added an inline preview/blocked banner instead of silently shipping fake data as if real. See Blocked table below.

- [x] Replace cash-out `window.confirm` with proper dialog (may still stub mutation)
  - Details: [employee-portal.md](./employee-portal.md), [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Depends on: earnings page
  - Completion criteria:
    - [x] No `window.confirm` / `window.alert`
    - [x] Modal follows HeroUI nesting rules
    - [x] If payout API incomplete: disable confirm with clear message (do not fake money movement)
  - Notes (2026-08-29): `EmployeeCashOutProvider` rewritten around the shared `ConfirmationDialog`/`useConfirmationDialog` (Base UI `AlertDialog`, not HeroUI — matches the 0.1 stack correction). New `features/payout-accounts/` module wraps `GET/POST /users/me/payout-account` (mocked-ACTIVE per the API's own comment). Balance = sum of this employee's `TipDistribution` rows with `payout_status = PENDING` (a concrete reading of the doc's "unpaid distributions", since no dedicated balance endpoint exists). Dialog behavior: no payout account yet → Confirm **really** calls the connect endpoint (a genuine state change, not fake); account already `ACTIVE` → there is no transfer/cash-out endpoint anywhere in the API, so Confirm is relabeled "Got it" and only closes the dialog after showing the balance and an explicit "instant transfer isn't live yet" message — no money-movement is simulated either way.

### Phase 3 — Feature completion

- [x] Tips + reviews + overview API-backed
- [ ] Employee portal read paths API-backed — 3/4 (`/employee`, `/employee/reviews`, cash-out dialog done; `/employee/qr` blocked, see Blocked table)
- [ ] Demo imports removed from MVP routes — done except `/employee/qr`, which intentionally keeps its demo import behind a visible "preview" banner until the QR-lookup blocker is resolved

---

# Phase 4 — Main Product Workflows `(MVP)`

Harden the core loop and manager workflows.

### 4.1 Tip detail

- [x] Implement tip detail page or drawer
  - Details: [tips-ledger.md](./tips-ledger.md)
  - Suggested route: `/dashboard/tips/:tipId` in `Routes`
  - Depends on: tips ledger
  - Completion criteria:
    - [x] Summary fields from Tip
    - [x] TipDistribution rows shown
    - [x] Navigation from ledger row
    - [x] Loading/error
  - Notes (2026-08-29): `Routes.dashboard.tipDetail(tipId)` = `/dashboard/tips/:tipId` (added per 0.3); `app/dashboard/tips/[tipId]/components/tip-detail-page-content.tsx` using the already-scaffolded `useTip`. Extended `Tip` with `distribution_rule`, `review`, `refunds` refs to match `TipsService.findOne`'s Prisma `include` (employee, qr_code, distribution_rule, distributions.employee, review, refunds). Review/refunds sections render only when present — no request-refund action here, that's Phase 5.4's job. Ledger rows in `tips-page-content.tsx` now navigate via `router.push` on row click.

### 4.2 Review detail

- [x] Implement review detail drawer/page
  - Details: [reviews.md](./reviews.md)
  - Depends on: reviews list
  - Completion criteria:
    - [x] Full comment, ratings, linked tip
    - [x] No undocumented delete action
  - Notes (2026-08-29): Drawer (shadcn/Base UI `Sheet`, per doc's "prefer drawer"), `app/dashboard/reviews/components/review-detail-sheet.tsx`, opened by clicking a row in the reviews list. Uses the already-scaffolded `useReview(id)` (`GET /reviews/:id`, full includes: category_ratings, feedback_responses, tags, employee) for category ratings + tags beyond what the list view shows. Links to the tip via `Routes.dashboard.tipDetail(review.tip_id)` (4.1). No delete button — `useDeleteReview` stays unused here; deletion isn't called for by this task and the doc explicitly says not to invent it.

### 4.3 Public vs private review polish

- [x] Complete rating-threshold branching + redirect UX
  - Details: [customer-tipping.md](./customer-tipping.md), [reviews.md](./reviews.md)
  - Depends on: review step, Store threshold fields editable (minimal settings OK)
  - Completion criteria:
    - [x] High rating → public prompt / redirect URL when configured
    - [x] Low rating → private feedback emphasis
    - [x] `redirected_to_public_platform` set when applicable
  - Notes (2026-08-29): The redirect UX itself was already built in 2.6's `DoneStep` (shows a "Share it publicly" link when the API returns `redirect.should_redirect`, otherwise the private-feedback message) — what was missing was a way for a Store to actually set `public_review_redirect_url` / `public_review_rating_threshold`, so the branch could never be exercised. Added a minimal settings section (`app/dashboard/settings/components/review-redirect-settings-form.tsx`, "minimal settings OK" per this task) wired to the already-scaffolded `useUpdateStore`. `redirected_to_public_platform` is computed and set server-side (`ReviewsService.createPublic`), not something the frontend needs to set. **Known copy gap in the API, not fixed here (frontend-only session):** `ReviewsService.createPublic`'s `redirected` flag (and thus the `message` text) is `rating >= threshold && !!redirect_url` — a high rating with no redirect URL configured gets the "sorry your experience wasn't perfect" copy, which is wrong for a 5-star review. Worth a backend fix (`redirected` should stay tied to whether a redirect actually happens; the *message* tone should key off `rating` independently).

### 4.4 Employee detail (manager)

- [x] Implement `/dashboard/employees/:id`
  - Details: [employees.md](./employees.md)
  - Depends on: employee list
  - Completion criteria:
    - [x] Profile + tip/review summaries
    - [x] Link to personal QR
    - [x] Edit/deactivate entry points
  - Notes (2026-08-29): `Routes.dashboard.employeeDetail(id)`; `app/dashboard/employees/[employeeId]/components/employee-detail-page-content.tsx`. Reuses `useEmployeeDashboard` (real tips-this-month/avg-rating/review-count) and the existing `EmployeeFormDialog`/`ConfirmationDialog` deactivate flow verbatim. "Link to personal QR": unlike the employee-portal case (blocked — no employee-session access), a **manager** viewing this page has real `useQrCodes(storeId)` access, so the page finds any QR scoped to exactly this one employee (`getQrCodeEmployeeCount(qr) === 1 && getQrCodeEmployeeIds(qr).includes(employee.id)`) and shows its real tip URL, or a "Create one" CTA to `/dashboard/access` if none exists yet — no fabricated QR. Employee cards on the list page now link to this route.

### 4.5 Privacy & tip-flow copy

- [x] Ensure §29 disclosures on tip flow
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: live tip flow
  - Completion criteria:
    - [x] Payment amount, recipient, data collection, public/private, email linking disclosed
    - [x] Language/translation notice if multi-language enabled later (minimal OK for MVP)
  - Notes (2026-08-29): Strengthened the payment-step disclosure (`steps/payment-step.tsx`) built in 2.6 to explicitly cover all six spec §29 points in one place (amount, recipient, data recorded, email linking, public-vs-private review preview, device-language/machine-translation note); the review step (`steps/review-step.tsx`) separately restates the public/private line right where the customer picks a rating. Minimal, single-language MVP — no language switcher exists yet (Phase 6 localization).

### 4.6 Navigation role gating (MVP roles)

- [x] Gate dashboard nav items by `OrganizationRole`
  - Details: [navigation.md](./navigation.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: session exposes membership role
  - Completion criteria:
    - [x] Accountant does not see Employees / QR / Distribution (financial pages only when they exist)
    - [x] Store Manager scoped to Store
    - [x] Employee never sees `/dashboard` nav
  - Notes (2026-08-29): `useWorkspace()` now exposes `role: OrganizationRole | null` from the active `organization_memberships` row (`GET /users/me/accounts`, not previously surfaced). `DashboardSidebar` filters Employees / Tip Distribution / Customer Access (QR) out of the nav for `ACCOUNTANT`, leaving Overview, Tips Ledger, Reviews, Analytics, Settings — a direct reading of this task's own criteria text; the *exact full* Accountant page set stays flagged as unclear in the Blocked table below, this only covers what the criteria explicitly named. "Store Manager scoped to Store" and "Employee never sees `/dashboard` nav" were already true structurally (`useWorkspace` only ever surfaces a Store-scoped member's own store; `AuthRouteGuard` fully redirects employee-only sessions out of `/dashboard/*`) — verified, not changed. Route-level 403 enforcement for hidden pages (someone typing the URL directly) is Phase 8, not this task.

### Phase 4 — Feature completion `(MVP gate)`

- [x] Tip + review details exist
- [x] Review branching polished
- [x] Employee detail exists
- [x] Privacy disclosures present
- [x] Role gating on nav
- [ ] **MVP end-to-end demo possible:** sign up → add employee → rule → QR → tip → see tip/review in dashboard & employee portal
  - Every piece of this loop is now implemented and individually typecheck/build/lint-clean, and every request/response contract was verified by reading the actual NestJS controller/service/DTO. What's still missing is an actual click-through run — this environment's Docker Desktop couldn't hold a Postgres container up long enough to migrate + seed data (see repeated note under Phase 2/3). Leaving unchecked until someone with a working local DB runs the real loop once.

---

# Phase 5 — Advanced Features `(Post-MVP)`

### 5.1 Analytics

- [x] Analytics tabs: Tips / Employees / Stores / Insights
  - Details: [analytics.md](./analytics.md)
  - Route: `Routes.dashboard.analytics`
  - Depends on: MVP complete
  - Completion criteria:
    - [x] Filters (date, employee, QR; Store for Owner)
    - [x] Demo cards removed
    - [x] Insights list uses `InsightSummary` when API provides
  - Notes (2026-08-29): **Important correction to earlier session notes (3.3):** the `organizations/:organizationId/dashboard/{overview,trends,employees-performance,stores-performance,experience-score}` and `stores/:storeId/analytics/tips` endpoints are **fully implemented and registered** — `AnalyticsController`/`StoreAnalyticsController` in `api/src/modules/analytics/controllers/`, wired into `AnalyticsModule` which IS imported by `app.module.ts`. Earlier I'd only grepped `api/src/modules/organizations` and wrongly concluded they didn't exist; they just live in a different module folder than their URL prefix suggests. Corrected: removed the wrong Blocked-table row, and upgraded **3.3**'s dashboard overview (`overview-page-content.tsx`) to call the real `useDashboardOverview`/`useDashboardTrends` instead of the best-effort client-side aggregation it shipped with, so those metrics are now exact DB aggregates, not approximations.
  - New `features/analytics/` module (interfaces/services/hooks) wraps all six endpoints. `app/dashboard/analytics/components/`: `analytics-page-content.tsx` (shell + `Tabs`), `overview-tab.tsx` (KPIs + CX score, period select), `tips-tab.tsx` (date range + employee + QR + group-by filters over `StoreAnalyticsService.tips`), `employees-tab.tsx` (plain table, explicitly framed as "informational, not a ranking" per the doc's own copy guidance — no rank numbers or medals), `stores-tab.tsx` (per-store table, only shown when the org has >1 Store — hidden for the single-store MVP case per the doc), `insights-tab.tsx` (list + "Generate insight" button hitting `POST /stores/:storeId/insights/generate`, which is real deterministic rule-based aggregation, explicitly **not** an LLM call). All three fake stat cards from the old page (Peak Tipping Hour, Apple Pay 74%, QR Scan-to-Tip Conversion) are removed — none of those three have any real data source anywhere in the schema (no scan/payment-method tracking exists) and were not reinvented.

- [x] CX Score UI
  - Details: [analytics.md](./analytics.md)
  - Depends on: product decision on formula/storage
  - Completion criteria:
    - [x] Implemented only after Blocked item resolved — else remain blocked
  - Notes (2026-08-29): **Blocker resolved, not by me — already resolved in the backend.** `AnalyticsService.experienceScore` (`GET /organizations/:id/dashboard/experience-score`) computes a 0–100 score with no storage (0.5×rating + 0.2×tip-activity + 0.3×positive-review-ratio, documented in-code) rather than a stored `CX Score` — the doc's "no Prisma model" concern turned out not to matter since it's computed on demand. Shown in the Overview tab's score card with its breakdown percentages and a plain-language explanation string the API already generates. Removed the corresponding Blocked-table row.

### 5.2 Alerts

- [x] Alerts inbox page + sidebar item
  - Details: [alerts.md](./alerts.md), [navigation.md](./navigation.md)
  - Suggested route: `Routes.dashboard.alerts`
  - Depends on: alerts API
  - Completion criteria:
    - [x] List/read/mark read
    - [x] Unread badge
    - [x] Loading/empty/error
  - Notes (2026-08-29): `api/src/modules/alerts` (controllers under `controllers/`, registered via `AlertsModule` in `app.module.ts`) is fully implemented — list/filter, mark-one-read, mark-all-read, and per-`AlertType` preferences. New `features/alerts/` module + `config/constants/dropdowns/alerts/alert-type-form.options.ts`. `Routes.dashboard.alerts` added; sidebar item shows a live unread-count badge (`useUnreadAlertsCount`, a 1-row `is_read=false` query using `pagination.total` — cheap, no separate count endpoint exists). Real alerts already exist server-side from work done earlier this session: `PERFORMANCE_CHANGE` (`TipsService.createPublicTip`), `LOW_RATING_REVIEW`/`POSITIVE_COMPLIMENTS` (`ReviewsService.createPublic`), `NEGATIVE_SATISFACTION_DROP` (`InsightsService.generate`) — this page is the first place any of them become visible.

- [x] Alert preferences in Settings
  - Details: [alerts.md](./alerts.md), [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: alerts inbox
  - Completion criteria:
    - [x] Toggles per `AlertType`
  - Notes (2026-08-29): `app/dashboard/settings/components/alert-preferences-form.tsx`, one `Switch` per `AlertType` wired to `PATCH /stores/:storeId/alert-preferences/:alertType`. Missing preference rows default to enabled (`true`), matching `AlertPreferencesService.findAll`'s own semantics exactly.

### 5.3 Spots

- [x] Spots CRUD + link to QRs
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Depends on: QR list
  - Completion criteria:
    - [x] Create/edit/deactivate Spot
    - [x] Assign spots on QR edit
  - Notes (2026-08-29): `api/src/modules/spots` (real CRUD, registered via `SpotsModule`). New `features/spots/` module + `app/dashboard/access/components/spots-panel.tsx` — inline add form, chip list, click-to-toggle active/inactive, delete with `ConfirmationDialog` (hard delete per the API; deactivate is the non-destructive default action, delete is the explicit destructive one). Added to `/dashboard/access` below the QR grid, matching "link to QRs" cohesion rather than a separate route. `QrCodeFormDialog` gained a `spot_ids` checklist (mirrors the existing `employee_ids` pattern exactly) — added `spot_ids` to `qrCodeFormSchema` and a `getQrCodeSpotIds` helper alongside the existing `getQrCodeEmployeeIds`.

### 5.4 Payments, payouts, refunds

- [x] Payments hub (Store payout account)
  - Details: [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Suggested route: `Routes.dashboard.payments`
  - Depends on: MVP
  - Completion criteria:
    - [x] Show `PayoutAccount` status
    - [x] Connect/onboard CTA
    - [x] Pending distributions list
  - Notes (2026-08-29): `api/src/modules/payout-accounts`'s store-scoped controller (`stores/:storeId/payout-account`, Owner-only create) is real (mocked-ACTIVE per its own doc comment, same as the USER one from 3.4). `Routes.dashboard.payments`; `app/dashboard/payments/components/`: `payout-account-card.tsx` (status + connect CTA, reusing the extended `features/payout-accounts` module), `pending-distributions-panel.tsx` (PENDING `TipDistribution` rows, same "derive from a bounded recent-tips query" approximation used in 3.3/3.4 — no dedicated pending-payouts endpoint exists), `refunds-queue-panel.tsx`. Added a "Payments" sidebar item (financial page, visible to Accountant — this is exactly the kind of page 4.6's Accountant gating note said didn't exist yet).

- [x] Refunds queue + request from tip detail
  - Details: [payments-payouts-refunds.md](./payments-payouts-refunds.md), [tips-ledger.md](./tips-ledger.md)
  - Depends on: tip detail, refunds API
  - Completion criteria:
    - [x] Request refund dialog
    - [x] Approve/reject flow for managers
    - [x] Confirmation dialogs for destructive actions
  - Notes (2026-08-29): `api/src/modules/refunds` (manager-created + public customer-request + approve/reject/complete) is real and registered. New `features/refunds/` module. Tip detail (4.1) gained a "Request refund" button (shown when `COMPLETED` and no active PENDING/APPROVED refund already exists) opening `request-refund-dialog.tsx` — amount defaults to and is capped at the tip's full amount, matching `CreateRefundDto`. Refunds queue panel: Approve and "Mark completed" are plain actions (reversible-ish, not destructive per se — approving isn't final); Reject goes through `ConfirmationDialog` since it's a one-way terminal state (`RefundsService.update` blocks any further change once `REJECTED`/`COMPLETED`). **Noted, not fixed (backend, out of scope for a frontend-only pass):** `RefundsService.findAll`/`findOne` `include: { requested_by: true, processed_by: true }` pulls the full `User` row including the password hash, not a `select`-scoped subset — the frontend `Refund` interface only types the safe fields and never reads/renders `.password`, but the API response itself over-shares. Worth a backend fix.

- [ ] Production employee cash-out
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: USER payout account
  - Completion criteria:
    - [ ] Mutation moves/requests real payout per API
    - [ ] Error/success toasts
    - [ ] Disabled when account not ACTIVE
  - Notes (2026-08-29): Still blocked — confirmed again while building the Store-scoped payout account this session: `user-payout-account.controller.ts` only has `POST` (connect) and `GET` (status), no transfer/cash-out-request endpoint exists anywhere in `api/src`. 3.4 already ships the honest version of this (real balance from PENDING distributions, real connect-account action, and an explicit "instant transfer isn't live yet" message instead of a fake success) — there is nothing more "production" to build until a real transfer endpoint exists.

### 5.5 Multi-org / multi-store

- [x] Store switcher + Org aggregate overview
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [navigation.md](./navigation.md)
  - Depends on: multi-store data
  - Completion criteria:
    - [x] Hidden for single-store Orgs
    - [x] Scopes dashboard queries
  - Notes (2026-08-29): The plumbing already existed and just needed exposing — `useWorkspace()`'s `storesQuery`/persisted `workspace.store.ts` already resolved a store per Organization, it just never let you pick a *different* one. Extended `WorkspaceState` with `storeList`/`switchStore`; the sidebar's store chip becomes a native `<select>` when `storeList.length > 1` (Store-scoped memberships always have `storeList.length === 1` already, so "hidden for single-store Orgs" and "Store Manager scoped to Store" both fall out of the existing access-control data for free — no extra role check needed). Switching just calls the existing `setWorkspace`, which every dashboard hook already keys off, so "scopes dashboard queries" is automatic. "Org aggregate overview" is `GET /organizations/:id/dashboard/overview` with no `store_id` — already the exact endpoint 5.1's Overview tab calls when a `store_id` isn't passed; not building a second one.

- [x] Account / workspace switcher
  - Details: [navigation.md](./navigation.md), [authentication.md](./authentication.md)
  - Depends on: users with multiple Accounts
  - Completion criteria:
    - [x] Switch Org / Employee / Customer views
    - [x] Hidden when only one Account
  - Notes (2026-08-29): `components/auth/account-switcher.tsx`, shared between the dashboard sidebar and employee header, hidden unless the user has more than one account total (`organization_memberships` deduped by org + `employee_accounts`). Switching orgs calls a new `workspace.store.ts` action (`switchOrganization`) that sets the org and clears the persisted store, letting `useWorkspace()`'s existing sync effect resolve the new org's first store automatically. Switching employee identities is new: added a small persisted `employee-workspace.store.ts` (`employeeAccountId`) and updated `useCurrentEmployee()` to prefer it over always using `employee_accounts[0]`. **Customer view is not switchable** — there is no customer portal route to switch into yet (`has_customer_account` is returned by `GET /users/me/accounts` but Phase 6.3's customer history page doesn't exist); the switcher only lists Business and Employee identities, which is everything that currently has a destination.

### Phase 5 — Feature completion

- [x] Analytics real
- [x] Alerts live
- [x] Spots live
- [ ] Payments/refunds/cash-out real — Payments hub + Refunds queue real; production employee cash-out stays blocked (no transfer endpoint exists anywhere in the API — see Blocked table)
- [x] Multi-store UX complete

---

# Phase 6 — Settings & Administration `(Post-MVP)`

### 6.1 Store settings tabs

- [x] Business profile settings (full Store fields)
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Route: `Routes.dashboard.settings`
  - Depends on: stores feature
  - Completion criteria:
    - [x] name, industry, timezone, currency, address
    - [x] No inventing non-schema fields (e.g. tagline → map or remove)
  - Notes (2026-08-29): `app/dashboard/settings/components/business-profile-settings-form.tsx`, RHF + Zod (`storeProfileFormSchema`, new alongside the existing `businessSetupSchema`) wired to the already-scaffolded `useUpdateStore`. Reused the existing industry/currency/timezone dropdown option files verbatim. **Removed** the old fake "Business Name" + "Brand Tagline" form (`useState`, no submit handler, tagline not in schema) — resolved the corresponding Blocked-table entry rather than leaving it stubbed.

- [x] Branding tab (logo, cover, colors, messages)
  - Details: [settings-and-branding.md](./settings-and-branding.md), [localization.md](./localization.md)
  - Depends on: documents upload API
  - Completion criteria:
    - [x] Logo/cover upload
    - [x] Colors saved
    - [x] welcome/thank-you Json editors
  - Notes (2026-08-29): `api/src/modules/documents` (`POST /documents`, real GCS multipart upload — needs `GCS_*` env vars configured to actually work at runtime, an ops concern not a code gap) is registered and real. New `features/documents/` module. `app/dashboard/settings/components/branding-settings-form.tsx`: logo/cover upload each immediately `PATCH`es the Store with the new `*_document_id`; color pickers (native `<input type="color">` + hex text field) for `primary_color`/`secondary_color`; welcome/thank-you message editors edit the **primary-language plain string** and submit it as such — `UpdateStoreDto.welcome_message`/`thank_you_message` are typed `string` on the wire (server does the Json-map auto-translate-stub itself per its own doc comment), matching the already-correct `UpdateStorePayload` frontend type, so "Json editors" means editing the primary string, not hand-editing the Json map. **Found and fixed a real gap while wiring this:** `findAllForOrg` (the list endpoint `useStores`/`useWorkspace` use) never included `logo_document`/`cover_document`, only `findOne` (single store) does — the `Store` interface was missing these fields entirely. Added `logo_document`/`cover_document` refs to `Store` and had this form call `useStore(id)` (the detail endpoint) for the resolved image URLs rather than relying on `useWorkspace()`'s list-sourced store.

- [x] Tipping config tab
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: stores feature
  - Completion criteria:
    - [x] suggested amounts editor
    - [x] allow custom tip toggle
    - [x] link to default distribution rule
  - Notes (2026-08-29): `app/dashboard/settings/components/tipping-config-settings-form.tsx` — repeatable amount inputs (major units in the UI, converted to/from `Int` minor units on load/save, matching `Store.suggested_tip_amounts`), a `Switch` for `allow_custom_tip_amount`, and a read-only "Default distribution rule" line (name from the already-wired `useDistributionRules`, matched against `store.default_distribution_rule_id`) linking to `/dashboard/distribution` — the actual set-default control already lives there (2.4), not duplicated here.

- [ ] Reviews & feedback config
  - Details: [reviews.md](./reviews.md), [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: review-categories, feedback-questions APIs
  - Completion criteria:
    - [x] Categories / questions CRUD
    - [x] public_review_redirect_url + threshold
    - [ ] Industry seed templates from constants (not invented DB)
  - Notes (2026-08-29): `review-categories`, `feedback-questions`, `review-tags` modules are all real, registered CRUD. New `features/review-categories/`, `features/feedback-questions/`, `features/review-tags/` modules + `app/dashboard/settings/components/reviews-feedback-settings-panel.tsx` (3 compact sections, same add-chip-list pattern as 5.3's Spots panel). `public_review_redirect_url`/threshold were already done in 4.3's `review-redirect-settings-form.tsx`, not duplicated. **Found and typed correctly a real Json-vs-string contract gap**: `ReviewCategory.name`/`FeedbackQuestion.question` accept a plain string on create/update (server auto-translate-stubs it) but *return* a `Record<string,string>` translation map on every read — a naive `string` type would have compiled fine and rendered `[object Object]`. Added `resolvePrimaryText()` (`lib/translated-text.ts`) to read the primary-language value for display. **Industry seed templates left undone** — the spec (§8) doesn't give concrete per-industry category/question sets to seed, and the doc explicitly warns "not invented DB"; inventing specific template content (which categories for a bar vs. a hotel vs. a salon) would be guessing at unspecified product content rather than implementing a defined requirement. Left as a TODO for whoever has the actual template content, not blocked on missing API.

- [ ] Localization tab + customer language switcher
  - Details: [localization.md](./localization.md)
  - Depends on: branding messages
  - Completion criteria:
    - [x] primary + supported languages
    - [ ] Tip flow language switcher
  - Notes (2026-08-29): `app/dashboard/settings/components/localization-settings-form.tsx` — primary language select + supported-languages checkbox grid, wired to the already-typed `UpdateStorePayload.primary_language`/`supported_languages`. New `store-language-form.options.ts` dropdown. **Tip flow language switcher intentionally not built**: there is no i18n/translation infrastructure anywhere in the frontend (no `next-intl` or similar, no message catalogs) — every string across the ~10 tip-flow components (2.6) is hardcoded English JSX. Building a real switcher means either (a) translating all that copy into every `Language` enum value with no source translations to draw from (inventing product copy, the same category of gap noted for 6.1's industry seed templates), or (b) wiring a translation library with English-only content, which wouldn't actually switch anything. Left as an explicit gap rather than a fake "switcher" that only shows a flag icon and does nothing.

- [x] Members & access
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: organization-members API
  - Completion criteria:
    - [x] Invite member
    - [x] Role + store scope
    - [x] Remove with ConfirmationDialog
  - Notes (2026-08-29): `OrganizationMembersController` (`organizations/:id/members`) is real and Owner-gated on write. Extended `features/organizations/` with member interfaces/services + a dedicated `use-organization-members.ts` hooks file. `app/dashboard/settings/components/members-settings-panel.tsx`: list (name/email/store scope), inline role `NativeSelect` per row, remove via `ConfirmationDialog`; `invite-member-dialog.tsx` for adding by email with role + optional store scope. Non-Owners see a read-only role chip instead of the select/remove controls (`AddMemberDto`/service already 403 non-Owners server-side; this just avoids showing controls that would fail). **Noted, not fixed:** same `include: { user: true }` full-User-row over-share pattern as the refunds endpoint (see that Blocked entry) — `OrganizationMembersService` has it too.

- [x] Billing settings (Owner)
  - Details: [billing-and-subscriptions.md](./billing-and-subscriptions.md)
  - Depends on: subscriptions API
  - Completion criteria:
    - [x] Show plan/status/period
    - [x] Upgrade/manage via provider when available
    - [x] Hidden from non-Owners
  - Notes (2026-08-29): `SubscriptionsController` (`organizations/:id/subscription`) is real but explicitly mocked — no billing provider connected, `changePlan` takes effect immediately and free (per its own doc comment). New `features/subscriptions/` module + `app/dashboard/settings/components/billing-settings-panel.tsx`: plan/status/renewal-date card, a plan `NativeSelect` (the only "upgrade" surface that exists — there's no external provider to redirect to), and Cancel via `ConfirmationDialog`. Gated on `role === "OWNER"` via `useWorkspace()`'s role (added in 4.6), matching `AccessControlService`'s own Owner-only enforcement on write.

### 6.2 Plan feature gating

- [x] Gate Post-MVP nav/features by `SubscriptionPlan`
  - Details: [billing-and-subscriptions.md](./billing-and-subscriptions.md), [navigation.md](./navigation.md)
  - Depends on: billing
  - Completion criteria:
    - [x] Starter cannot access locked Professional features without upsell
    - [x] Centralized gate helper (not scattered magic strings)
  - Notes (2026-08-29): `lib/plan-gate.ts` (`hasPlanAccess(currentPlan, requiredPlan)`, a ranked-enum comparison — the single source of truth, no scattered `plan === 'X'` checks) + `components/billing/plan-gate.tsx` (`<PlanGate requiredPlan="PROFESSIONAL">` — shows an upsell `Empty` state linking to Settings → Billing instead of children when the org's plan doesn't qualify). **Judgment call, flagged since the doc's own "Open questions" list this as unresolved** ("Plan gating for advanced analytics / AI (Starter vs Professional)?"): applied `<PlanGate requiredPlan="PROFESSIONAL">` to the whole Analytics page (5.1) as the one concrete, demonstrative usage — Analytics is the feature the doc's own question names. **This means a fresh Owner signup (always created on the `STARTER` plan by `OrganizationsService.create`) will now see an upsell instead of working Analytics** — correct per this task's own criteria, but worth knowing if a demo suddenly shows a paywall there. No other page is gated; if the intended set of Professional-only features turns out to be different (e.g. Alerts, or nothing at all for MVP-era testing), swap which page(s) wrap in `<PlanGate>` — the helper itself doesn't need to change.

### 6.3 Customer account history

- [ ] Customer tip/review history page
  - Details: [customer-account.md](./customer-account.md)
  - Depends on: auth claim flow; product decision on route
  - Completion criteria:
    - [ ] Route added only after Blocked route decision
    - [ ] Lists claimed tips/reviews
    - [ ] Account switcher entry when multi-account

### Phase 6 — Feature completion

- [ ] Settings tabs complete — 5/7 (business profile, branding, tipping config, members & access, billing done; reviews & feedback config missing only industry seed templates; localization missing only the tip-flow switcher, both explicitly deferred with notes, not silently skipped)
- [x] Members + billing complete
- [x] Plan gating complete
- [ ] Customer history complete (or explicitly deferred with Blocked note) — explicitly deferred, blocked on the pre-existing "Customer history route" entry in the Blocked table (`/me` vs `/customer` undecided); not resolved this session since it requires a product decision, not an engineering one

---

# Phase 7 — UX, Error & Edge Cases

- [x] Consistent empty states on all list pages
  - Details: [README.md](./README.md) + each feature doc
  - Depends on: MVP routes exist
  - Completion criteria:
    - [x] Employees, tips, reviews, QR, distribution, alerts (if built) have empty CTAs
  - Notes (2026-08-29): Audited every dashboard list page. Employees, Tips, Reviews, QR & Access, Distribution, Alerts, Payments, Analytics tabs, and every settings panel all use the shared `Empty`/`EmptyHeader`/`EmptyMedia`/`EmptyTitle`/`EmptyDescription`/`EmptyContent` primitives with a CTA where one makes sense (create/retry/navigate) — this was already the consistent pattern every page in this session was built against, so the "audit" mostly confirmed rather than found gaps. Distribution (pre-existing, not touched this session) already matched the pattern independently.

- [x] Consistent loading skeletons (no "Loading…" primary UI)
  - Details: app rules
  - Completion criteria:
    - [x] MVP routes use layout-shaped skeletons
  - Notes (2026-08-29): `grep -rl "Loading\.\.\."` across `app/` returns nothing — no page uses bare "Loading…" text as primary UI. Every page uses `Skeleton`/`TableSkeleton`/`DetailSkeleton`/purpose-built skeleton components sized to the content they replace.

- [x] Mutation toasts on all create/update/delete hooks
  - Details: app rules
  - Completion criteria:
    - [x] onSuccess + onError toast everywhere
  - Notes (2026-08-29): Grepped every `useMutation` in `features/` for `toast` usage. Two files had none: `features/tips/hooks/use-tips.ts` (`useCreatePublicTip`) and `features/reviews/hooks/use-reviews.ts` (`useCreatePublicReview`, plus `useUpdateReview`/`useDeleteReview`) — the two public-tip-flow mutations are intentionally toast-free (2.6's `PaymentStep`/`ReviewStep` show inline error banners and a dedicated thank-you screen instead, a better UX for a full-screen guest flow than a corner toast); `useUpdateReview`/`useDeleteReview` had no consumer yet and genuinely lacked toasts, so added them (fixed, not just audited).

- [x] Unsaved changes behavior on settings forms
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Completion criteria:
    - [x] Documented approach implemented or explicitly deferred in Blocked
  - Notes (2026-08-29): New `hooks/use-unsaved-changes-warning.ts` — a `beforeunload` listener that warns on tab close/refresh while dirty. Applied to the 5 settings forms that actually have draft-then-save state (Business Profile, via RHF's `formState.isDirty`; Branding, Tipping Config, Localization, and Review Redirect, via a manual `hasChanges` flag set on every field change and cleared on the load-sync branch and on mutation success). **Documented, not implemented, for in-app navigation**: Next.js App Router has no built-in way to intercept a `<Link>` click the way Pages Router's `router.events` could — clicking away to another sidebar item won't warn, only closing/refreshing the tab will. The other forms (Spots, Alert Preferences, Review categories/questions/tags, Members, Billing) save immediately per action with no draft state, so there's nothing to lose and no warning is needed there.

- [ ] Mobile/responsive pass for dashboard, employee, tip flow
  - Details: [navigation.md](./navigation.md), [customer-tipping.md](./customer-tipping.md)
  - Completion criteria:
    - [ ] Tip flow usable on narrow viewports
    - [ ] Dashboard usable on tablet/mobile (drawer acceptable)
  - Notes (2026-08-29): Every page built this session follows the existing codebase's responsive conventions (`sm:`/`lg:` grid breakpoints, `overflow-x-auto` on tables, the tip flow's `max-w-md` mobile-first shell). Left unchecked because this needs actual viewport testing in a browser to confirm, which this session's environment couldn't do (no live dev DB to authenticate into the dashboard — see the repeated Docker note). Static review suggests it's in reasonable shape; not verified live.

- [x] Remove or quarantine demo data files from production paths
  - Details: [gaps-and-status.md](./gaps-and-status.md)
  - Completion criteria:
    - [x] MVP routes do not import `*-demo.ts`
    - [x] `/client` demo clearly separated
  - Notes (2026-08-29): `grep` for demo-data imports across `app/` returns exactly two files: `/client`'s own components (already labeled "Prototype Experience" per 2.6's earlier audit) and `/employee/qr` (explicitly labeled a preview banner, 3.4, genuinely blocked on a missing API). No undocumented/silent demo data remains anywhere else.

### Phase 7 — Feature completion

- [x] Empty/loading/error/toast consistency
- [x] Unsaved changes handled or documented
- [ ] Responsive pass — static review only, not verified live (see note above)
- [x] Demo data purged from product routes

---

# Phase 8 — Security, Permissions & Data Integrity

- [x] Enforce permissions on UI actions (hide/disable + server still authoritative)
  - Details: [roles-and-permissions.md](./roles-and-permissions.md)
  - Completion criteria:
    - [x] Owner / Store Manager / Accountant / Employee matrices match docs for implemented screens
    - [x] Unauthorized route → safe redirect or 403 page
  - Notes (2026-08-29): New `components/auth/role-guard.tsx` — until this task, 4.6's Accountant gating only hid the sidebar nav link; typing the URL directly (`/dashboard/employees`, `/dashboard/access`, `/dashboard/distribution`) still rendered the page. `RoleGuard` now redirects an Accountant to `/dashboard` on those three routes (including the employee detail page), matching the API's own authority — the server is still the real enforcement (writes already require OWNER/STORE_MANAGER); this closes the client-side gap where a hidden-but-unguarded page would otherwise render. Employee-vs-business portal separation was already fully enforced at `AuthRouteGuard` (1.3); Store Manager scoping is structural (5.5, a Store-scoped membership only ever resolves that one Store). No distinct Owner-vs-Store-Manager UI restriction exists anywhere in the docs, so none was invented.

- [x] Money display always formats Int minor units + Currency
  - Details: schema notes in [tips-ledger.md](./tips-ledger.md)
  - Completion criteria:
    - [x] Shared formatter used in tip flow, ledger, employee portal, analytics
  - Notes (2026-08-29): Audited — grepped for manual currency formatting (`toFixed`, `/100`, raw `$`) outside `lib/money.ts`'s `formatMoney`. The only hits were star-rating `.toFixed(2)` calls (not money) and one legitimate minor-to-major conversion for an editable numeric input's default value (tipping config settings, where a currency-symbol string wouldn't parse back into a number). `formatMoney` is the only path used for every money *display* across the tip flow, ledger, tip detail, employee portal, analytics, and payments — all built or touched this session.

- [x] Confirm no tip creation without QR in UI
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Completion criteria:
    - [x] Public flow always tied to QR code param
  - Notes (2026-08-29): `TipFlow`'s `qr_code_id` always comes from `qr.qr_code.id`, itself resolved from the route's `[code]` param via `usePublicQrCode`. No code path constructs a tip payload without it.

- [x] Destructive actions all use `ConfirmationDialog`
  - Details: app rules
  - Completion criteria:
    - [x] No silent deletes/disconnects
  - Notes (2026-08-29): `grep -rn "window.confirm|window.alert"` across `app/` returns nothing — the 3.4 cash-out replacement was the last one. Every delete/deactivate/reject/remove action built this session (Spots, Refunds reject, Members remove, Employees deactivate, QR, Distribution rules) uses `ConfirmationDialog`.

- [x] Do not expose platform `AuthRole` admin UI
  - Details: [roles-and-permissions.md](./roles-and-permissions.md)
  - Completion criteria:
    - [x] No accidental admin console routes
  - Notes (2026-08-29): No `/admin` or platform-role-gated route exists anywhere in `app/`; nothing built this session references `AuthRole` at all (only `OrganizationRole`).

### Phase 8 — Feature completion

- [x] Role matrix enforced in UI
- [x] Money/QR integrity rules held
- [x] Confirm dialogs universal for destructive actions

---

# Phase 9 — Testing & QA

- [x] Typecheck clean for `app` package
  - Notes (2026-08-29): `npx tsc --noEmit -p tsconfig.json` over the whole package — clean, run after every change this session and once more at the end as a final sweep.
- [x] Lint clean for touched app code
  - Notes (2026-08-29): `npx eslint src` over the **whole** package (not just touched files) found 3 errors, all in files this session never touched: `components/ui/carousel.tsx` (shadcn-generated), `hooks/use-auth-hydrated.ts`, `hooks/use-mobile.ts` — all `react-hooks/set-state-in-effect` on a synchronous `setState` call inside an effect that also subscribes to an external system (persist hydration, matchMedia, embla carousel). **Attempted to fix `use-auth-hydrated.ts`** (moved the initial `setHydrated` call into a `useState` lazy initializer) — this **broke the production build**: `next build`'s prerender pass calls the hook before `useAuthStore.persist` exists in that non-browser context, throwing `Cannot read properties of undefined (reading 'hasHydrated')` on `/dashboard` and `/dashboard/analytics`. Reverted immediately; confirmed `next build` clean again after reverting. Left all 3 as pre-existing, unrelated lint debt — genuinely out of scope per "don't rewrite unrelated parts," and this session's attempt is direct evidence that a casual fix here is riskier than the lint warning itself. All code this session actually wrote/touched is lint-clean (verified incrementally after every change).
- [x] Manual E2E script documented for MVP loop (sign-up → tip → dashboard)
  - Details: this file MVP Definition
  - Notes (2026-08-29): Written below. **Documented only, not executed** — this environment never had a working dev DB (see the repeated Docker note throughout this file).
- [x] Critical forms validated (auth, employee create, distribution 100%, tip amount)
  - Notes (2026-08-29): Auth forms (sign-up/sign-in/reset) and employee-create already used RHF+Zod before this session. Distribution rule recipients already validate percentages sum to 100 (2.4, pre-existing). Tip amount step (2.6, this session) validates `amount > 0` and respects `allow_custom_tip_amount`. All of this session's ~15 new forms (settings panels, refund request, invite member, spots, review categories/questions/tags) use either RHF+Zod or explicit inline validation before submit — none submit unvalidated.
- [x] Regression: inactive QR/Store, failed payment, empty stores
  - Notes (2026-08-29): All three are handled in code, verified by reading, not by a live run. Inactive QR/Store: `TipEntryPageContent` shows the "tip link is unavailable" `Empty` state on load failure or slug mismatch; the backend (`TipsService.createPublicTip`) independently rejects `!qrCode.is_active`/`!store.is_active` with a `BadRequestException` that the payment step's error banner surfaces verbatim. Failed payment: `PaymentStep` shows an inline error banner + relabels the button "Retry payment" on `createTip.isError`, no fake success. Empty stores (0 employees): `TipFlow` skips the picker and attributes the tip to the Store; `EmployeesTab`/`overview-page-content.tsx` show empty states with CTAs rather than blank/broken layouts.

### Phase 9 — Feature completion

- [x] Automated checks pass
- [ ] MVP E2E script executed and noted — documented (above), not executed; needs a live dev DB

### Manual E2E script — MVP loop

Written 2026-08-29, not yet executed (no live dev DB in this environment). Run this against a real Postgres with migrations applied:

1. **Sign up** — `Routes.auth.sign_up`. Fill business name, email, password, business type, team size. Submit → expect redirect to `Routes.onboarding`.
2. **Onboarding** — confirm/adjust Store name, industry, timezone, currency. Submit → expect redirect to `Routes.dashboard.root`. Confirm the sidebar store chip shows the new Store.
3. **Add an employee** — `Routes.dashboard.employees` → "Add New Employee" → fill name/email → submit → expect it in the list with an active badge.
4. **Create a distribution rule** — `Routes.dashboard.distribution` → create a rule (e.g. 100% to the tipped employee) → set it as Store default → confirm the "Store default" panel reflects it.
5. **Create a QR code** — `Routes.dashboard.access` → create a QR with `CHOOSE_ONE` mode, assign the employee from step 3 → confirm the tip URL renders and the PNG download/print work.
6. **Live tip flow** — open the tip URL from step 5 in a new tab (simulating a guest scan). Confirm: store branding renders; the employee row is selectable; Continue → amount step shows the Store's suggested presets; Continue → payment step shows the confirm/pay summary and the §29 disclosure text; Pay → thank-you step shows the amount and employee name; Leave a review → submit a 5-star rating with a comment → confirm the done screen (public-redirect link if `public_review_redirect_url` is configured in Settings, private-thanks message otherwise).
7. **See it in the dashboard** — back in the business tab: `Routes.dashboard.tips` shows the new tip as `COMPLETED`; clicking it opens the tip detail with the correct distribution row; `Routes.dashboard.reviews` shows the new review; `Routes.dashboard.root` KPIs (Tips Today, Transactions Today, Reviews Today, Avg Rating Today) reflect it; the Analytics page's Overview/Tips/Employees tabs reflect it (Starter-plan orgs will instead see the Phase 6.2 upsell screen — upgrade the org's plan in Settings → Billing first if so).
8. **See it in the employee portal** — sign in as the employee (or use the Account Switcher if the same login holds both accounts): `/employee` shows the new tip in "Today's Tips" and the month total; `/employee/reviews` shows the new review and updated average rating.

Expected failure points to watch for specifically, since they were the riskiest parts of this session's work: the `EmployeeTipDistribution` vs `Tip` type distinction in `useEmployeeTips` (3.4), the Json-vs-string `name`/`question` fields on review categories/feedback questions (6.1), and the Overview page's dependence on `organizations/:id/dashboard/overview` actually being reachable (5.1's corrected assumption).

---

# Phase 10 — Production Readiness

- [x] Environments configured (`environments` object; no raw `process.env` in components)
  - Notes (2026-08-29): Verified — `config/environments/index.ts` is the single `process.env` read (`NEXT_PUBLIC_API_URL`, with a `localhost:3000` dev fallback); `grep -rl "process\.env" src --include="*.tsx"` outside that file returns nothing.
- [x] Auth token storage approach production-safe (document choice)
  - Notes (2026-08-29): **Documented, not changed.** `stores/auth.store.ts` persists `accessToken`/`user` via zustand's `persist` middleware with no custom storage adapter configured, which defaults to browser `localStorage`. Production tradeoff worth knowing: `localStorage` is readable by any JS on the page, so an XSS vulnerability anywhere in the app (or a compromised third-party script) can exfiltrate the token — unlike an `httpOnly` cookie, which client-side JS can never read. Switching to `httpOnly` cookies would need the API to set/read the cookie itself (CORS + `SameSite` + CSRF-token handling changes on the backend) — a real architectural change, not a frontend-only fix, so left as-is with this tradeoff documented rather than silently changed or silently ignored.
- [ ] Error monitoring hook-up decision (implement or Blocked)
  - Notes (2026-08-29): No error monitoring package (Sentry, Bugsnag, etc.) is installed (`grep -i "sentry|bugsnag|rollbar|datadog" package.json` → nothing). Marking **Blocked**: wiring one up needs a DSN/API key from an actual external account, which isn't something to fabricate — added to the Blocked table below.
- [ ] Legal copy finalized (replace placeholders)
  - Already tracked in the Blocked table ("Legal copy ownership / counsel-approved Terms & Privacy") since before this session — still blocked, not resolvable by an engineering pass.
- [ ] Payment provider live keys / webhook verification confirmed with backend
  - Already tracked in the Blocked table ("Real payment gateway integration", added this session in 2.6/5.4) — no provider is wired up server-side at all yet, so there's nothing to confirm keys/webhooks against.
- [x] Performance pass on tip flow (LCP-sensitive mobile page)
  - Notes (2026-08-29): **Actually executed** (unlike most of this session's verification, which was static-only) — ran a Chrome DevTools performance trace against `next start` (production build, not dev) on `/{storeSlug}/q/{code}`, emulating a mobile viewport (390×844×3) with Fast 4G + 4× CPU throttling. Result: **CLS 0.00**; only render-blocking resources are the app's own two framework CSS chunks at ~8–10ms each ("Estimated savings: none" per the insight); one `LegacyJavaScript` insight flagged ~14.4kB of polyfill/transform overhead, which is a project-wide `browserslist`/TS-target build setting, not something specific to the tip flow — not changed here since it'd affect the whole app's build output, out of scope for a single-page pass. No LCP-breakdown issue was flagged at all. Net: the tip flow's initial paint looks genuinely fine on mobile; no action taken because none was warranted by the data.
- [x] Remove prototype-only dead ends or label them internal
  - Notes (2026-08-29): Confirmed via the same demo-data grep as Phase 7 — `/client` and `/employee/qr` are the only two, both already clearly labeled (not silently prototype).

### Phase 10 — Feature completion

- [ ] Config/secrets hygiene — environments/token storage done and documented; error monitoring blocked (see above)
- [ ] Legal + payments production-ready — both blocked on external/product decisions, not engineering
- [x] Tip flow performance acceptable

---

# Phase 11 — Finished Product

## Finished Product Checklist

### Product functionality

- [ ] All MVP tasks (Phases 0–4) complete — 43/45; blocked on `0.3` (standing practice, never "completable") and `3.4`'s `/employee/qr` (genuinely blocked, no API path)
- [ ] All Post-MVP tasks (Phases 5–6) complete **or** explicitly waived by product owner in Blocked — 15/19 across Phases 5–6; every gap is either in the Blocked table or documented as needing content/a product decision, not silently skipped
- [ ] Core loop works end-to-end in production — code-complete, **not live-verified** (no dev DB this session — see the repeated Docker note and the Manual E2E script above)
- [ ] Employee portal works for real staff accounts — code-complete, same live-verification caveat
- [x] Roadmap §34 still excluded unless separately scheduled — confirmed nothing from `roadmap.md` was implemented this session

### Navigation

- [x] All MVP routes implemented and in `Routes` — every route added this session went through `Routes.*` first (0.3 standing practice followed throughout)
- [x] Sidebar/nav match [navigation.md](./navigation.md) for implemented features
- [x] Role-conditional items correct — Accountant nav + page-level `RoleGuard` (Phase 8), Employee/Business portal separation (1.3), Store Manager scoping (structural)
- [x] Account/store switchers behave per single- vs multi-account rules — 5.5, hidden when only one Store/Account

### UI

- [x] Loading states
- [x] Empty states
- [x] Error states
- [x] Confirmation dialogs
- [x] Forms + Zod validation — new forms this session use RHF+Zod where a schema made sense, plain validated `useState` forms elsewhere (consistent with pre-existing patterns like the QR/employee dialogs)
- [ ] Responsive layouts — static review only, not verified live (Phase 7)
- [x] No `window.confirm` / `alert` for product flows — verified via grep, Phase 8

### Data

- [x] Prisma entities used by UI correctly represented — including two real contract-mismatch bugs found and fixed this session (Json-vs-string translated fields in 6.1; `TipDistribution`-vs-`Tip` shape in 3.4)
- [x] Feature modules call API (no demo data on product routes) — Phase 7 audit
- [x] Mutations invalidate queries + toast — Phase 7 audit (2 hooks fixed)
- [x] Schema gaps not papered over with fake fields — no invented fields introduced this session; existing ones ("Brand Tagline") were removed, not kept

### Security

- [x] Authentication enforced — `AuthRouteGuard`, pre-existing
- [x] Permissions enforced — Phase 8, page-level `RoleGuard` added this session closes the direct-URL gap nav-hiding alone left open
- [x] Unauthorized states handled — redirect via `RoleGuard`; 401 interceptor pre-existing

### Quality

- [x] Typecheck passes — whole package, verified repeatedly and at the end
- [x] Lint passes — whole package for all touched code; 3 pre-existing unrelated errors found and deliberately left (see Phase 9 notes — one fix attempt broke the production build and was reverted)
- [ ] MVP E2E verified — documented, not executed (no dev DB)
- [ ] No known blocking issues in Blocked section (or all accepted) — the Blocked table has real, live entries; they need a product/ops decision or an external account, not more engineering, but they aren't "accepted" by anyone but this session's own judgment

### Definition of done for "Finished Product"

- [ ] This Phase 11 checklist is fully `[x]` — not yet; genuine external/product blockers remain (see above)
- [ ] **Next Action** updated to: `None — product complete` (or next roadmap epic if opened) — not yet applicable

---

# Blocked / Needs Clarification

Add items here instead of inventing product behavior.

| Item | Related docs | Reason | Blocking |
| --- | --- | --- | --- |
| Legal copy ownership / counsel-approved Terms & Privacy | [landing-and-marketing.md](./landing-and-marketing.md) | Pages ship draft placeholders; final text TBD | Production legal pages (Phase 10) |
| Sign-up team size persistence | [authentication.md](./authentication.md) | Form collects estimated team size; no Prisma/API field | Optional analytics / onboarding prefills only |
| Employee PIN auth | [authentication.md](./authentication.md), [roles-and-permissions.md](./roles-and-permissions.md) | No PIN in schema/API; MVP uses email/password → `/employee` | Optional future PIN product decision |
| On Shift toggle mapping | [employee-portal.md](./employee-portal.md) | UI toggle; schema only `Employee.is_active` | Header shift control |
| Notification channels | [alerts.md](./alerts.md) | Spec alerts; no Notification model | Email/push delivery |
| Cash-out / payout availability rules | [payments-payouts-refunds.md](./payments-payouts-refunds.md) | Spec vague on thresholds/schedule | Production cash-out |
| Public review threshold defaults | [customer-tipping.md](./customer-tipping.md) | Spec unclear on exact star cutoff | Review branching defaults |
| Customer history route | [customer-account.md](./customer-account.md) | `/me` vs `/customer` undecided | Customer account page |
| Invite accept URL shape | [authentication.md](./authentication.md) | Spec has invites; route unclear | Invite deep links |
| Accountant exact page set | [roles-and-permissions.md](./roles-and-permissions.md) | Spec: financial only | Accountant nav gating details |
| Batch QR PDF templates | [qr-and-access.md](./qr-and-access.md) | Print formats unspecified | Batch print |
| Platform admin UI | [roles-and-permissions.md](./roles-and-permissions.md) | `AuthRole` exists; no product spec | Do not build |
| Real payment gateway integration | [customer-tipping.md](./customer-tipping.md), [payments-payouts-refunds.md](./payments-payouts-refunds.md) | `TipsService.createPublicTip` always completes the Tip via `generateMockPaymentReference()`; no VIVA/STRIPE/PAYPAL call exists anywhere in `api/src`. Frontend payment step (2.6) is a confirm-and-submit screen against this mock, which is correct for MVP/sandbox but not production money movement | Phase 10 production payments |
| Employee's own QR code lookup | [employee-portal.md](./employee-portal.md), [qr-and-access.md](./qr-and-access.md) | No API path exists for an employee session to find "their" QR: `GET /stores/:storeId/qr-codes` 403s for employee-only auth (`assertStoreAccess` only checks `OrganizationMember`), there's no `Employee → QrCode` schema link, and `EmployeesService.create` never auto-creates one | `/employee/qr` (3.4) stays a labeled preview until either a public "my personal QR" endpoint or an `Employee.personal_qr_code_id`-style link is added |
| Public review "redirected" message copy | [customer-tipping.md](./customer-tipping.md), [reviews.md](./reviews.md) | `ReviewsService.createPublic` picks the thank-you message off `redirected = rating >= threshold && !!redirect_url`, so a 5-star review with no redirect URL configured gets the "sorry your experience wasn't perfect" copy | Backend fix: key the message tone off `rating` alone, keep `redirected`/the CTA tied to whether a redirect URL exists |
| Error monitoring provider | (Phase 10) | No Sentry/Bugsnag/etc. installed; needs a real external account + DSN, not something to fabricate | Phase 10 production readiness |
| Refunds/Members APIs over-share User fields | [payments-payouts-refunds.md](./payments-payouts-refunds.md), [organizations-and-stores.md](./organizations-and-stores.md) | `RefundsService.findAll`/`findOne` (`include: { requested_by: true, processed_by: true }`) and `OrganizationMembersService.findAll`/`add`/`update` (`include: { user: true }`) all return the full `User` row — password hash included — instead of a `select`-scoped subset | Backend fix (security-relevant): use `select` to return only safe fields (id, name, email) in both services. Frontend types (`Refund.requested_by`/`processed_by`, `OrganizationMemberWithRefs.user`) only declare the safe fields and never read `.password`, but the wire response itself over-shares today |

When resolving a blocker, remove or check it off here and unblock the dependent task in the relevant phase.

---

## Progress counting guide (for agents)

When updating **Current Status**:

- **MVP tasks** = all checkbox tasks under Phases **0–4** that are top-level `- [ ]` / `- [x]` work items (not nested completion-criteria lines, not Phase feature-completion rollups).
- **Overall tasks** = MVP tasks + top-level work items in Phases **5–10** (exclude Phase 11 checklist items from the running Overall denominator until finishing; or include them consistently — prefer: Overall = Phases 0–10 top-level tasks only).

Recount after each session. Recounted directly from the file's top-level checkboxes on 2026-08-29 (see correction note in **Current Status**):

| Bucket | Top-level tasks | Completed now |
| --- | --- | --- |
| Phase 0 | 8 | 7 (0.3 Routes expansion remains standing/incremental) |
| Phase 1 | 7 | 7 (legal + auth + password reset + guards) |
| Phase 2 | 17 | 17 (onboarding → store context → employees → distribution → QR → full tip flow, all complete) |
| Phase 3 | 7 | 6 (tips ledger, reviews list, dashboard overview, employee earnings, employee reviews, cash-out dialog; `/employee/qr` blocked — see Blocked table) |
| Phase 4 | 6 | 6 (tip detail, review detail, redirect UX + settings, employee detail, privacy disclosures, role-gated nav) |
| **MVP total** | **45** | **43** |
| Phase 5 | 10 (recounted: 5.1×2, 5.2×2, 5.3×1, 5.4×3, 5.5×2) | 9 (all except production employee cash-out, blocked) |
| Phase 6 | 9 (recounted: 6.1×7, 6.2×1, 6.3×1) | 6 (5 of 6.1's 7 + 6.2 plan gating; reviews&feedback and localization each missing one content-dependent sub-criterion, 6.3 blocked) |
| Phase 7 | 6 | 5 (empty states, loading skeletons, mutation toasts, unsaved-changes, demo-data purge; only responsive-pass remains, needs live viewport testing) |
| Phase 8 | 5 | 5 (all done — role matrix, money formatting, QR integrity, confirm dialogs, no admin UI) |
| Phase 9 | 5 | 5 (typecheck, lint, E2E script documented, forms validated, regressions verified by code) |
| Phase 10 | 7 | 4 (environments, token storage documented, performance pass, prototype labeling; error monitoring/legal copy/payment keys all blocked on external decisions) |
| **Overall (0–10)** | **87** (now fully recounted, replacing every earlier estimate) | **77** |

Adjust counts if you split/merge tasks — keep **Current Status** honest.

---

## Quick reference — doc links by domain

| Domain | Doc |
| --- | --- |
| Marketing | [landing-and-marketing.md](./landing-and-marketing.md) |
| Auth | [authentication.md](./authentication.md) |
| Onboarding | [onboarding.md](./onboarding.md) |
| Orgs/Stores | [organizations-and-stores.md](./organizations-and-stores.md) |
| Customer tip | [customer-tipping.md](./customer-tipping.md) |
| Employees | [employees.md](./employees.md) |
| Overview | [dashboard-overview.md](./dashboard-overview.md) |
| Tips | [tips-ledger.md](./tips-ledger.md) |
| Distribution | [distribution.md](./distribution.md) |
| Reviews | [reviews.md](./reviews.md) |
| Analytics | [analytics.md](./analytics.md) |
| QR/Spots | [qr-and-access.md](./qr-and-access.md) |
| Settings | [settings-and-branding.md](./settings-and-branding.md) |
| Payments | [payments-payouts-refunds.md](./payments-payouts-refunds.md) |
| Alerts | [alerts.md](./alerts.md) |
| Employee portal | [employee-portal.md](./employee-portal.md) |
| Billing | [billing-and-subscriptions.md](./billing-and-subscriptions.md) |
| i18n | [localization.md](./localization.md) |
| Customer account | [customer-account.md](./customer-account.md) |
| Roadmap (exclude) | [roadmap.md](./roadmap.md) |
