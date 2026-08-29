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

**Current Phase:** Phase 0 — Foundation

**MVP Progress:** 2 / 48 tasks completed

**Overall Progress:** 2 / 112 tasks completed

**Product state:** Marketing + prototype shells exist with **demo data only**. `app/src/features/` is empty. `ApiRoutes` is `{}`. Auth does not call the API or redirect. No route guards.

**Next Task:** Wire `ApiRoutes` to match existing API modules and scaffold first feature modules

**Next Documentation:** [README.md](./README.md) (architecture) + API controllers under `api/src/modules/`

---

## Next Action

> The next task for the AI coding agent is:

- [ ] **0.2** Populate `ApiRoutes` and establish `features/` module pattern for auth + stores
  - Documentation: [README.md](./README.md), app rules, `app/src/config/api/routes.ts`
  - Phase: 0 — Foundation
  - Depends on: nothing (start here)
  - Done means: `ApiRoutes` has real endpoint paths for at least auth, organizations, stores, employees, qr-codes, tips, reviews, distribution-rules; one example `features/auth/` (or stores) folder with interfaces + services + hooks skeleton; axios auth header hook point documented/implemented for token attach

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

- [ ] Confirm shared UI primitives available for MVP work
  - Details: [README.md](./README.md), `app/src/components/ui/`
  - Depends on: none
  - Completion criteria:
    - [ ] `ConfirmationDialog` located and usable
    - [ ] Form helpers / toast patterns identified
    - [ ] Skeleton approach documented for list/detail pages (reuse or add `table-skeleton` / page skeletons as needed)
    - [ ] Agent notes any missing primitive required before Phase 2 (do not invent one-off modals)

### 0.2 API client & feature modules

- [ ] Populate `ApiRoutes` for existing backend modules
  - Details: [README.md](./README.md), `api/src/modules/**`
  - Depends on: none
  - Completion criteria:
    - [ ] `app/src/config/api/routes.ts` exports paths for auth, organizations, members, stores, employees, qr-codes, spots, distribution-rules, tips, reviews, review-categories, review-tags, feedback-questions, refunds, payout-accounts, alerts, analytics, insights, subscriptions, documents
    - [ ] No hardcoded API path strings in new service code
    - [ ] Axios instance still central (`axios.ts`)

- [ ] Scaffold `features/` domains used by MVP
  - Details: [README.md](./README.md)
  - Depends on: ApiRoutes
  - Completion criteria:
    - [ ] Folders exist with hooks/services/interfaces for at least: `auth`, `stores`, `employees`, `qr-codes`, `distribution`, `tips`, `reviews`
    - [ ] No React components under `features/`
    - [ ] Query key conventions documented in interfaces or hook files (kebab-case)

- [ ] Auth token attachment on axios
  - Details: [authentication.md](./authentication.md)
  - Depends on: auth store or session approach chosen
  - Completion criteria:
    - [ ] Request interceptor attaches token when present
    - [ ] 401 handling path defined (redirect to sign-in via `Routes.auth.sign_in`)

### 0.3 Routes registry expansion (as needed)

- [ ] Add missing `Routes` keys before implementing pages that need them
  - Details: [navigation.md](./navigation.md), [README.md](./README.md)
  - Depends on: none (do incrementally per feature — do not invent unused routes)
  - Completion criteria:
    - [ ] Any new page path added to `routes.ts` first
    - [ ] No hardcoded `href="/..."` in new/changed navigation code

### 0.4 Dropdown vocabulary for MVP enums

- [ ] Create dropdown option files for MVP enums
  - Details: app rules; schema enums
  - Depends on: feature interfaces for enum types
  - Completion criteria:
    - [ ] Options exist for at least: `StoreIndustry`, `TipStatus`, `QrCodeSelectionMode`, `OrganizationRole`, `PayoutStatus`, `ReviewVisibility` / sentiment as needed
    - [ ] Labels not defined inline in page components

### Phase 0 — Feature completion

- [ ] ApiRoutes populated for MVP domains
- [ ] Feature module pattern established
- [ ] Axios auth hook-up ready
- [ ] MVP enum dropdowns started
- [ ] Shared destructive/loading patterns confirmed

---

# Phase 1 — Authentication & Access `(MVP)`

### 1.1 Legal pages

- [ ] Implement `/legal/terms`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Route: `Routes.legal.terms`
  - Depends on: none
  - Completion criteria:
    - [ ] `page.tsx` exists
    - [ ] Linked from sign-up and footer
    - [ ] Content placeholder acceptable if legal copy TBD (note in Blocked if copy missing)

