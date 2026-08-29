# Settings and Branding

## Feature Overview

Store configuration: profile, branding, tipping defaults, review questions, localization, members, alert preferences. Spec §8, §23–24; members §11/§26.

**Roles:** Owner (all); Store Manager (store settings, not billing); Billing → Owner only  
**Prisma:** `Store`, `Document`, `OrganizationMember`, related config models  
**Dependencies:** Localization, Reviews config, Alerts, Billing, Organizations  
**Status:** **Partial** — name + tagline form only

---

## Hierarchy

```text
Settings (/dashboard/settings)                  [page — partial]
├── Tab: Business profile                       [partial]
├── Tab: Branding                               [missing]
├── Tab: Tipping                                [missing]
├── Tab: Reviews & feedback                     [missing — see reviews.md]
├── Tab: Localization                           [missing — see localization.md]
├── Tab: Members & access                       [missing]
├── Tab: Alert preferences                      [missing — see alerts.md]
└── Tab: Billing                                [Owner — see billing doc]
```

Use tabs or nested routes under `/dashboard/settings/*`. Register each in `Routes.dashboard`.

---

## Pages / Tabs

### Business profile (existing stub)

**Route:** `Routes.dashboard.settings`  
**Existing fields:** Business Name (default Artisan Café & Bar), Brand Tagline; Save preventDefault only  

**Desired fields from `Store`:** name, slug (careful), industry, timezone, currency, address fields, is_active  
**Note:** “Brand Tagline” is **not** a schema field — map to welcome message excerpt or **do not persist** without schema support  

### Branding (desired — §23)

**Fields:**  
- logo_document_id, cover_document_id (upload `Document`)  
- primary_color, secondary_color  
- welcome_message (Json i18n)  
- thank_you_message (Json i18n)  
- employee photos managed via Employees  

**Goal:** Customer tip page feels like the Store, not a third party  

### Tipping (desired)

**Fields:** `suggested_tip_amounts` (editor for Int[]), `allow_custom_tip_amount`, link to default distribution rule  

### Reviews & feedback

See [reviews.md](./reviews.md) config section + `public_review_redirect_url`, `public_review_rating_threshold`.

### Localization

See [localization.md](./localization.md).

### Members & access

See [organizations-and-stores.md](./organizations-and-stores.md) — invite/list `OrganizationMember`.

### Alert preferences

See [alerts.md](./alerts.md).

### Billing

See [billing-and-subscriptions.md](./billing-and-subscriptions.md).

---

## Forms

### Save Store settings

**Validation:** Zod per tab  
**Success:** Toast; invalidate store query  
**Error:** Toast  
**Unsaved changes:** **Unclear** — confirm on tab switch (inferred UX)

### Upload logo / cover

**Fields:** File picker → `Document`  
**Types:** `DocumentType.LOGO` / `BANNER` / `IMAGE`  

---

## User flows

```text
Update branding
  Settings → Branding → Upload logo → Set colors → Edit welcome (EN)
  → Save → Customer tip flow shows new branding
```

---

## Implementation notes

- Single `features/stores/` module for store PATCH.  
- Color inputs + i18n message editors are route-local components.  
- Industry select: reuse/extend business-type form options aligned to `StoreIndustry`.
