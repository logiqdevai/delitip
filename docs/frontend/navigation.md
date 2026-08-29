# Navigation

Complete application navigation for DeliTip. Paths must be registered in `app/src/routes/routes.ts` and referenced only via `Routes.*`.

---

## Navigation hierarchy (desired final product)

```text
Marketing Header
├── How it works
├── For teams
├── Estimate
├── Pricing
├── Sign in
└── Create account

Business Portal Sidebar
├── Overview
├── Employees
├── Tips Ledger
├── Reviews & Feedback
├── Tip Distribution
├── Analytics
├── Customer Access (QR)
├── Alerts                         [missing]
├── Payments                       [missing — Accountant primary]
└── Settings (footer)
    ├── Profile / Branding
    ├── Tipping
    ├── Localization
    ├── Members & Access
    ├── Alert preferences
    └── Billing                    [Owner only]

Employee Portal Nav
├── Earnings & Tips
├── Reviews & Badges
├── My QR & Link
└── Instant Cash Out (action)

Account / Workspace Switcher       [missing]
├── Organizations…
├── Stores…
├── Employee views…
└── Customer view

User / Profile Menu                [missing in app]
├── Profile
├── Account settings
├── Notifications / Alerts
├── Help / Contact
└── Sign out
```

---

## Main Navigation — Marketing

**Source (existing):** `app/src/app/(landing)/components/landing-header.tsx`

| Label | Route / href | Icon | Parent | Roles | Visibility | Destination |
| --- | --- | --- | --- | --- | --- | --- |
| Brand / Logo | `Routes.home` (`/`) | BrandMark | — | Public | Always | Landing |
| How it works | `Routes.landing.howItWorks` (`/#how-it-works`) | — | Header | Public | Always | Landing section |
| For teams | `Routes.landing.ecosystem` (`/#ecosystem`) | — | Header | Public | Always | Landing section |
| Estimate | `Routes.landing.calculator` (`/#calculator`) | — | Header | Public | Always | Landing section |
| Pricing | `Routes.landing.pricing` (`/#pricing`) | — | Header | Public | Always | Landing section |
| Sign in | `Routes.auth.sign_in` | — | Header | Public | Hidden &lt;sm | Auth |
| Create account | `Routes.auth.sign_up` | `ArrowRight` | Header | Public | Always | Auth |

**Footer (existing):** Product links to landing anchors; Trust → Privacy, Terms (missing pages), Security → `/` (placeholder), Contact → `/contact`. Industry list items currently all link to `/` — **unclear** whether they should deep-link to filtered content.

---

## Main Navigation — Business Portal Sidebar

**Source (existing):** `app/src/app/dashboard/components/dashboard-sidebar.tsx`  
**Layout:** `app/src/app/dashboard/layout.tsx` (sidebar + main)

| Label | Route | Icon | Parent | Required role | Visibility | Destination |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | `Routes.dashboard.root` | `LayoutGrid` | Sidebar | Owner, Store Manager | Always (demo) | Dashboard home |
| Employees | `Routes.dashboard.employees` | `Users` | Sidebar | Owner, Store Manager | Always; badge = staff count | Employee list |
| Tips Ledger | `Routes.dashboard.tips` | `Wallet` | Sidebar | Owner, Store Manager, Accountant | Always | Tips table |
| Reviews & Feedback | `Routes.dashboard.reviews` | `Star` | Sidebar | Owner, Store Manager | Always | Reviews |
| Tip Distribution | `Routes.dashboard.distribution` | `ArrowLeftRight` | Sidebar | Owner, Store Manager | Always | Distribution |
| Analytics | `Routes.dashboard.analytics` | `BarChart3` | Sidebar | Owner, Store Manager | Always; plan-gated advanced sections unclear | Analytics |
| Customer Access (QR) | `Routes.dashboard.access` | `QrCode` | Sidebar | Owner, Store Manager | Always | QR / print kit |
| Settings | `Routes.dashboard.settings` | `Settings` | Sidebar footer | Owner, Store Manager | Always | Settings |