- [ ] Implement `/legal/privacy`
  - Details: [landing-and-marketing.md](./landing-and-marketing.md)
  - Route: `Routes.legal.privacy`
  - Depends on: none
  - Completion criteria:
    - [ ] `page.tsx` exists
    - [ ] Linked from sign-up and footer

### 1.2 Auth UI → API

- [ ] Wire business sign-up to API
  - Details: [authentication.md](./authentication.md), [onboarding.md](./onboarding.md)
  - Route: `Routes.auth.sign_up`
  - Depends on: Phase 0 auth feature module, ApiRoutes
  - Completion criteria:
    - [ ] Zod validation via `zodResolver`
    - [ ] Creates User + Organization + first Store (or equivalent API contract)
    - [ ] Business Type mapped to `StoreIndustry`
    - [ ] Success redirects to onboarding or dashboard
    - [ ] Error toast on failure
    - [ ] Terms/Privacy links work

- [ ] Wire business sign-in to API
  - Details: [authentication.md](./authentication.md)
  - Route: `Routes.auth.sign_in`
  - Depends on: auth feature module
  - Completion criteria:
    - [ ] Session/token stored
    - [ ] Redirect to `Routes.dashboard.root` (or account switcher if multi-account — Post-MVP OK to skip switcher)
    - [ ] Error states for invalid credentials

