# DeliTip Frontend Map

Implementation-oriented map of pages, navigation, dialogs, and flows for the Next.js app (`app/`). Cross-references:

1. [`docs/DelyTip_Product_Specification.md`](../DelyTip_Product_Specification.md)
2. [`api/prisma/schema.prisma`](../../api/prisma/schema.prisma)
3. Current frontend under `app/src/`

**Current frontend status:** Auth email flows and portal route guards are wired. Business/employee dashboards still mostly demo data; onboarding missing. MVP `features/` modules scaffolded; `ApiRoutes` populated; axios attaches auth token.

---

## How to use this documentation

**Implementation order & status:** start with [PROGRESS.md](./PROGRESS.md) (Next Action, phases, checkboxes). This README is the map; PROGRESS is the roadmap.

| Need | Read |
| --- | --- |
| What to build next | [PROGRESS.md](./PROGRESS.md) |
| Whole app sitemap + route table | This file |
| Sidebars, menus, role-gated nav | [navigation.md](./navigation.md) |
| Spec vs schema vs UI status | [gaps-and-status.md](./gaps-and-status.md) |
| Who can do what | [roles-and-permissions.md](./roles-and-permissions.md) |
| A specific feature | Feature files below |

When implementing UI, follow [`.cursor/rules/app-code-structure-and-best-practices.mdc`](../../.cursor/rules/app-code-structure-and-best-practices.mdc):

- Add every path to `app/src/routes/routes.ts` before using it (`Routes.*` only — never hardcode URLs).
- Put API logic in `app/src/features/<domain>/` (hooks, services, interfaces, schemas). **No** `features/*/components/`.
- Put route UI in `app/src/<section>/components/`.
- Put enum labels/options in `app/src/config/constants/dropdowns/<domain>/`.
- Loading: `TableSkeleton` / `DetailSkeleton` / layout-shaped `Skeleton` — never `"Loading..."` as primary UI.
- Destructive actions: shared `ConfirmationDialog` + `useConfirmationDialog` (Base UI AlertDialog; not HeroUI).
- Forms: React Hook Form + Zod (`zodResolver`) with `Field` / `FieldGroup` / `FieldError`.
- Toasts: `toast.add({ title, description?, type })` from `@/components/ui/toast` (`Toaster` in providers).

---

## Application surfaces

DeliTip has five product surfaces (not one SPA):

| Surface | Audience | Route prefix | Layout |
| --- | --- | --- | --- |
| Marketing | Public | `/`, `/contact`, `/legal/*` | Root (+ landing header/footer) |
| Auth | Public → authenticated | `/auth/*` | `app/auth/layout.tsx` |
| Business portal | Owner, Store Manager, Accountant | `/dashboard/*` | `app/dashboard/layout.tsx` |
| Employee portal | Employee | `/employee/*` | `app/employee/layout.tsx` |
| Customer tip flow | Guest / Customer | `/{storeSlug}/q/{code}` (target); `/client` (prototype only) | Mobile-first, no chrome |

Organization / Store switchers and Customer account history are required by the spec but are **missing** from the current app.

---

## Application Sitemap

```text
Application
├── Marketing
│   ├── Landing (/)
│   ├── Contact (/contact)
│   ├── Legal Terms (/legal/terms)
│   └── Legal Privacy (/legal/privacy)
├── Authentication
│   ├── Sign In (/auth/sign-in)             Business | Employee modes
│   ├── Sign Up (/auth/sign-up)             Business only
│   ├── Forgot Password (/auth/forgot-password)
│   ├── Reset Password (/auth/reset-password)
│   ├── Invite Accept                       [missing — unclear route]
│   └── Account / Workspace Switcher        [missing]
├── Onboarding (post sign-up)               [missing — multi-step]
├── Business Portal (/dashboard)
│   ├── Overview
│   ├── Employees
│   │   ├── List
│   │   ├── Detail                          [missing]
│   │   └── Invite / Create                 [modal or page — missing]
│   ├── Tips
│   │   └── Tip Detail / Refund             [missing]
│   ├── Reviews & Feedback
│   │   ├── Review List
│   │   ├── Review Detail                   [missing]
│   │   └── Feedback Config                 [missing]
│   ├── Tip Distribution
│   │   ├── Rules Library                   [partial — policy cards only]
│   │   └── Rule Create / Edit              [missing]
│   ├── Analytics
│   │   ├── Tips
│   │   ├── Employees
│   │   ├── Stores (multi-store)
│   │   ├── CX Score
│   │   └── Insights (AI)                   [missing]
│   ├── QR Codes
│   │   ├── QR List / Print kit             [partial — one demo card]
│   │   ├── QR Create / Edit                [missing]
│   │   └── Spots                           [missing]
│   ├── Alerts                              [missing]
│   ├── Payments & Payouts                  [missing]
│   ├── Refunds                             [missing]
│   ├── Billing / Subscription              [missing]
│   ├── Organization & Stores               [missing]
│   └── Settings
│       ├── Business profile                [partial]
│       ├── Branding                        [missing]
│       ├── Tipping config                  [missing]
│       ├── Localization                    [missing]
│       ├── Alert preferences               [missing]
│       └── Access / Members                [missing]
├── Employee Portal (/employee)
│   ├── Earnings & Tips
│   ├── Reviews & Badges
│   ├── My QR & Link
│   └── Cash Out                            [dialog — partial]
└── Customer Tip Flow
    ├── Store branded landing
    ├── Employee selection (mode-dependent)
    ├── Tip amount
    ├── Payment
    ├── Thank-you
    ├── Optional review / feedback
    └── Public review redirect (branch)
        Prototype today: /client only
```

