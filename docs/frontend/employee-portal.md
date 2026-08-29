# Employee Portal

## Feature Overview

Employee-facing app for own tips, ratings, reviews, recognition, personal QR, and cash-out. Spec §13.

**Roles:** Employee (linked `User` ↔ `Employee`)  
**Prisma:** `Employee`, `Tip`, `TipDistribution`, `Review`, `QrCode` / tip link, `PayoutAccount`  
**Dependencies:** Payments cash-out, QR, Reviews  
**Status:** **Partial** — three demo pages + cash-out confirm via `window`

---

## Hierarchy

```text
Employee Portal
├── Layout (header, nav, cash-out provider)
├── Earnings & Tips (/employee)                 [page — partial]
├── Reviews & Badges (/employee/reviews)        [page — partial]
├── My QR & Link (/employee/qr)                 [page — partial]
└── Instant Cash Out                            [dialog — partial]
```

---

## Pages

### Earnings & Tips

**Route:** `Routes.employee.root` → `/employee`  
**Purpose:** Balance and tip activity  
**Access:** Employee  

**Sections (existing):** Balance card (cash out); Weekly tips card; Satisfaction card; Today’s Shift Tips (`demoShiftTips`); Daily earnings chart (`demoDailyEarnings`); deposit notice  

**Desired data:**  
- Available balance (from unpaid distributions — **unclear** formula)  
- Tip list with amount, time, applied Distribution Rule breakdown (spec §5, §13)  
- Period totals  

**Actions:** Cash out  
**Empty:** No tips yet  
**Loading:** Skeletons  
**Permission:** Own data only; multi-Store employees need Store switcher — **unclear** if one User has multiple Employee rows  

### Reviews & Badges

**Route:** `Routes.employee.reviews`  
**Purpose:** Recognition and feedback  
**Sections (existing):** Badge count cards (`demoBadgeCounts`); Customer Love Notes (`demoEmployeeReviews`)  
**Desired:** Avg rating, review count, recognition count, recent feedback (spec §13)  
**Gate:** “If the Store allows” viewing performance — **schema gap** / unclear toggle  

### My QR & Link

**Route:** `Routes.employee.qr`  
**Purpose:** Personal tip QR and share link  
**Sections (existing):** Photo, fake QR, tip link pill, Add to Apple Wallet (no-op), Copy link  
**Desired:** QR encoding real tip URL; copy link; wallet pass **unclear**  
**Data:** Personal `QrCode` or dedicated tip link on employee — **unclear** whether every employee auto-gets a QR row  

---

## Layout chrome

**Header:** Brand; On Shift / Off Shift toggle (local only); avatar + name/business  
**Unclear:** Maps to `Employee.is_active` or ephemeral presence (no presence field)  

**Nav:** See [navigation.md](./navigation.md)  
**Footer:** Existing layout footer  

---

## Dialogs

### Instant Cash Out

**Trigger:** Nav CTA or balance card  
**Existing:** `window.confirm` / `alert` via `EmployeeCashOutProvider`  
**Desired:** Modal with amount, account status, Confirm/Cancel; pending state on button  
**Success:** Toast; refresh balance  
**Error:** Toast  
**Permission:** Requires ACTIVE USER `PayoutAccount` — otherwise CTA to complete setup (**unclear** employee-facing KYC)

---

## Data model

```text
User 0..* Employee (per Store)
Employee → Tips / Reviews
TipDistribution → employee payout_status
PayoutAccount USER owner shared across employments (schema note)
```

---

## User flows

```text
Employee login
  → /employee → See today’s tips → Open Reviews → Open QR → Copy link

Cash out
  → Confirm dialog → Submit → Balance updates

View rule on tip
  → Tip row → Expand → Show Distribution Rule recipients (read-only)
```

---

## Implementation notes

- Feature hooks under `features/employees/` or `features/employee-portal/`.  
- Remove `window.confirm`; use shared dialog patterns.  
- Badge labels → dropdowns/tags, not hardcoded demo enums long-term.