- [ ] Wire employee sign-in to API
  - Details: [authentication.md](./authentication.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: auth API; clarify PIN vs password
  - Completion criteria:
    - [ ] Employee can reach `Routes.employee.root` after auth
    - [ ] If PIN unsupported by schema/API: document in Blocked and use supported method (email/password or phone) without inventing PIN persistence

- [ ] Implement forgot password + reset flow
  - Details: [authentication.md](./authentication.md)
  - Routes: `Routes.auth.forgot_password` (+ reset route added to `Routes`)
  - Depends on: `PasswordResetToken` API
  - Completion criteria:
    - [ ] Forgot-password page exists
    - [ ] Reset page exists and consumes token
    - [ ] Success/error states
    - [ ] Sign-in “Forgot password?” link works

### 1.3 Route guards & session

- [ ] Protect `/dashboard/*` and `/employee/*`
  - Details: [roles-and-permissions.md](./roles-and-permissions.md), [navigation.md](./navigation.md)
  - Depends on: working sign-in
  - Completion criteria:
    - [ ] Unauthenticated users redirected to sign-in
    - [ ] Employee-only users cannot use business portal (and vice versa) per membership/employee link
    - [ ] Fallback paths use `Routes.*`

### Phase 1 — Feature completion

- [ ] Legal pages live
- [ ] Sign-up/sign-in call API
- [ ] Password reset works
- [ ] Guards enforce auth
- [ ] No fake 1s-delay-only auth submit on MVP paths

---

# Phase 2 — Core MVP Features `(MVP)`

Dependency order: Store context → Employees → Distribution → QR → Customer tip flow.

### 2.1 Onboarding (minimal)

- [ ] Implement post-sign-up onboarding for Org + first Store
  - Details: [onboarding.md](./onboarding.md), [organizations-and-stores.md](./organizations-and-stores.md)
  - Suggested route: add `Routes.onboarding`
  - Depends on: Phase 1 sign-up
  - Completion criteria:
    - [ ] Single-store UX copy (Org jargon hidden)
    - [ ] Store name, industry, timezone, currency capturable
    - [ ] Prefills from sign-up when available
    - [ ] Completion lands on dashboard
    - [ ] Loading/error states
    - [ ] Full 7-step wizard may be deferred but Steps 1 + “skip to dashboard” must exist; remaining steps can deep-link later tasks

### 2.2 Store context in business shell

- [ ] Replace `demoBusiness` sidebar chip with live Store
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [navigation.md](./navigation.md)
  - Depends on: auth + stores feature
  - Completion criteria:
    - [ ] Sidebar shows current Store name / basic meta from API
    - [ ] Dashboard queries scoped to current Store id
    - [ ] Multi-store switcher not required for MVP (single store)

### 2.3 Employees `(MVP)`

- [ ] Wire `/dashboard/employees` list to API
  - Details: [employees.md](./employees.md)
  - Route: `Routes.dashboard.employees`
  - Depends on: Store context, employees feature
  - Completion criteria:
    - [ ] List/cards show API employees
    - [ ] Loading skeleton
    - [ ] Empty state + CTA
    - [ ] Error state
    - [ ] Active/inactive visible via `is_active`

- [ ] Implement Create Employee modal
  - Details: [employees.md](./employees.md)
  - Depends on: employee list
  - Completion criteria:
    - [ ] Fields: full_name, email, position?, photo optional
    - [ ] Zod validation
    - [ ] Success toast + list invalidate
    - [ ] Error toast
    - [ ] “Add New Employee” button wired

- [ ] Implement Edit + deactivate employee
  - Details: [employees.md](./employees.md)
  - Depends on: create employee
  - Completion criteria:
    - [ ] Edit form works
    - [ ] Deactivate uses `ConfirmationDialog` (prefer `is_active=false`)
    - [ ] Permissions: Owner / Store Manager only

### Employees — Feature completion `(MVP)`

- [ ] List route API-backed
- [ ] Create modal complete
- [ ] Edit/deactivate complete
- [ ] Loading/empty/error complete
- [ ] Detail page optional for MVP (tracked in Phase 4)

### 2.4 Distribution rules `(MVP)`

- [ ] Replace static policy cards with rules library
  - Details: [distribution.md](./distribution.md)
  - Route: `Routes.dashboard.distribution`
  - Depends on: Store context, employees (for employee recipients)
  - Completion criteria:
    - [ ] List rules from API
    - [ ] Show recipients summary
    - [ ] Empty state

- [ ] Create / Edit Distribution Rule modal
  - Details: [distribution.md](./distribution.md)
  - Depends on: rules library
  - Completion criteria:
    - [ ] Name + recipients (STORE / EMPLOYEE + %)
    - [ ] Validation: percentages sum to 100
    - [ ] sort_order for rounding remainder
    - [ ] Save invalidates queries

- [ ] Set Store default distribution rule
  - Details: [distribution.md](./distribution.md)
  - Depends on: create rule
  - Completion criteria:
    - [ ] `Store.default_distribution_rule_id` updatable from UI
    - [ ] Default visible on Distribution hub

### Distribution — Feature completion `(MVP)`

- [ ] CRUD for rules (delete can be Post-MVP if blocked by “in use”)
- [ ] Store default settable
- [ ] Pending payouts UI can remain stub until Phase 5 payments

### 2.5 QR codes `(MVP)`

- [ ] Replace single demo card with QR list on `/dashboard/access`
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Route: `Routes.dashboard.access`
  - Depends on: employees, distribution
  - Completion criteria:
    - [ ] Lists QRs for Store
    - [ ] Shows label, mode, employee count, active flag
    - [ ] Loading/empty/error

- [ ] Create / Edit QR modal
  - Details: [qr-and-access.md](./qr-and-access.md), [customer-tipping.md](./customer-tipping.md)
  - Depends on: QR list
  - Completion criteria:
    - [ ] label, selection_mode, employees, optional distribution_rule_id, is_active
    - [ ] Mode vs employee-count rules respected
    - [ ] Tip URL displayed using store slug + code
    - [ ] Routes helper added (no hardcoded tip URLs)

- [ ] Basic download/print of QR image
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Depends on: create QR
  - Completion criteria:
    - [ ] At least one working download or print for a single QR
    - [ ] Batch PDF may remain Post-MVP if blocked — note in Blocked

### QR — Feature completion `(MVP)`

- [ ] List + create/edit API-backed
- [ ] Tip URL correct for public route
- [ ] Spots deferred to Post-MVP unless trivial

### 2.6 Live customer tip flow `(MVP)` — critical path

- [ ] Implement public tip entry route `/{storeSlug}/q/{code}`
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: QR create, public tip/store APIs
  - Completion criteria:
    - [ ] Route registered in `Routes`
    - [ ] Loads Store + QrCode + employees
    - [ ] Inactive QR/Store → error state
    - [ ] No business/employee chrome
    - [ ] Mobile-first layout

- [ ] Employee selection step (all modes)
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: tip entry route
  - Completion criteria:
    - [ ] 0 employees → skip
    - [ ] 1 employee → auto thank
    - [ ] CHOOSE_ONE / CHOOSE_MANY / TEAM behave per docs
    - [ ] Distribution rule never shown to customer

- [ ] Tip amount step
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: selection step
  - Completion criteria:
    - [ ] Presets from `Store.suggested_tip_amounts`
    - [ ] Custom amount respects `allow_custom_tip_amount`
    - [ ] Currency formatting from Int minor units

- [ ] Payment step → create Tip
  - Details: [customer-tipping.md](./customer-tipping.md), [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Depends on: amount step, payments provider integration available via API
  - Completion criteria:
    - [ ] Successful pay → Tip COMPLETED + TipDistributions frozen
    - [ ] Failure → retry UI
    - [ ] If provider sandbox-only: document and verify against sandbox
    - [ ] Do not fake COMPLETED tips in production paths

- [ ] Thank-you step
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: successful payment
  - Completion criteria:
    - [ ] Shows amount + recipient + thank-you message
    - [ ] Continue to review or done

- [ ] Optional review / feedback step (MVP branch)
  - Details: [customer-tipping.md](./customer-tipping.md), [reviews.md](./reviews.md)
  - Depends on: thank-you
  - Completion criteria:
    - [ ] Star rating + optional comment
    - [ ] Skip allowed
    - [ ] Creates Review linked to Tip when submitted
    - [ ] Basic public vs private behavior if threshold fields set; full redirect polish can finish in Phase 4
    - [ ] Privacy disclosures present (spec §29 minimum)

### Customer tip flow — Feature completion `(MVP)`

- [ ] Live route works end-to-end in sandbox
- [ ] All selection modes covered
- [ ] Pay + thank-you + optional review
- [ ] `/client` clearly marked demo-only or updated to deep-link live flow

---

# Phase 3 — MVP Supporting Features `(MVP)`

### 3.1 Tips ledger

- [ ] Wire `/dashboard/tips` to API
  - Details: [tips-ledger.md](./tips-ledger.md)
  - Route: `Routes.dashboard.tips`
  - Depends on: tips existing from live flow
  - Completion criteria:
    - [ ] Table columns match schema statuses (no fake “Settled” enum)
    - [ ] Filters: at least date and status (employee/QR nice-to-have)
    - [ ] Loading / empty / error
    - [ ] Export CSV can stay disabled until API supports it

### 3.2 Reviews list

- [ ] Wire `/dashboard/reviews` to API
  - Details: [reviews.md](./reviews.md)
  - Route: `Routes.dashboard.reviews`
  - Depends on: reviews from tip flow
  - Completion criteria:
    - [ ] List shows rating, comment, employee, dates
    - [ ] Basic filter by rating or employee
    - [ ] Loading / empty / error
    - [ ] Stats cards from real aggregates (or hide until ready)

### 3.3 Dashboard overview

- [ ] Wire `/dashboard` metrics to API aggregates
  - Details: [dashboard-overview.md](./dashboard-overview.md)
  - Route: `Routes.dashboard.root`
  - Depends on: tips + reviews data
  - Completion criteria:
    - [ ] Today metrics: tips total, transactions, reviews, avg rating (employees recognized if available)
    - [ ] Remove hardcoded demo KPIs
    - [ ] Loading / empty / error
    - [ ] CTAs use `Routes.*`

### 3.4 Employee portal (read paths)

- [ ] Wire `/employee` earnings to API
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: employee auth, tips
  - Completion criteria:
    - [ ] Own tips list/totals from API
    - [ ] Distribution rule breakdown visible per tip when API returns it
    - [ ] Loading / empty / error

- [ ] Wire `/employee/reviews`
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: reviews
  - Completion criteria:
    - [ ] Own reviews/ratings from API
    - [ ] Demo badge counts replaced or mapped to tags if available

- [ ] Wire `/employee/qr`
  - Details: [employee-portal.md](./employee-portal.md), [qr-and-access.md](./qr-and-access.md)
  - Depends on: personal QR existence (create on employee create or explicit action)
  - Completion criteria:
    - [ ] Real QR / tip link
    - [ ] Copy link works
    - [ ] Apple Wallet may remain no-op (note Blocked/Post-MVP)

- [ ] Replace cash-out `window.confirm` with proper dialog (may still stub mutation)
  - Details: [employee-portal.md](./employee-portal.md), [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Depends on: earnings page
  - Completion criteria:
    - [ ] No `window.confirm` / `window.alert`
    - [ ] Modal follows HeroUI nesting rules
    - [ ] If payout API incomplete: disable confirm with clear message (do not fake money movement)

### Phase 3 — Feature completion

- [ ] Tips + reviews + overview API-backed
- [ ] Employee portal read paths API-backed
- [ ] Demo imports removed from MVP routes

---

# Phase 4 — Main Product Workflows `(MVP)`

Harden the core loop and manager workflows.

### 4.1 Tip detail

- [ ] Implement tip detail page or drawer
  - Details: [tips-ledger.md](./tips-ledger.md)
  - Suggested route: `/dashboard/tips/:tipId` in `Routes`
  - Depends on: tips ledger
  - Completion criteria:
    - [ ] Summary fields from Tip
    - [ ] TipDistribution rows shown
    - [ ] Navigation from ledger row
    - [ ] Loading/error

### 4.2 Review detail

- [ ] Implement review detail drawer/page
  - Details: [reviews.md](./reviews.md)
  - Depends on: reviews list
  - Completion criteria:
    - [ ] Full comment, ratings, linked tip
    - [ ] No undocumented delete action

### 4.3 Public vs private review polish

- [ ] Complete rating-threshold branching + redirect UX
  - Details: [customer-tipping.md](./customer-tipping.md), [reviews.md](./reviews.md)
  - Depends on: review step, Store threshold fields editable (minimal settings OK)
  - Completion criteria:
    - [ ] High rating → public prompt / redirect URL when configured
    - [ ] Low rating → private feedback emphasis
    - [ ] `redirected_to_public_platform` set when applicable

### 4.4 Employee detail (manager)

- [ ] Implement `/dashboard/employees/:id`
  - Details: [employees.md](./employees.md)
  - Depends on: employee list
  - Completion criteria:
    - [ ] Profile + tip/review summaries
    - [ ] Link to personal QR
    - [ ] Edit/deactivate entry points

### 4.5 Privacy & tip-flow copy

- [ ] Ensure §29 disclosures on tip flow
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Depends on: live tip flow
  - Completion criteria:
    - [ ] Payment amount, recipient, data collection, public/private, email linking disclosed
    - [ ] Language/translation notice if multi-language enabled later (minimal OK for MVP)

### 4.6 Navigation role gating (MVP roles)

- [ ] Gate dashboard nav items by `OrganizationRole`
  - Details: [navigation.md](./navigation.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: session exposes membership role
  - Completion criteria:
    - [ ] Accountant does not see Employees / QR / Distribution (financial pages only when they exist)
    - [ ] Store Manager scoped to Store
    - [ ] Employee never sees `/dashboard` nav

### Phase 4 — Feature completion `(MVP gate)`

- [ ] Tip + review details exist
- [ ] Review branching polished
- [ ] Employee detail exists
- [ ] Privacy disclosures present
- [ ] Role gating on nav
- [ ] **MVP end-to-end demo possible:** sign up → add employee → rule → QR → tip → see tip/review in dashboard & employee portal

---

# Phase 5 — Advanced Features `(Post-MVP)`

### 5.1 Analytics

- [ ] Analytics tabs: Tips / Employees / Stores / Insights
  - Details: [analytics.md](./analytics.md)
  - Route: `Routes.dashboard.analytics`
  - Depends on: MVP complete
  - Completion criteria:
    - [ ] Filters (date, employee, QR; Store for Owner)
    - [ ] Demo cards removed
    - [ ] Insights list uses `InsightSummary` when API provides

- [ ] CX Score UI
  - Details: [analytics.md](./analytics.md)
  - Depends on: product decision on formula/storage
  - Completion criteria:
    - [ ] Implemented only after Blocked item resolved — else remain blocked

### 5.2 Alerts

- [ ] Alerts inbox page + sidebar item
  - Details: [alerts.md](./alerts.md), [navigation.md](./navigation.md)
  - Suggested route: `Routes.dashboard.alerts`
  - Depends on: alerts API
  - Completion criteria:
    - [ ] List/read/mark read
    - [ ] Unread badge
    - [ ] Loading/empty/error

- [ ] Alert preferences in Settings
  - Details: [alerts.md](./alerts.md), [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: alerts inbox
  - Completion criteria:
    - [ ] Toggles per `AlertType`

### 5.3 Spots

- [ ] Spots CRUD + link to QRs
  - Details: [qr-and-access.md](./qr-and-access.md)
  - Depends on: QR list
  - Completion criteria:
    - [ ] Create/edit/deactivate Spot
    - [ ] Assign spots on QR edit

### 5.4 Payments, payouts, refunds

- [ ] Payments hub (Store payout account)
  - Details: [payments-payouts-refunds.md](./payments-payouts-refunds.md)
  - Suggested route: `Routes.dashboard.payments`
  - Depends on: MVP
  - Completion criteria:
    - [ ] Show `PayoutAccount` status
    - [ ] Connect/onboard CTA
    - [ ] Pending distributions list

- [ ] Refunds queue + request from tip detail
  - Details: [payments-payouts-refunds.md](./payments-payouts-refunds.md), [tips-ledger.md](./tips-ledger.md)
  - Depends on: tip detail, refunds API
  - Completion criteria:
    - [ ] Request refund dialog
    - [ ] Approve/reject flow for managers
    - [ ] Confirmation dialogs for destructive actions

- [ ] Production employee cash-out
  - Details: [employee-portal.md](./employee-portal.md)
  - Depends on: USER payout account
  - Completion criteria:
    - [ ] Mutation moves/requests real payout per API
    - [ ] Error/success toasts
    - [ ] Disabled when account not ACTIVE

### 5.5 Multi-org / multi-store

- [ ] Store switcher + Org aggregate overview
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [navigation.md](./navigation.md)
  - Depends on: multi-store data
  - Completion criteria:
    - [ ] Hidden for single-store Orgs
    - [ ] Scopes dashboard queries

- [ ] Account / workspace switcher
  - Details: [navigation.md](./navigation.md), [authentication.md](./authentication.md)
  - Depends on: users with multiple Accounts
  - Completion criteria:
    - [ ] Switch Org / Employee / Customer views
    - [ ] Hidden when only one Account

### Phase 5 — Feature completion

- [ ] Analytics real
- [ ] Alerts live
- [ ] Spots live
- [ ] Payments/refunds/cash-out real
- [ ] Multi-store UX complete

---

# Phase 6 — Settings & Administration `(Post-MVP)`

### 6.1 Store settings tabs

- [ ] Business profile settings (full Store fields)
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Route: `Routes.dashboard.settings`
  - Depends on: stores feature
  - Completion criteria:
    - [ ] name, industry, timezone, currency, address
    - [ ] No inventing non-schema fields (e.g. tagline → map or remove)

- [ ] Branding tab (logo, cover, colors, messages)
  - Details: [settings-and-branding.md](./settings-and-branding.md), [localization.md](./localization.md)
  - Depends on: documents upload API
  - Completion criteria:
    - [ ] Logo/cover upload
    - [ ] Colors saved
    - [ ] welcome/thank-you Json editors

- [ ] Tipping config tab
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: stores feature
  - Completion criteria:
    - [ ] suggested amounts editor
    - [ ] allow custom tip toggle
    - [ ] link to default distribution rule

- [ ] Reviews & feedback config
  - Details: [reviews.md](./reviews.md), [settings-and-branding.md](./settings-and-branding.md)
  - Depends on: review-categories, feedback-questions APIs
  - Completion criteria:
    - [ ] Categories / questions CRUD
    - [ ] public_review_redirect_url + threshold
    - [ ] Industry seed templates from constants (not invented DB)

- [ ] Localization tab + customer language switcher
  - Details: [localization.md](./localization.md)
  - Depends on: branding messages
  - Completion criteria:
    - [ ] primary + supported languages
    - [ ] Tip flow language switcher

- [ ] Members & access
  - Details: [organizations-and-stores.md](./organizations-and-stores.md), [roles-and-permissions.md](./roles-and-permissions.md)
  - Depends on: organization-members API
  - Completion criteria:
    - [ ] Invite member
    - [ ] Role + store scope
    - [ ] Remove with ConfirmationDialog

- [ ] Billing settings (Owner)
  - Details: [billing-and-subscriptions.md](./billing-and-subscriptions.md)
  - Depends on: subscriptions API
  - Completion criteria:
    - [ ] Show plan/status/period
    - [ ] Upgrade/manage via provider when available
    - [ ] Hidden from non-Owners

### 6.2 Plan feature gating

- [ ] Gate Post-MVP nav/features by `SubscriptionPlan`
  - Details: [billing-and-subscriptions.md](./billing-and-subscriptions.md), [navigation.md](./navigation.md)
  - Depends on: billing
  - Completion criteria:
    - [ ] Starter cannot access locked Professional features without upsell
    - [ ] Centralized gate helper (not scattered magic strings)

### 6.3 Customer account history

- [ ] Customer tip/review history page
  - Details: [customer-account.md](./customer-account.md)
  - Depends on: auth claim flow; product decision on route
  - Completion criteria:
    - [ ] Route added only after Blocked route decision
    - [ ] Lists claimed tips/reviews
    - [ ] Account switcher entry when multi-account

### Phase 6 — Feature completion

- [ ] Settings tabs complete
- [ ] Members + billing complete
- [ ] Plan gating complete
- [ ] Customer history complete (or explicitly deferred with Blocked note)

---

# Phase 7 — UX, Error & Edge Cases

- [ ] Consistent empty states on all list pages
  - Details: [README.md](./README.md) + each feature doc
  - Depends on: MVP routes exist
  - Completion criteria:
    - [ ] Employees, tips, reviews, QR, distribution, alerts (if built) have empty CTAs

- [ ] Consistent loading skeletons (no “Loading…” primary UI)
  - Details: app rules
  - Completion criteria:
    - [ ] MVP routes use layout-shaped skeletons

- [ ] Mutation toasts on all create/update/delete hooks
  - Details: app rules
  - Completion criteria:
    - [ ] onSuccess + onError toast everywhere

- [ ] Unsaved changes behavior on settings forms
  - Details: [settings-and-branding.md](./settings-and-branding.md)
  - Completion criteria:
    - [ ] Documented approach implemented or explicitly deferred in Blocked

- [ ] Mobile/responsive pass for dashboard, employee, tip flow
  - Details: [navigation.md](./navigation.md), [customer-tipping.md](./customer-tipping.md)
  - Completion criteria:
    - [ ] Tip flow usable on narrow viewports
    - [ ] Dashboard usable on tablet/mobile (drawer acceptable)

- [ ] Remove or quarantine demo data files from production paths
  - Details: [gaps-and-status.md](./gaps-and-status.md)
  - Completion criteria:
    - [ ] MVP routes do not import `*-demo.ts`
    - [ ] `/client` demo clearly separated

### Phase 7 — Feature completion

- [ ] Empty/loading/error/toast consistency
- [ ] Responsive pass
- [ ] Demo data purged from product routes

---

# Phase 8 — Security, Permissions & Data Integrity

- [ ] Enforce permissions on UI actions (hide/disable + server still authoritative)
  - Details: [roles-and-permissions.md](./roles-and-permissions.md)
  - Completion criteria:
    - [ ] Owner / Store Manager / Accountant / Employee matrices match docs for implemented screens
    - [ ] Unauthorized route → safe redirect or 403 page

- [ ] Money display always formats Int minor units + Currency
  - Details: schema notes in [tips-ledger.md](./tips-ledger.md)
  - Completion criteria:
    - [ ] Shared formatter used in tip flow, ledger, employee portal, analytics

- [ ] Confirm no tip creation without QR in UI
  - Details: [customer-tipping.md](./customer-tipping.md)
  - Completion criteria:
    - [ ] Public flow always tied to QR code param

- [ ] Destructive actions all use `ConfirmationDialog`
  - Details: app rules
  - Completion criteria:
    - [ ] No silent deletes/disconnects

- [ ] Do not expose platform `AuthRole` admin UI
  - Details: [roles-and-permissions.md](./roles-and-permissions.md)
  - Completion criteria:
    - [ ] No accidental admin console routes

### Phase 8 — Feature completion

- [ ] Role matrix enforced in UI
- [ ] Money/QR integrity rules held
- [ ] Confirm dialogs universal for destructive actions

---

# Phase 9 — Testing & QA

- [ ] Typecheck clean for `app` package
- [ ] Lint clean for touched app code
- [ ] Manual E2E script documented for MVP loop (sign-up → tip → dashboard)
  - Details: this file MVP Definition
- [ ] Critical forms validated (auth, employee create, distribution 100%, tip amount)
- [ ] Regression: inactive QR/Store, failed payment, empty stores

### Phase 9 — Feature completion

- [ ] Automated checks pass
- [ ] MVP E2E script executed and noted

---

# Phase 10 — Production Readiness

- [ ] Environments configured (`environments` object; no raw `process.env` in components)
- [ ] Auth token storage approach production-safe (document choice)
- [ ] Error monitoring hook-up decision (implement or Blocked)
- [ ] Legal copy finalized (replace placeholders)
- [ ] Payment provider live keys / webhook verification confirmed with backend
- [ ] Performance pass on tip flow (LCP-sensitive mobile page)
- [ ] Remove prototype-only dead ends or label them internal

### Phase 10 — Feature completion

- [ ] Config/secrets hygiene
- [ ] Legal + payments production-ready
- [ ] Tip flow performance acceptable

---

# Phase 11 — Finished Product

## Finished Product Checklist

### Product functionality

- [ ] All MVP tasks (Phases 0–4) complete
- [ ] All Post-MVP tasks (Phases 5–6) complete **or** explicitly waived by product owner in Blocked
- [ ] Core loop works end-to-end in production
- [ ] Employee portal works for real staff accounts
- [ ] Roadmap §34 still excluded unless separately scheduled

### Navigation

- [ ] All MVP routes implemented and in `Routes`
- [ ] Sidebar/nav match [navigation.md](./navigation.md) for implemented features
- [ ] Role-conditional items correct
- [ ] Account/store switchers behave per single- vs multi-account rules

### UI

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Confirmation dialogs
- [ ] Forms + Zod validation
- [ ] Responsive layouts
- [ ] No `window.confirm` / `alert` for product flows

### Data

- [ ] Prisma entities used by UI correctly represented
- [ ] Feature modules call API (no demo data on product routes)
- [ ] Mutations invalidate queries + toast
- [ ] Schema gaps not papered over with fake fields

### Security

- [ ] Authentication enforced
- [ ] Permissions enforced
- [ ] Unauthorized states handled

### Quality

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] MVP E2E verified
- [ ] No known blocking issues in Blocked section (or all accepted)

### Definition of done for “Finished Product”

- [ ] This Phase 11 checklist is fully `[x]`
- [ ] **Next Action** updated to: `None — product complete` (or next roadmap epic if opened)

---

# Blocked / Needs Clarification

Add items here instead of inventing product behavior.

| Item | Related docs | Reason | Blocking |
| --- | --- | --- | --- |
| Employee PIN auth | [authentication.md](./authentication.md), [roles-and-permissions.md](./roles-and-permissions.md) | UI has PIN; schema has no PIN field | Employee sign-in method |
| On Shift toggle mapping | [employee-portal.md](./employee-portal.md) | UI toggle; schema only `Employee.is_active` | Header shift control |
| CX Score storage/formula | [analytics.md](./analytics.md) | Spec §18; no Prisma model | CX Score UI |
| Notification channels | [alerts.md](./alerts.md) | Spec alerts; no Notification model | Email/push delivery |
| Cash-out / payout availability rules | [payments-payouts-refunds.md](./payments-payouts-refunds.md) | Spec vague on thresholds/schedule | Production cash-out |
| Public review threshold defaults | [customer-tipping.md](./customer-tipping.md) | Spec unclear on exact star cutoff | Review branching defaults |
| Customer history route | [customer-account.md](./customer-account.md) | `/me` vs `/customer` undecided | Customer account page |
| Invite accept URL shape | [authentication.md](./authentication.md) | Spec has invites; route unclear | Invite deep links |
| “Brand Tagline” field | [settings-and-branding.md](./settings-and-branding.md) | Demo settings field not in schema | Settings profile |
| Accountant exact page set | [roles-and-permissions.md](./roles-and-permissions.md) | Spec: financial only | Accountant nav gating details |
| Batch QR PDF templates | [qr-and-access.md](./qr-and-access.md) | Print formats unspecified | Batch print |
| Platform admin UI | [roles-and-permissions.md](./roles-and-permissions.md) | `AuthRole` exists; no product spec | Do not build |

When resolving a blocker, remove or check it off here and unblock the dependent task in the relevant phase.

---

## Progress counting guide (for agents)

When updating **Current Status**:

- **MVP tasks** = all checkbox tasks under Phases **0–4** that are top-level `- [ ]` / `- [x]` work items (not nested completion-criteria lines, not Phase feature-completion rollups).
- **Overall tasks** = MVP tasks + top-level work items in Phases **5–10** (exclude Phase 11 checklist items from the running Overall denominator until finishing; or include them consistently — prefer: Overall = Phases 0–10 top-level tasks only).

Recount after each session. Approximate baseline at plan creation:

| Bucket | Approx. top-level tasks | Completed now |
| --- | --- | --- |
| Phase 0 | 6 | 2 (landing, contact) |
| Phase 1 | 8 | 0 |
| Phase 2 | 18 | 0 |
| Phase 3 | 8 | 0 |
| Phase 4 | 6 | 0 |
| **MVP total** | **~48** | **2** |
| Phases 5–10 | ~64 | 0 |
| **Overall (0–10)** | **~112** | **2** |

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