---

## Route Map

Status legend: **Existing** = `page.tsx` present · **Partial** = page exists but incomplete vs spec/schema · **Missing** = required by spec/schema, no route · **Prototype** = demo-only, not production path.

| Route | Page | Feature doc | Access | Status |
| --- | --- | --- | --- | --- |
| `/` | Landing | [landing-and-marketing.md](./landing-and-marketing.md) | Public | Existing |
| `/contact` | Contact | [landing-and-marketing.md](./landing-and-marketing.md) | Public | Existing |
| `/legal/terms` | Terms | [landing-and-marketing.md](./landing-and-marketing.md) | Public | Existing |
| `/legal/privacy` | Privacy | [landing-and-marketing.md](./landing-and-marketing.md) | Public | Existing |
| `/auth/sign-in` | Sign In | [authentication.md](./authentication.md) | Public | Existing |
| `/auth/sign-up` | Sign Up | [authentication.md](./authentication.md) | Public | Existing |
| `/auth/forgot-password` | Forgot Password | [authentication.md](./authentication.md) | Public | Existing |
| `/auth/reset-password` | Reset Password | [authentication.md](./authentication.md) | Public | Existing |
| `/onboarding` | Business Setup | [onboarding.md](./onboarding.md) | Authenticated Owner | Missing |
| `/dashboard` | Overview | [dashboard-overview.md](./dashboard-overview.md) | Org roles | Partial |
| `/dashboard/employees` | Employees | [employees.md](./employees.md) | Owner, Store Manager | Partial |
| `/dashboard/employees/:id` | Employee Detail | [employees.md](./employees.md) | Owner, Store Manager | Missing |
| `/dashboard/tips` | Tips | [tips-ledger.md](./tips-ledger.md) | Owner, Store Manager, Accountant | Partial |
| `/dashboard/tips/:id` | Tip Detail | [tips-ledger.md](./tips-ledger.md) | Owner, Store Manager, Accountant | Missing |
| `/dashboard/reviews` | Reviews | [reviews.md](./reviews.md) | Owner, Store Manager | Partial |
| `/dashboard/distribution` | Distribution | [distribution.md](./distribution.md) | Owner, Store Manager | Partial |
| `/dashboard/analytics` | Analytics | [analytics.md](./analytics.md) | Owner, Store Manager | Partial |
| `/dashboard/access` | QR Access | [qr-and-access.md](./qr-and-access.md) | Owner, Store Manager | Partial |
| `/dashboard/alerts` | Alerts | [alerts.md](./alerts.md) | Owner, Store Manager | Missing |
| `/dashboard/payments` | Payouts | [payments-payouts-refunds.md](./payments-payouts-refunds.md) | Owner, Store Manager, Accountant | Missing |
| `/dashboard/settings` | Settings | [settings-and-branding.md](./settings-and-branding.md) | Owner, Store Manager | Partial |
| `/dashboard/settings/billing` | Billing | [billing-and-subscriptions.md](./billing-and-subscriptions.md) | Owner | Missing |
| `/employee` | Earnings | [employee-portal.md](./employee-portal.md) | Employee | Partial |
| `/employee/reviews` | Reviews & Badges | [employee-portal.md](./employee-portal.md) | Employee | Partial |
| `/employee/qr` | My QR | [employee-portal.md](./employee-portal.md) | Employee | Partial |
| `/client` | Tip flow prototype | [customer-tipping.md](./customer-tipping.md) | Public | Prototype |
| `/{storeSlug}/q/{code}` | Live tip entry | [customer-tipping.md](./customer-tipping.md) | Public | Missing (schema URL shape) |
| `/me` or customer history | Customer Account | [customer-account.md](./customer-account.md) | Registered Customer | Missing |

Proposed routes marked Missing are **confirmed by spec and/or schema** unless labeled *unclear* in the feature doc. Exact path strings for Missing routes should be added to `Routes` when implemented; names above are recommended, not yet in `routes.ts`.

---

## Feature documents

