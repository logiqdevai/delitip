# Payments, Payouts, and Refunds

## Feature Overview

Payment provider tip capture; Store/User payout accounts; distribution payout status; refund workflow. Spec §27–28.

**Roles:** Owner, Store Manager, Accountant (financial views); Employee cash-out for USER payout account  
**Prisma:** `PayoutAccount`, `Tip`, `TipDistribution`, `Refund`, `PaymentProvider`  
**Dependencies:** Tips ledger, Distribution, Employee portal  
**Status:** **Missing** dedicated pages; employee cash-out **Partial** (browser confirm)

---

## Hierarchy

```text
Payments
├── Payments Hub (/dashboard/payments)          [missing — suggested]
│   ├── Payout account status
│   ├── Pending distributions
│   └── Payout history
├── Refunds (section or /dashboard/refunds)     [missing]
├── Tip Detail refund actions                   [see tips-ledger.md]
└── Employee Instant Cash Out                   [employee portal action]
```

---

## Pages

### Payments Hub

**Route (suggested):** `/dashboard/payments` → `Routes.dashboard.payments`  
**Purpose:** Connect payout account; monitor payout statuses  
**Access:** Owner, Store Manager, Accountant  

**Sections:**  
- Store `PayoutAccount` (owner_type STORE): provider, status (`PENDING`|`ACTIVE`|`RESTRICTED`|`DISABLED`), onboarding CTA  
- Pending `TipDistribution` rows  
- Recent paid-out distributions  

**Actions:** Connect / continue onboarding with provider; Refresh status  
**Unclear:** Exact Viva/Stripe/PayPal KYC embedded UI  

### Refunds

**Status:** Missing  
**Purpose:** List `Refund` records; approve/reject/process  
**Access:** Owner, Store Manager (Accountant **unclear**)  
**Columns:** tip reference, amount, reason, status, requested_by, processed_by, timestamps  
**Actions:** Approve, Reject, Mark completed — with `ConfirmationDialog` where destructive  

**Refund statuses:** `PENDING` | `APPROVED` | `REJECTED` | `COMPLETED`

### Employee Cash Out

**Existing:** Nav CTA + balance card → `window.confirm` / `alert`  
**Desired:** Dialog with amount available, destination account last4, confirm → mutation  
**Data:** USER `PayoutAccount`; available balance derived from unpaid `TipDistribution` for that employee’s user — **unclear** exact availability rules  
**Replace** browser dialogs with HeroUI modal / `ConfirmationDialog` per app rules  

---

## Modals / Forms

### Connect Payout Account

**Trigger:** Payments Hub CTA  
**Behavior:** Provider-hosted onboarding (**unclear** redirect vs embed)  
**Success:** `PayoutAccount` ACTIVE  

### Request Refund

See [tips-ledger.md](./tips-ledger.md).

### Process Refund

**Trigger:** Refunds  
**Fields:** None or processor notes — **unclear**  
**Actions:** Approve / Reject  

### Cash Out Dialog

**Trigger:** Instant Cash Out  
**Fields:** None or amount (if partial cash-out supported — **unclear**)  
**Actions:** Cancel, Confirm  
**Success:** Toast; refresh balance  
**Error:** Toast  

---

## Data model

```text
PayoutAccount: STORE (store_id unique) | USER (user_id unique)
TipDistribution.payout_status PENDING|PAID|FAILED
Refund → Tip + requested_by / processed_by users
PaymentProvider: VIVA|STRIPE|PAYPAL
```

---

## User flows

```text
Store payout setup
  Payments → Connect → Provider KYC → ACTIVE

Tip completed
  → TipDistributions PENDING → Provider/batch payout → PAID

Refund
  Tips → Tip detail → Request refund → PENDING
  → Manager Approves → COMPLETED → Tip may become REFUNDED

Employee cash out
  /employee → Cash Out → Confirm → Payout request
```

---

## Open questions

1. Weekly “Execute Weekly Payout” on distribution page vs automatic provider payouts?  
2. Partial refunds allowed?  
3. Fee display to customers/businesses?  
4. Accountant approve refunds?
