# Roles and Permissions

Sources: Product Spec §11, §26; Prisma `AuthRole`, `OrganizationRole`, `OrganizationMember`, `Employee`.

Do not invent roles. Do not conflate platform `AuthRole` with business `OrganizationRole`.

---

## Identity model (confirmed)

| Concept | Meaning | Prisma |
| --- | --- | --- |
| User | Real person (email unique; optional phone) | `User` |
| Organization Account | Membership in an Org with a role | `OrganizationMember` |
| Employee Account | Staff at a Store | `Employee` (optional `user_id`) |
| Customer Account | Tip/review history | Customer fields on `Tip`/`Review` + optional `User` |

One User may hold many Accounts. Accounts may be created by email before registration; registering with that email claims linked Accounts (spec §11).

---

## Platform roles (`User.role` → `AuthRole`)

| Value | Product UI |
| --- | --- |
| `USER` | Normal end users |
| `ADMIN` | Platform — **no product screens defined** |
| `SUPER_ADMIN` | Platform — **no product screens defined** |
| `SUPPORT` | Platform — **no product screens defined** |

**Do not build** a platform admin console unless a separate product decision exists. Business RBAC uses `OrganizationRole` only.

---

## Business roles (`OrganizationMember.role` → `OrganizationRole`)

| Role | Scope field | Spec permissions |
| --- | --- | --- |
| `OWNER` | `store_id` null (org-wide) | Full access including billing; create/edit Distribution Rules; all Stores |
| `STORE_MANAGER` | Typically one `store_id` | Employees, reviews, analytics, Distribution Rules, refunds for that Store only |
| `ACCOUNTANT` | Org or Store as granted | Financial and payment information only |

Unique constraint: `@@unique([organization_id, user_id, store_id, role])` — a User can have multiple membership rows.

---

## Employee

Not an `OrganizationRole`. Represented by `Employee` rows.

| Can | Cannot |
| --- | --- |
| View own tips, ratings, reviews, recognition, recent feedback | Change Distribution Rules / tip splits |
| See which Distribution Rule produced each tip (spec §5) | Manage other employees (unless also Org member) |
| Access personal QR / tip link | Org billing |

**Unclear:** Whether Store can hide employee’s own performance (“if the Store allows it” — spec §13). No schema flag found for that toggle — **schema gap / product decision**.

---

## Customer / Guest

| Can | Notes |
| --- | --- |
| Tip and review without login | Spec §2, §29 |
| Optional register to see history | Spec §11 |
| Language switcher | Spec §24 |

No dashboard portal. History UI: [customer-account.md](./customer-account.md) — Missing.

---

## Permission matrix (UI actions)

| Action | Owner | Store Manager | Accountant | Employee | Guest |
| --- | --- | --- | --- | --- | --- |
| View Overview dashboard | Yes | Yes (store) | Unclear | No | No |
| Manage employees | Yes | Yes | No | No | No |
| View tips ledger | Yes | Yes | Yes | Own only | No |
| Configure distribution rules | Yes | Yes | No | No | No |
| Manage QR / Spots | Yes | Yes | No | Personal QR view | No |
| Manage reviews / feedback config | Yes | Yes | No | Own reviews read | Submit review |
| Analytics | Yes | Yes | Unclear | Own if allowed | No |
| Alerts | Yes | Yes | Unclear | Unclear | No |
| Refunds | Yes | Yes | Unclear | No | No |
| Payout account (store) | Yes | Likely | Likely view | — | No |
| Employee cash-out | — | — | — | Yes (if payout setup) | No |
| Billing / subscription | Yes | No | No | No | No |
| Invite Org members | Yes | Unclear | No | No | No |
| Tip via QR | — | — | — | — | Yes |

Cells marked **Unclear** require a product decision before implementation.

---

## Frontend role presentation today

Auth UI uses a separate prototype switcher:

- `AuthRoles.BUSINESS` / `AuthRoles.EMPLOYEE` in auth components — **not** Prisma enums.
- Sign-in: Business email+password vs Employee phone/email + PIN.
- Sign-up: Business only.

**Gap:** No mapping from auth forms to `OrganizationRole` or `Employee` invite acceptance. PIN-based employee login is **frontend-only** — schema has `User.password` / email / phone, no PIN field (**schema gap** if PIN is required).

---

## Route guards (desired)

| Prefix | Allowed |
| --- | --- |
| `/dashboard/*` | Users with `OrganizationMember` (Accountant limited) |
| `/employee/*` | Users linked to at least one `Employee` |
| `/auth/*` | Public |
| Customer QR routes | Public |
| `/onboarding` | Authenticated Owner without completed setup — **unclear** completion criteria |

No middleware/guards exist in the app yet.