### Desired additions (not in sidebar today)

| Label | Suggested route key | Icon suggestion | Required role | Notes |
| --- | --- | --- | --- | --- |
| Alerts | `Routes.dashboard.alerts` | `Bell` | Owner, Store Manager | Spec §21; models `Alert`, `AlertPreference` |
| Payments | `Routes.dashboard.payments` | `CreditCard` | Owner, Store Manager, Accountant | Spec §27; `PayoutAccount`, distributions |
| Refunds | Nested under Payments or Tips | — | Owner, Store Manager | Spec §28; model `Refund` |
| Billing | Under Settings | — | Owner only | Spec §32; model `Subscription` |

### Sidebar header (existing)

- Brand: delitip.com + “Business Portal”
- Business chip: name, location, staff count from `demoBusiness`
- **Desired:** Store switcher when Org has multiple Stores; Org switcher when User has multiple Organizations (spec §10–11). Hide switchers when only one Account (spec).

### Role-conditional visibility (confirmed)

| Item | Owner | Store Manager | Accountant | Employee |
| --- | --- | --- | --- | --- |
| Overview | Yes | Yes (scoped) | Unclear — financial-only role | No → `/employee` |
| Employees | Yes | Yes | No | No |
| Tips Ledger | Yes | Yes | Yes | Own tips only in employee portal |
| Reviews | Yes | Yes | No | Own in employee portal |
| Distribution | Yes | Yes | No | Read applied rule on tip detail only |
| Analytics | Yes | Yes | Unclear | No (unless Store allows own performance — toggle unclear) |
| QR Access | Yes | Yes | No | Personal QR in employee portal |
| Settings (billing) | Yes | No | No | No |
| Payments | Yes | Yes | Yes | Cash-out in employee portal |

**Unclear:** Exact Accountant page set beyond “financial and payment information” (spec §26). Do not invent extra Accountant screens without a product decision.

---

## Main Navigation — Employee Portal

**Source (existing):** `app/src/app/employee/components/employee-nav.tsx`  
**Layout:** `app/src/app/employee/layout.tsx`

| Label | Route | Icon | Parent | Role | Visibility | Destination |
| --- | --- | --- | --- | --- | --- | --- |
| Earnings & Tips | `Routes.employee.root` | `Wallet` | Nav | Employee | Always | Earnings |
| Reviews & Badges | `Routes.employee.reviews` | `Star` | Nav | Employee | Always | Reviews |
| My QR & Link | `Routes.employee.qr` | `QrCode` | Nav | Employee | Always | Personal QR |
| Instant Cash Out | — (action) | `Zap` | Nav CTA | Employee | `sm+` only today | Opens cash-out confirm |

**Header (existing):** Brand, On Shift / Off Shift toggle (local state only), avatar + name/business.  
**Unclear:** Whether “On Shift” maps to `Employee.is_active` or a separate presence field (schema has only `is_active`).

---

## Auth Shell Navigation

**Source:** `app/src/app/auth/components/auth-shell.tsx`

| Label | Route | Visibility |
| --- | --- | --- |
| Logo | `Routes.home` | Always |
| Contact Support | `Routes.contact` | Always |

**Role switcher (existing):** `AuthRoleSwitcher` — Business Account (`Building2`) | Employee Access (`User`). Not the same as `OrganizationRole`. Sign-up locks Business; selecting Employee redirects to `Routes.auth.sign_in?role=employee`.

---

## User / Profile Menu

**Status:** Missing in current app.

**Desired (inferred from spec §11 + common SaaS patterns — mark inferred):**

| Label | Destination | Roles | Notes |
| --- | --- | --- | --- |
| Profile | Settings / profile | All authenticated | Unclear exact route |
| Account settings | Password, email, phone | All | Schema: `User` fields |
| Switch account / workspace | Account switcher | Multi-account users | Spec §11 — hide if one Account |
| Notifications | Alerts inbox | Owner, Store Manager | Spec §21 |
| Help / Contact | `Routes.contact` | All | Existing route |
| Sign out | Clears session → sign-in | All | No auth session yet |

