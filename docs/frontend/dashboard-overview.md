# Dashboard Overview

## Feature Overview

Business home: “Today” metrics and trends for the selected Store (or Org aggregate). Spec §14.

**Roles:** Owner, Store Manager (scoped); Accountant **unclear**  
**Prisma:** Aggregations over `Tip`, `Review`, `Employee`, `TipDistribution`  
**Dependencies:** Store switcher, Tips, Reviews, Employees, Analytics  
**Status:** **Partial** — demo KPIs and charts on `/dashboard`

---

## Hierarchy

```text
Business Portal
└── Overview (/dashboard)                   [page]
    ├── Metric cards
    ├── Tips trend chart
    ├── Live feedback feed
    └── Top employees table
```

No child routes today. Deep links to other modules via CTAs.

---

## Pages

### Overview

**Route:** `Routes.dashboard.root` → `/dashboard`  
**Purpose:** At-a-glance performance for the current Store/Org  
**Access:** Authenticated Org roles  
**Layout:** Dashboard sidebar + `DashboardPageHeader`  

**Sections (existing demo):**  
- Header + actions  
- 4 metric cards (hardcoded: tips $, avg tip, satisfaction %, response %)  
- Tips bar chart (`demoTipDays`)  
- Live feedback (`demoFeedback`)  
- Top employees table (`demoEmployees`)  

**Desired metrics (spec §14 Today):** Tips (€/currency), Transactions, Reviews, Avg Rating, Employees Recognized  

**Desired trends:** Tips/reviews over time, avg rating, best employees, best Stores (Owner), satisfaction, common feedback  

**Primary actions (existing links):** Add Employee → employees; Run Tip Distribution → distribution; View Analytics; See All Reviews; View All Staff  

**Empty state:** No tips yet → CTA to QR access / onboarding  
**Loading:** Metric + chart skeletons  
**Error:** Toast + retry  

**Permission:** Store-scoped for Manager; Org aggregate for Owner when no Store selected (**inferred**)

---

## Data displayed

| UI | Source |
| --- | --- |
| Tip totals / counts | `Tip` where `status = COMPLETED` |
| Reviews / avg rating | `Review.rating` |
| Employees recognized | Distinct employees on tips/reviews |
| Feedback snippets | Recent `Review.comment` / tags |

No dedicated Overview model.

---

## User flows

```text
Login → /dashboard
  → Read metrics for selected Store
  → Click Employees / Tips / Reviews / Analytics / QR via sidebar or CTAs
```

---

## Implementation notes

- Replace demo imports with `features/` query hooks.  
- Keep `DashboardPageHeader` pattern from `dashboard-shared.tsx`.  
- Charts: prefer shared chart primitive when adopting real data (`components/ui/chart.tsx` exists unused).
