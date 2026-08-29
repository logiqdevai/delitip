# Tips Ledger

## Feature Overview

Transaction list of tips for a Store (or Org). Spec §27 payments visibility + tip history.

**Roles:** Owner, Store Manager, Accountant (financial); Employee sees own tips in employee portal  
**Prisma:** `Tip`, `TipDistribution`, `Employee`, `QrCode`, `Refund`  
**Dependencies:** Payments, Refunds, Distribution, QR  
**Status:** **Partial** — table demo; detail **Missing**

---

## Hierarchy

```text
Tips
├── Tips Ledger (/dashboard/tips)           [page — partial]
└── Tip Detail (/dashboard/tips/:id)        [missing]
    ├── Summary                             [section]
    ├── Distributions                       [section / tab]
    └── Refunds                             [section]
```

---

## Pages

### Tips Ledger

**Route:** `Routes.dashboard.tips`  
**Purpose:** Searchable/filterable tip transactions  
**Access:** Owner, Store Manager, Accountant  

**Sections (existing):** Header + Export CSV (no-op); table (`demoTips`: id, when, employee, location, method, amount; status hardcoded Settled)

**Desired columns:** datetime (`paid_at` / `created_at`), amount + currency, employee (or Store-only), QR label, `TipStatus`, payout rollup from distributions, payment_provider  

**Filters (desired — spec analytics overlap):** Date range, Employee, QR, Status  
**Primary actions:** Export CSV (**unclear** format)  
**Row actions:** View details; Request refund (managers)  

**Empty:** No tips — link to QR access  
**Loading:** `TableSkeleton`  
**Error:** Toast  

**Map demo “Settled”** → real `TipStatus` + `PayoutStatus` on distributions (do not invent “Settled” enum)

### Tip Detail

**Route (suggested):** `/dashboard/tips/:tipId`  
**Purpose:** Inspect one tip, frozen split, refund eligibility  
**Sections:**  
- Summary: amount, currency, status, paid_at, store, QR, customer fields, payment_reference  
- Distributions: recipient type, employee, amount, percentage, payout_status, paid_out_at  
- Applied distribution rule name (from `distribution_rule_id`)  
- Refunds list  

**Actions:** Request refund; Contact support (spec §28)  
**Permission:** Accountant read; Manager/Owner refund  

---

## Modals

### Request Refund Dialog

**Trigger:** Tip detail / row menu → Request refund  
**Fields:** amount (≤ tip amount), reason?  
**Validation:** Eligible statuses only — **unclear** exact rules  
**Actions:** Cancel, Submit  
**Success:** Create `Refund` (`PENDING`); toast; refresh  
**See also:** [payments-payouts-refunds.md](./payments-payouts-refunds.md)

---

## Data model

```text
Tip → Store, QrCode, Employee?, DistributionRule?, Customer User?
Tip 1─* TipDistribution
Tip 1─* Refund
Tip 0..1 Review
```

Amounts: Int minor units. Status: `PENDING` | `COMPLETED` | `FAILED` | `REFUNDED`.

---

## User flows

```text
View tips
  Sidebar → Tips Ledger → Filter → Open tip → Distributions

Refund
  Tip detail → Request refund → Dialog → Submit
    → Pending refund → (approval flow — see refunds doc)
```

---

## Implementation notes

- Status chips: labels from `config/constants/dropdowns/tips/tip-status-*.options.ts`.  
- Feature: `features/tips/`.  
- Export: implement only when API exists; keep button disabled or hide until then.
