# Onboarding

## Feature Overview

Post-registration business setup wizard (spec §31). Creates and configures Organization, first Store, employees, tipping, reviews, and QR codes until the Store can go live.

**Roles:** Organization Owner (primary)  
**Prisma:** `Organization`, `Store`, `Employee`, `DistributionRule`, `QrCode`, `FeedbackQuestion` / `ReviewCategory`, `Document`  
**Dependencies:** Auth sign-up, Settings, QR, Employees, Distribution  
**Status:** **Missing** (sign-up collects venue/type/team size only)

---

## Hierarchy

```text
Onboarding (/onboarding)                    [missing — suggested]
├── Step 1 — Organization + first Store
├── Step 2 — Additional Stores (optional)
├── Step 3 — Employees
├── Step 4 — Tipping configuration
├── Step 5 — Reviews / feedback questions
├── Step 6 — Create QR codes
└── Step 7 — Print / place QR codes → Live
```

Presentation: multi-step page or stepper within `/onboarding`, not separate top-level nav items. Single-Store Orgs: copy as “create your business profile” — hide Organization jargon (spec §10, §25).

---

## Pages

### Business Setup Wizard

**Route (suggested):** `/onboarding` → add `Routes.onboarding` when implementing  
**Purpose:** Guide Owner from empty Org to live tipping  
**Access:** Authenticated Owner; redirect away if setup complete (**unclear** completion flag — no `onboarding_completed` field in schema)  
**Parent:** Post sign-up  
**Entry points:** Successful `/auth/sign-up`; empty dashboard CTA  

#### Step 1 — Create Org + first Store

**Fields:** Store name, Store Type (`StoreIndustry`), timezone, currency, address (optional)  
**Data:** `Organization`, `Store`  
**Note:** Sign-up already collects venue name, type, team size — prefill step 1

#### Step 2 — More Stores (optional)

**Skip** for single-location. Create additional `Store` rows.

#### Step 3 — Employees

**Actions:** Add employees (name, email, position, photo)  
**Can defer** with empty state + “Add later”

#### Step 4 — Tipping

**Fields:** `suggested_tip_amounts`, `allow_custom_tip_amount`, default `DistributionRule`  
**UI:** Amount chips editor; create first distribution rule (e.g. 100% employees or house split)

#### Step 5 — Reviews & feedback

**Fields:** Enable categories; seed questions by Store Type (spec §8); `public_review_redirect_url`, `public_review_rating_threshold`  
**Data:** `ReviewCategory`, `FeedbackQuestion`, Store review fields

#### Step 6 — Create QR codes

**Fields:** Label, selection mode, employees, distribution rule, optional Spots  
**Data:** `QrCode`, joins

#### Step 7 — Print / place

**Actions:** Download PDF / print kit; “Go to dashboard”  
**Success:** Navigate `Routes.dashboard.root`

---

## States

| State | UI |
| --- | --- |
| Loading | Step skeleton |
| Validation error | Field messages; cannot advance |
| API error | Toast; stay on step |
| Cancel / leave | **Unclear** — confirm discard? |
| Resume | **Unclear** — no draft model |

---

## User flows

```text
Sign-up success
  → /onboarding step 1
  → … complete steps (skip optional)
  → step 7 print
  → /dashboard

Skip employees / QR
  → Allowed with warnings
  → Dashboard empty states link back to setup
```

---

## Open questions

1. Persisted onboarding progress field?  
2. Can Store Manager run onboarding for a new Store inside an existing Org?  
3. Minimum steps required before “live”?