---

## Account / Workspace Switcher

**Status:** Missing. **Confirmed requirement** (spec §11).

```text
Account Switcher
├── Organization: {Org name} → Opens Org dashboard
│   └── Store: {Store name} → Store-scoped dashboard
├── Employee: {Store name} → /employee
└── Customer → Customer tip/review history
```

Visibility: hidden when the User has only one Account.

---

## Context Menus

None implemented in the current prototype. Desired per feature (implement as overflow menus on list rows; use `ConfirmationDialog` for destructive actions):

### Employee row / card

```text
Employee
├── View details
├── Edit
├── View / print QR
├── Deactivate / Activate
└── Remove                    [confirm]
```

### Tip row

```text
Tip
├── View details
├── View distributions
├── Request refund            [Owner / Store Manager]
└── Contact support
```

### Review row

```text
Review
├── View details
├── Filter by employee
└── (No delete in spec — do not invent)
```

### Distribution rule

```text
Rule
├── Edit
├── Duplicate                 [unclear — not in spec]
├── Set as store default
└── Delete                    [confirm; blocked if in use — unclear]
```

### QR code

```text
QR
├── Edit
├── Download / Print
├── Assign employees
├── Assign distribution rule
├── Link spots
├── Deactivate / Activate
└── Delete                    [confirm]
```

### Spot

```text
Spot
├── Edit
├── Link / unlink QRs
└── Deactivate
```

---

## Tabs

Current app uses custom toggles, not `components/ui/tabs`. Desired tab sets:

### Analytics page tabs (desired)

```text
Analytics
├── Overview / CX Score
├── Tips
├── Employees
├── Stores          [Owner / multi-store only]
└── Insights        [AI summaries — Professional+ unclear]
```

### Settings tabs (desired)

```text
Settings
├── Business profile
├── Branding
├── Tipping
├── Reviews & feedback questions
├── Localization
├── Members & access
├── Alert preferences
└── Billing         [Owner]
```

### Tip detail tabs (desired)

```text
Tip Detail
├── Summary
├── Distributions
└── Refunds
```

### Customer tip flow steps (not URL tabs — wizard)

```text
Tip Flow
├── Store / employees
├── Amount
├── Payment
├── Thank-you
└── Review / feedback
```

Existing prototype (`/client`): Tip → Feedback → Success via local step state.

### Auth role switcher (existing — not tabs)

Business | Employee on sign-in / sign-up.

### Client prototype view switcher (existing — demo only)

Customer Mobile Flow | Business Dashboard (`/client`).

---

## Mobile Navigation

| Surface | Existing behavior | Desired |
| --- | --- | --- |
| Marketing | Header links; Sign in hidden &lt;sm | Keep compact header; optional hamburger **unclear** |
| Dashboard | Sidebar stacks as top border block on small screens (`md:w-64`) | Improve to drawer/sheet — **inferred**, not in spec |
| Employee | Horizontal icon nav + cash-out hidden &lt;sm | Keep bottom or top bar; cash-out always reachable |
| Customer tip | Prototype phone frame | Full-bleed mobile; no desktop chrome |

`app/src/hooks/use-mobile.ts` exists; not wired into portal nav yet.

---

## Customer tip flow — no main nav

Guest flow must not show business/employee chrome. Only:

- Store branding
- Language switcher (spec §24)
- Privacy disclosures (spec §29)
- Linear steps / back within flow

---

## Implementation notes for agents

1. When adding a nav item, update `Routes` first, then sidebar/nav arrays, then `page.tsx`.
2. Resolve display labels for enums from `config/constants/dropdowns/` — never inline `Record<Enum, string>` in nav components.
3. Gate items by `OrganizationRole` and `OrganizationMember.store_id` scope; do not use `AuthRole` for business portal RBAC.
4. Single-Store Orgs: hide Org structure and multi-store nav (spec §10, §25).
