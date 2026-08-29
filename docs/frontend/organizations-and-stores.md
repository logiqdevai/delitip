# Organizations and Stores

## Feature Overview

Tenant hierarchy: Organization (billing + access umbrella) → Store(s) (branded operational units where tipping happens). Spec §10, §25.

**Roles:** Owner (all Stores + billing); Store Manager (one Store); Accountant (financial scope as granted)  
**Prisma:** `Organization`, `Store`, `OrganizationMember`, `Subscription`, `Document`  
**Dependencies:** Auth, Billing, Dashboard scoping, Account switcher  
**Status:** **Partial** — create at sign-up + onboarding Step 1; dashboard shell uses live Store via `useWorkspace` / `workspace` Zustand store. No multi-store switcher / members UI yet.

---

## Hierarchy

```text
Organizations & Stores
├── Account / Org switcher                      [missing — global chrome]
├── Store switcher                              [missing — dashboard chrome]
├── Organization settings                       [missing]
│   ├── Members & roles
│   └── Billing → billing-and-subscriptions.md
└── Store settings                              [see settings-and-branding.md]
```

Single-Store Orgs: **hide** Org structure — UI feels like one business account (spec).

---

## UI surfaces (not all full pages)

### Account / Org Switcher

**Type:** Dropdown / popover in shell header  
**Purpose:** Switch Organization Accounts, Store context, Employee views, Customer view  
**Visibility:** Hidden if only one Account  
**Data:** `OrganizationMember` list + linked `Employee` rows + customer activity  

### Store Switcher

**Type:** Control in dashboard sidebar header (replace static business chip)  
**Purpose:** Scope all dashboard data to selected `Store`  
**Access:** Owner with multiple Stores; Managers with one Store see read-only store chip  

### Organization Members

**Route (suggested):** `/dashboard/settings/members` or settings tab  
**Purpose:** Invite/list members with `OrganizationRole` and optional `store_id` scope  
**Actions:** Invite by email, change role, remove (**ConfirmationDialog**)  
**Data:** `OrganizationMember`, `User`  

---

## Pages

### Organization overview (multi-store)

**Route (suggested):** `/dashboard` when multiple Stores — aggregate view (spec §14, §17)  
**Sections:** Org-level Today metrics; per-Store breakdown; Store switcher  
**Access:** Owner  

### Create Store

**Type:** Modal or onboarding step  
**Fields:** name, slug, industry, timezone, currency, address  
**Success:** Select new Store in switcher; toast  

---

## Data model

```text
Organization 1─* Store
Organization 1─* OrganizationMember (* optionally scoped to Store)
Organization 1─1 Subscription
Store *─ branding Documents
```

**Store fields for UI:** name, slug, industry, is_active, logo/cover, colors, messages (Json i18n), address, timezone, primary_language, supported_languages, currency, suggested_tip_amounts, allow_custom_tip_amount, public review fields, default_distribution_rule_id

---

## Patterns from scale (§25)

| Pattern | UI behavior |
| --- | --- |
| Single location | No Org/Store switcher |
| Multi-branch | Store switcher + Org aggregate analytics |
| Multi-brand | Same; Store branding differs |
| Franchise | Store Manager cannot see other Stores |

---

## User flows

```text
Owner with 2 Stores
  Login → Account switcher (if multi-org) → Dashboard
  → Store switcher → Employees list scoped to Store A
  → Switch Store B → data refreshes

Invite Store Manager
  Settings → Members → Invite email + STORE_MANAGER + store_id
  → Placeholder membership → User registers → Claims access
```

---

## Open questions

1. Slug editability after creation?  
2. Soft-delete vs `is_active` for Stores?  
3. Can a User be Owner of Org A and Employee of Store in Org B simultaneously? (Spec implies yes via multiple Accounts.)
