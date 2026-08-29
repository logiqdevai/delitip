# Onboarding

## Feature Overview

Post-registration business setup wizard (spec §31). Creates and configures Organization, first Store, employees, tipping, reviews, and QR codes until the Store can go live.

**Roles:** Organization Owner (primary)  
**Prisma:** `Organization`, `Store`, `Employee`, `DistributionRule`, `QrCode`, `FeedbackQuestion` / `ReviewCategory`, `Document`  
**Dependencies:** Auth sign-up, Settings, QR, Employees, Distribution  
**Status:** **Step 1 wired** (Org + first Store / business profile). Steps 2–7 deferred to later MVP tasks.

---

## Hierarchy

```text
Onboarding (/onboarding)                    [page — Routes.onboarding]
├── Step 1 — Organization + first Store     [wired — single-store “business profile” copy]
├── Step 2 — Additional Stores (optional)   [deferred]
├── Step 3 — Employees                      [deferred → employees.md]
├── Step 4 — Tipping configuration          [deferred → distribution.md]
├── Step 5 — Reviews / feedback questions   [deferred → reviews.md]
├── Step 6 — Create QR codes                [deferred → qr-codes.md]
└── Step 7 — Print / place QR codes → Live  [deferred]
```

Presentation: multi-step page or stepper within `/onboarding`, not separate top-level nav items. Single-Store Orgs: copy as “create your business profile” — hide Organization jargon (spec §10, §25).

---

## Redirect rules

| Event | Destination |
| --- | --- |
| Business sign-up success (`useRegisterBusiness`) | `Routes.onboarding` |
| Business sign-up created Org + Store | Onboarding Step 1 prefilled; **Skip to dashboard** allowed |
| Business sign-up account only (Org create failed) | Onboarding Step 1 empty create form; skip disabled until a Store exists |
| Authenticated user opens `/dashboard` with no Org membership | `AuthRouteGuard` → `Routes.onboarding` (or employee portal if they only have employee accounts) |
| Onboarding save success | `Routes.dashboard.root` |
| Skip to dashboard (only when a Store already exists) | `Routes.dashboard.root` |
| Unauthenticated `/onboarding` | `Routes.auth.sign_in` |

There is no `onboarding_completed` Prisma field. Completion for MVP Step 1 = Owner has at least one Store (created at sign-up or on this page). Later steps are optional deep-links from dashboard empty states.

---

## Pages

### Business Setup Wizard

**Route:** `/onboarding` → `Routes.onboarding`  
**Purpose:** Guide Owner from empty Org to live tipping  
**Access:** Authenticated User (token required); Org not required  
**Parent:** Post sign-up  
**Entry points:** Successful `/auth/sign-up`; dashboard guard when no Org  

#### Step 1 — Create / complete business profile (wired)

**Fields:** Business name, business type (`StoreIndustry`), timezone, currency, address (optional)  
**Data:** `Organization` + `Store` via `useCompleteBusinessSetup`  
- No Org → `POST /organizations` with nested store, then `PATCH /stores/:id` for timezone/currency/address  
- Org without Store → `POST /organizations/:id/stores`  
- Org with Store → `PATCH /stores/:id` (prefill from API; browser timezone when store still on default `UTC`)  
**UI:** Single-store copy (“Set up your business”); no Organization wording  
**Loading:** `DetailSkeleton`  
**Errors:** Field validation + toast  

#### Steps 2–7

Deferred. Dashboard empty states / later tasks deep-link into employees, distribution, QR, etc.

---

## States

| State | UI |
| --- | --- |
| Loading | `DetailSkeleton` |
| Validation error | Field messages; cannot advance |
| API error | Toast; stay on step |
| Cancel / leave | Skip only when Store already exists |
| Resume | Re-open `/onboarding`; prefills from first Org Store |

---

## User flows

```text
Sign-up success
  → /onboarding step 1 (prefilled when Org+Store created)
  → Save and continue → /dashboard
  → or Skip to dashboard (if Store exists)

Sign-up with Org create failure
  → /onboarding empty form
  → Save creates Org + Store → /dashboard

Dashboard without Org
  → redirect /onboarding
```

---

## Open questions

1. Persisted onboarding progress field? (MVP: infer from Store existence)  
2. Can Store Manager run onboarding for a new Store inside an existing Org?  
3. Minimum steps required before “live”? (MVP: Store exists; QR + distribution still required for tips)
