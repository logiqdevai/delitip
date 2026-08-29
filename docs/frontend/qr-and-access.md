# QR Codes and Spots

## Feature Overview

Create and manage Store QR codes (employee assignment, selection mode, distribution rule, Spots) and print assets. Spec §9.

**Roles:** Owner, Store Manager; Employees view personal QR in employee portal  
**Prisma:** `QrCode`, `QrCodeEmployee`, `QrCodeSpot`, `Spot`, `DistributionRule`  
**Dependencies:** Employees, Distribution, Customer tip flow, Branding  
**Status:** **Partial** — single print-kit card on Access page; Spots/CRUD **Missing**

---

## Hierarchy

```text
Customer Access (QR)
├── Access Hub (/dashboard/access)              [page — partial]
│   ├── QR list                                 [missing — replace single card]
│   ├── Print / download actions
│   └── Spots manager                           [missing]
├── Create QR                                   [modal or page — missing]
├── Edit QR                                     [modal or page — missing]
└── Spot Create / Edit                          [modal — missing]
```

Employee personal QR: [employee-portal.md](./employee-portal.md) `/employee/qr`.

Public tip URL: `/{storeSlug}/q/{code}` per schema comment.

---

## Pages

### Customer Access Hub

**Route:** `Routes.dashboard.access`  
**Purpose:** QR inventory and print kit for the Store  
**Access:** Owner, Store Manager  

**Existing:** One “Table 08 Stand” card with fake 5×5 QR grid; link text `delitip.com/artisan/t08`; Print All / Download PDF buttons (no-op)  

**Desired list columns:** label, code, selection_mode, employee count, spot names, distribution rule, is_active, tip count (analytics)  

**Primary actions:** Create QR; Print all; Download PDF  
**Row actions:** Edit, Download, Deactivate, Delete (`ConfirmationDialog`)  

**Empty:** CTA create first QR (onboarding step 6)  
**Loading:** Card/table skeleton  

### Spots

**Status:** Missing  
**Purpose:** Physical placements (Table 1, Room 12, Chair A) many-to-many with QRs; portable QR = no Spot  
**UI options:** Section on Access page or settings sub-route  
**Fields:** name, is_active  
**Actions:** Create, Edit, Deactivate, Link/unlink QRs  

---

## Modals / Forms

### Create / Edit QR

**Fields:**  
- label (e.g. Table 1, Bar, Receipt)  
- selection_mode (`CHOOSE_ONE` | `CHOOSE_MANY` | `TEAM`) — only meaningful with 2+ employees  
- employees multi-select (`QrCodeEmployee`)  
- distribution_rule_id optional (else store default)  
- spots multi-select optional  
- is_active  

**Validation:** Mode vs employee count rules documented in customer-tipping  
**Success:** Show tip URL; offer download  
**Permission:** Owner, Store Manager  

### Print / Download

**Unclear:** PDF template, sticker sizes, batch layout — implement placeholder until design exists  
**Existing buttons** should call real export when available  

### Delete QR

**ConfirmationDialog** — warn about broken printed codes  

---

## Data model

```text
Store 1─* QrCode
QrCode.code unique
QrCode *─* Employee via QrCodeEmployee
QrCode *─* Spot via QrCodeSpot
QrCode 0..1 DistributionRule
Store 1─* Spot
```

---

## Per-QR analytics (spec §9)

Show tip counts/amounts per QR on list or detail (“Table 12 → 14 tips”). Can link to Analytics filtered by QR.

---

## User flows

```text
Create table QR
  Access → Create QR → Label "Table 08" → Assign waiters → CHOOSE_ONE
  → Attach Spot "Table 08" → Save → Download PDF → Print → Place

Personal employee QR
  Assign single employee → Auto thank UI on scan

Team bar QR
  Assign bartenders → TEAM mode → No customer choice
```

---

## Implementation notes

- Feature: `features/qr-codes/` and optionally `features/spots/`.  
- Selection mode labels in `config/constants/dropdowns/`.  
- Replace decorative `qrCells` with real QR image from `code` URL when API/CDN available.  
- Sidebar label today: “Customer Access (QR)” — keep unless product renames.
