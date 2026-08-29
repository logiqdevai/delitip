# Analytics

## Feature Overview

Tip, employee, store, and experience analytics for managers. Spec §15–18, §20.

**Roles:** Owner (incl. cross-store), Store Manager (store-scoped)  
**Prisma:** Aggregations over Tip/Review/Employee; `InsightSummary` for AI digests  
**Dependencies:** Tips, Reviews, Employees, Organizations  
**Status:** **Partial** — three hardcoded insight cards on `/dashboard/analytics`

---

## Hierarchy

```text
Analytics (/dashboard/analytics)                [page — partial]
├── Tab: Overview / CX Score                    [missing]
├── Tab: Tips                                   [missing]
├── Tab: Employees                              [missing]
├── Tab: Stores                                 [Owner multi-store — missing]
└── Tab: Insights (AI)                          [missing]
```

Tabs may be URL query (`?tab=tips`) or nested routes — **inferred**; pick one pattern and register in `Routes`.

---

## Pages

### Analytics Hub

**Route:** `Routes.dashboard.analytics`  
**Purpose:** Explore performance beyond Overview  
**Access:** Owner, Store Manager  

**Existing:** Peak hour, Apple Pay 74%, QR conversion 82.4% — static cards, no filters  

### Tips analytics (desired — §15)

**Metrics:** Total tips, count, average; by employee/Store/day/week/month  
**Filters:** Date, Store (Owner), Employee, QR code  
**UI:** Filter bar + charts + table  

### Employee performance (desired — §16)

**Table:** Employee | Tips | Rating | Reviews  
**Framing:** Insight, not ranking (spec copy guidance)  
**Access:** Owner, Store Manager  

### Store comparison (desired — §17)

**Table/charts:** Tips and rating per Store  
**Access:** Owner / Org-level only; hide tab for single-Store  

### Customer Experience Score (desired — §18)

**UI:** Score 0–100 + explanation of drivers (ratings, reviews, feedback, recognition, tip activity)  
**Schema:** **No CX Score model** — compute in API or flag **schema gap**  
**Unclear:** Exact weights  

### Insights (desired — §20)

**Data:** `InsightSummary` — period_start/end, summary, satisfaction_change_percent, top_praise, top_complaint  
**Actions:** View period list; open summary detail  
**Empty:** No summaries yet  

---

## Filters panel

**Type:** Inline toolbar (not a separate page)  
**Fields:** Date range, Store, Employee, QR  
**Permission:** Store filter Owner-only  

---

## Data model

No analytics tables except `InsightSummary`. All other metrics are queries.

---

## User flows

```text
Manager
  Sidebar → Analytics → Select Tips tab → Set date range → View charts
Owner
  → Stores tab → Compare locations
→ Insights → Read weekly AI summary
```

---

## Open questions

1. Plan gating for advanced analytics / AI (Starter vs Professional)?  
2. CX Score formula and storage?  
3. Export analytics reports?