| File | Spec sections | Primary Prisma models |
| --- | --- | --- |
| [navigation.md](./navigation.md) | — | — |
| [roles-and-permissions.md](./roles-and-permissions.md) | §11, §26 | `User`, `OrganizationMember`, `AuthRole`, `OrganizationRole` |
| [gaps-and-status.md](./gaps-and-status.md) | all | all |
| [landing-and-marketing.md](./landing-and-marketing.md) | §1, §32, §35 | — |
| [authentication.md](./authentication.md) | §11 | `User`, `PasswordResetToken` |
| [onboarding.md](./onboarding.md) | §31 | `Organization`, `Store`, `Employee`, `QrCode` |
| [organizations-and-stores.md](./organizations-and-stores.md) | §10, §25 | `Organization`, `Store`, `OrganizationMember` |
| [customer-tipping.md](./customer-tipping.md) | §2–4, §6–7, §22, §29–30 | `Store`, `QrCode`, `Employee`, `Tip`, `Review` |
| [employees.md](./employees.md) | §12 | `Employee`, `Document` |
| [dashboard-overview.md](./dashboard-overview.md) | §14 | aggregated Tip/Review/Employee |
| [tips-ledger.md](./tips-ledger.md) | §27 | `Tip`, `TipDistribution` |
| [distribution.md](./distribution.md) | §5 | `DistributionRule`, `DistributionRuleRecipient` |
| [reviews.md](./reviews.md) | §6–8, §19–20 | `Review`, categories, tags, feedback |
| [analytics.md](./analytics.md) | §15–18, §20 | Tip/Review aggregates, `InsightSummary` |
| [qr-and-access.md](./qr-and-access.md) | §9 | `QrCode`, `Spot`, joins |
| [settings-and-branding.md](./settings-and-branding.md) | §8, §23–24 | `Store`, `Document` |
| [payments-payouts-refunds.md](./payments-payouts-refunds.md) | §27–28 | `PayoutAccount`, `TipDistribution`, `Refund` |
| [alerts.md](./alerts.md) | §21 | `Alert`, `AlertPreference` |
| [employee-portal.md](./employee-portal.md) | §13 | `Employee`, `Tip`, `Review` |
| [billing-and-subscriptions.md](./billing-and-subscriptions.md) | §32 | `Subscription` |
| [localization.md](./localization.md) | §24 | `Store` language fields, Json i18n |
| [customer-account.md](./customer-account.md) | §11, §29 | `User`, Tip/Review as customer |
| [roadmap.md](./roadmap.md) | §34 | — (no schema) |

---

## Feature Status Summary

| Area | Spec | Schema | Frontend | Verdict |
| --- | --- | --- | --- | --- |
| Marketing landing | Yes | N/A | Yes | Implemented (static) |
| Contact | Implied | No | Yes | Frontend-only |
| Legal pages | Implied | No | Linked, no pages | Missing |
| Auth sign-in / sign-up | Yes | Yes | Prototype forms | Partial |
| Forgot password | Implied | Yes (`PasswordResetToken`) | Linked, no page | Missing |
| Onboarding wizard | Yes §31 | Yes | No | Missing |
| Org / multi-store | Yes | Yes | No | Missing |
| Dashboard overview | Yes | Yes | Demo metrics | Partial |
| Employees | Yes | Yes | Demo cards | Partial |
| Tips ledger | Yes | Yes | Demo table | Partial |
| Distribution rules | Yes | Yes | Static policy UI | Partial |
| Reviews management | Yes | Yes | Demo list | Partial |
| Feedback question config | Yes | Yes | No | Missing |
| Analytics | Yes | Aggregates + `InsightSummary` | Thin demo | Partial |
| QR management | Yes | Yes | One print-kit card | Partial |
| Spots | Yes (schema note) | Yes | No | Missing |
| Customer tip flow | Yes | Yes | `/client` prototype | Partial |
| Live QR URL route | Yes | Documented on `QrCode` | No | Missing |
| Employee portal | Yes | Yes | Demo portal | Partial |
| Cash out / payouts | Partial in spec | Yes | Browser confirm | Partial / unclear |
| Refunds | Yes | Yes | No | Missing |
| Alerts | Yes | Yes | No | Missing |
| Branding / i18n settings | Yes | Yes | Minimal settings | Partial |
| Billing | Yes | Yes | Pricing on landing only | Missing |
| Customer account history | Yes | User + tips | No | Missing |
| Account switcher | Yes | Multi membership | No | Missing |
| Platform admin (`AuthRole`) | Schema only | Yes | No | Unclear / out of product UI |
| Roadmap §34 features | Future | No | No | Roadmap only |

See [gaps-and-status.md](./gaps-and-status.md) for the full matrix.

---

## Roles (quick reference)

| Role | Portal | Source |
| --- | --- | --- |
| Organization Owner | `/dashboard` (all stores + billing) | `OrganizationRole.OWNER` |
| Store Manager | `/dashboard` (scoped store) | `OrganizationRole.STORE_MANAGER` |
| Accountant | Financial pages only | `OrganizationRole.ACCOUNTANT` |
| Employee | `/employee` | `Employee` (+ optional `User`) |
| Customer / Guest | Tip flow; optional `/me` history | Tip/Review customer fields + `User` |
| Platform Admin / Support | Not in product UI | `AuthRole` — **do not invent screens** |

Details: [roles-and-permissions.md](./roles-and-permissions.md).

---

## Confirmed vs open

- **Confirmed:** Spec + schema agreement (or clear existing UI).
- **Existing implementation:** What ships in `app/src` today (often demo-only).
- **Inferred:** Reasonable UX filling a gap between spec and schema (called out in feature docs).
- **Unclear:** Flagged for product decision — do not invent requirements when implementing.
