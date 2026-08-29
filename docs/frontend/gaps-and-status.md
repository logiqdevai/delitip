# Gaps and Status

Comparison of Product Specification, Prisma schema, and current frontend (`app/src`).

Status values:

| Status | Meaning |
| --- | --- |
| Implemented | Spec + schema + usable UI (may still use demo data) |
| Partial | UI exists but incomplete vs spec/schema |
| Missing | Required by spec and/or schema; no UI |
| Schema gap | Spec needs data the schema does not model |
| Frontend-only | UI exists without schema backing |
| Unclear | Needs product decision |
| Roadmap | Spec §34 — do not implement as MVP |

---

## Master feature matrix

| Feature | Spec | Schema | Frontend | Status |
| --- | --- | --- | --- | --- |
| Landing / marketing | §1, §35 | N/A | `/` | Implemented |
| Contact form | Implied | No model | `/contact` | Frontend-only |
| Legal terms / privacy | Linked in UI | No | Pages + draft copy | Existing (placeholder) |
| Business sign-up | §11, §31 | `User`, `Organization`, `Store` | `/auth/sign-up` mock | Partial |
| Business / employee sign-in | §11 | `User` | `/auth/sign-in` mock | Partial |
| Employee PIN login | Frontend | No PIN field | Employee form | Schema gap |
| Forgot password | Linked | `PasswordResetToken` | Pages wired | Existing |
| Invite accept / claim accounts | §11 | Soft via email | No | Missing |
| Account / workspace switcher | §11 | Memberships | No | Missing |
| Onboarding wizard (7 steps) | §31 | Supporting models | No | Missing |
| Organizations multi-store UX | §10, §25 | `Organization`, `Store` | Single demo venue | Missing |
| Store switcher | §10 | Stores | No | Missing |
| Dashboard overview | §14 | Aggregates | Demo KPIs | Partial |
| Employee list / cards | §12 | `Employee` | Demo cards | Partial |
| Employee detail | §12 | `Employee` | No | Missing |
| Add / invite employee | §12 | `Employee` | Button no-op | Missing |
| Tips ledger | §27 | `Tip` | Demo table | Partial |
| Tip detail + distributions | §5, §27 | `Tip`, `TipDistribution` | No | Missing |
| Distribution rule library CRUD | §5 | `DistributionRule*` | Static 100%/0% cards | Partial |
| Assign rule to QR / store default | §5, §9 | Fields exist | No | Missing |
| Reviews list | §19 | `Review` | Demo list | Partial |
| Review filters / search | §19 | Fields | No | Missing |
| Review categories / tags admin | §8, §19 | Models | No | Missing |
| Feedback questions config | §8 | `FeedbackQuestion` | No | Missing |
| Public vs private review branch | §7 | `ReviewVisibility`, threshold fields | Partial in `/client` | Partial |
| Analytics tips / employees / stores | §15–17 | Aggregates | Thin demo cards | Partial |
| Customer Experience Score | §18 | No dedicated model | No | Schema gap / Unclear |
| AI Insight summaries | §20 | `InsightSummary` | No | Missing |
| QR list / create / edit | §9 | `QrCode` | One print card | Partial |
| QR selection modes UI | §3, §9 | `QrCodeSelectionMode` | No | Missing |
| Spots management | §9 | `Spot`, `QrCodeSpot` | No | Missing |
| Print / download QR assets | §9 | — | Buttons no-op | Partial |
| Customer tip flow | §2–4 | Tip path | `/client` prototype | Partial |
| Live route `/{storeSlug}/q/{code}` | Schema comment | `QrCode.code` | No | Missing |
| Store branding settings | §23 | `Store` branding fields | Name + tagline only | Partial |
| Localization settings | §24 | Languages + Json maps | No | Missing |
| Language switcher (customer) | §24 | — | No | Missing |
| Payments / payout accounts | §27 | `PayoutAccount` | No | Missing |
| Employee cash-out | Employee UI | `PayoutAccount` USER | `window.confirm` | Partial / Unclear |
| Refunds | §28 | `Refund` | No | Missing |
| Alerts inbox | §21 | `Alert` | No | Missing |
| Alert preferences | §21 | `AlertPreference` | No | Missing |
| Subscription / billing UI | §32 | `Subscription` | Landing pricing CTAs | Missing |
| Plan feature gating in nav | §32 | `SubscriptionPlan` | No | Missing |
| Customer tip/review history | §11 | User + tips | No | Missing |
| Privacy disclosures in tip flow | §29 | — | Minimal | Partial |
| Platform admin (`AuthRole`) | — | Enum | No | Unclear (out of scope) |
| Loyalty / campaigns / CRM etc. | §34 | No | No | Roadmap |

