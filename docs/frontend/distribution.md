# Tip Distribution

## Feature Overview

Named reusable Distribution Rules: recipients are Store and/or Employees; percentages sum to 100%. Store default + per-QR override. Spec §5.

**Roles:** Owner, Store Manager create/edit/assign; Employees **read** which rule applied on a tip  
**Prisma:** `DistributionRule`, `DistributionRuleRecipient`, `Store.default_distribution_rule_id`, `QrCode.distribution_rule_id`  
**Dependencies:** Employees, QR, Tips  
**Status:** **Partial** — static policy cards + pending payouts list; CRUD **Missing**

---

## Hierarchy

```text
Tip Distribution
├── Distribution Hub (/dashboard/distribution)  [page — partial]
│   ├── Policy / default summary
│   ├── Rules library                           [missing section]
│   └── Pending payouts list                    [existing demo]
├── Create Rule                                 [modal — missing]
└── Edit Rule                                   [modal — missing]
```

Assigning a rule to a QR lives primarily in [qr-and-access.md](./qr-and-access.md).

---

## Pages

### Distribution Hub

**Route:** `Routes.dashboard.distribution`  
**Purpose:** Manage how tips split; view pending payouts  
**Access:** Owner, Store Manager  

**Sections (existing):**  
- Policy cards (100% employee / 0% house — hardcoded)  
- Pending Shift Payouts from `demoEmployees` + depositLast4  
- Execute Weekly Payout button (no-op)  

**Desired sections:**  
- Store default rule summary + change control  
- Rules library table/cards: name, recipients summary, usage count  
- Pending distributions across employees/store (`TipDistribution` where `payout_status = PENDING`)  

**Primary actions:** Create rule; Set default; Execute payout (**unclear** vs per-distribution payout provider flow)  
**Empty:** No rules — prompt create “Standard 100% to selected employee”  

---

## Modals / Forms

### Create / Edit Distribution Rule

**Trigger:** Create rule / Edit from library  
**Title:** Create distribution rule / Edit rule  
**Fields:**  
- name (unique per store)  
- Recipients list: `recipient_type` STORE | EMPLOYEE, `employee_id` if employee, `percentage`, `sort_order`  
**Validation:** Percentages sum to 100; Zod schema; lowest `sort_order` absorbs rounding remainder (spec)  
**Actions:** Cancel, Save  
**Success:** Close; invalidate queries; toast  
**Permission:** Owner, Store Manager  
**Note:** Changes affect **future tips only** (spec)

### Set Store Default

**Trigger:** “Set as default” on rule  
**Type:** Confirm or inline  
**Writes:** `Store.default_distribution_rule_id`

### Delete Rule

**ConfirmationDialog**  
**Unclear:** Block if QR still references rule or reassign first

### Execute Payout

**Existing button** — production behavior **unclear** (batch mark `TipDistribution` paid vs provider transfer). Do not invent without payments design.

---

## How rules interact with QR modes (confirmed)

| QR situation | Employee share behavior |
| --- | --- |
| Zero employees | Store share (typically 100% Store recipient) |
| One / Choose one | Employee share → selected employee |
| Choose many | Employee shares renormalized across selected only |
| Team | Split across all assigned per rule |

Customer UI never shows the rule.

---

## Data model

```text
Store 1─* DistributionRule
DistributionRule 1─* DistributionRuleRecipient
Store.default_distribution_rule_id → Rule
QrCode.distribution_rule_id → Rule (override)
Tip.distribution_rule_id + TipDistribution (frozen)
```

Recipient: `DistributionRecipientType` + optional `employee_id` + `percentage` Decimal(5,2) + `sort_order`.

---

## User flows

```text
Create rule
  Distribution → Create → Add recipients → Validate 100% → Save
  → Optional Set as store default

Assign to QR
  QR edit → Pick rule (or inherit store default) → Save

Tip occurs
  → TipDistribution rows frozen from effective rule + selection mode
```

---

## Implementation notes

- Feature: `features/distribution/`.  
- Recipient type labels in dropdowns.  
- Pending payouts UI may overlap [payments-payouts-refunds.md](./payments-payouts-refunds.md) — prefer one canonical payments page long-term; keep distribution page focused on rules.