---

## Schema entities → frontend coverage

| Prisma model | Frontend coverage |
| --- | --- |
| `User` | Auth forms (mock) |
| `PasswordResetToken` | Route linked; no UI |
| `Document` | No upload UI |
| `Organization` | Invisible; demo single business |
| `OrganizationMember` | No members UI |
| `Subscription` | Landing plans only |
| `Store` | Demo business chip + settings stub |
| `Employee` | Dashboard + employee portal demos |
| `Spot` | None |
| `QrCode` | Access page + employee QR demos |
| `QrCodeSpot` / `QrCodeEmployee` | None |
| `DistributionRule` / `Recipient` | Static distribution page |
| `PayoutAccount` | None (cash-out mocks balance) |
| `Tip` | Tips ledger + client flow mock |
| `TipDistribution` | None |
| `Refund` | None |
| `Review` | Reviews pages + client feedback mock |
| `ReviewCategory*` / `ReviewTag*` | None |
| `FeedbackQuestion` / `FeedbackResponse` | Client compliment tags only (hardcoded) |
| `AlertPreference` / `Alert` | None |
| `InsightSummary` | None |

---

## Spec vs schema conflicts / gaps

| Topic | Spec | Schema | Action |
| --- | --- | --- | --- |
| QR modes “one employee” / “zero employees” | Implicit by assignment count | Enum only `CHOOSE_ONE`, `CHOOSE_MANY`, `TEAM` | UI derives mode from employee count + enum |
| CX Score 0–100 | §18 | No model | Compute client/API-side or flag schema gap |
| Employee PIN | Frontend auth | No field | Product decision or add schema |
| On Shift toggle | Employee header UI | Only `is_active` | Unclear mapping |
| Notification channels | Alerts §21 | No Notification model | In-app `Alert` only until schema expands |
| Social login | Auth UI buttons | No OAuth tables | Presentational until backend exists |
| Contact form | `/contact` | No model | Keep frontend-only or add later |
| Tip without QR | Spec emphasizes QR | `Tip.qr_code_id` required | All tips via QR |
| `User.is_archived` default `true` | — | Schema default | Handle carefully in auth UX |

---

## Frontend-only / prototype artifacts

- `/client` dual view (customer + fake business) — replace with real QR route for production tip flow; keep as internal demo optional.
- Demo data files: `dashboard-demo.ts`, `employee-demo.ts`, `client-demo.ts`.
- Auth social buttons non-functional.
- Export CSV, print QR, execute payout, add employee buttons without handlers.
- Cash-out via `window.confirm` / `alert` — replace with `ConfirmationDialog` per app rules.

---

## Empty architecture slots (app rules)

| Expected path | Status |
| --- | --- |
| `app/src/features/*` | Empty — create per domain when wiring API |
| `app/src/stores/*` | Empty |
| `app/src/components/layout/*` | Empty (sidebars live under route segments) |
| `Routes.auth.forgot_password` | Page live |
| `Routes.auth.reset_password` | Page live (`?token=`) |
| `Routes.legal.*` | Pages live; draft legal copy pending counsel |

---

## Priority guidance for agents (not a product roadmap)

Highest leverage to close Partial → Implemented:

1. Live customer tip route + real Store branding (`/{storeSlug}/q/{code}`)
2. Auth + onboarding → Organization/Store creation
3. Employees CRUD + Tips ledger against API
4. Distribution rules CRUD + QR assignment
5. Reviews + feedback config
6. Payouts / refunds / alerts / billing
