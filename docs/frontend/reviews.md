# Reviews and Feedback

## Feature Overview

Post-tip ratings, written reviews, category scores, tags, and configurable feedback questions. Management + customer submission. Spec §6–8, §19–20.

**Roles:** Customer submits; Owner/Store Manager manage and configure  
**Prisma:** `Review`, `ReviewCategory`, `ReviewCategoryRating`, `ReviewTag`, `ReviewTagAssignment`, `FeedbackQuestion`, `FeedbackResponse`  
**Dependencies:** Customer tip flow, Store settings, Analytics, Alerts  
**Status:** List **Partial**; config + detail **Missing**

---

## Hierarchy

```text
Reviews
├── Reviews List (/dashboard/reviews)           [page — partial]
├── Review Detail                               [drawer or page — missing]
├── Feedback / Review Config                    [settings tab — missing]
│   ├── Categories
│   ├── Feedback questions
│   ├── Tags
│   └── Public redirect settings
└── Customer review step                        [see customer-tipping.md]
```

---

## Pages

### Reviews List

**Route:** `Routes.dashboard.reviews`  
**Purpose:** Browse Store reviews and feedback  
**Access:** Owner, Store Manager  

**Sections (existing):** Stats (★4.93, Super Fast, 98.6% hardcoded); Recent notes from `demoReviews`  

**Desired:** Filterable list — employee, rating, sentiment, date, search comment; auto categories Positive/Negative (spec §19)  

**Data columns:** rating, visibility, sentiment, employee, comment, created_at, tags, tip link  

**Actions:** Open detail; filters  
**Empty / loading / error:** Standard list patterns  

### Review Detail

**Status:** Missing  
**Type:** Prefer drawer or `/dashboard/reviews/:id`  
**Sections:** Full comment, category ratings, feedback answers, tags, linked tip, customer display fields  
**Actions:** None destructive in spec — do not invent delete  

### Feedback Config (Settings)

**Status:** Missing  
**Location:** Settings tab “Reviews & feedback” ([settings-and-branding.md](./settings-and-branding.md))  
**Purpose:** Store Type seeds defaults; Store can add/remove/edit freely (spec §8)  

**Manage:**  
- `ReviewCategory` — name Json i18n, sort_order, is_active  
- `FeedbackQuestion` — question Json, type RATING|TEXT, sort_order, is_active  
- `ReviewTag` — name, sentiment, is_active  
- Store: `public_review_redirect_url`, `public_review_rating_threshold`  

**Seed defaults by industry:** Restaurant / Hotel / Salon / Spa / etc. (spec §8) — implement as constant templates in `config/constants/`, not invented DB rows without API.

---

## Customer review UI

Documented in [customer-tipping.md](./customer-tipping.md): stars, categories, text, public vs private branch.

---

## AI Feedback Analysis (spec §20)

**Model:** `InsightSummary`  
**UI:** Analytics → Insights tab ([analytics.md](./analytics.md))  
**Plan gate:** Likely Professional/Enterprise — **unclear** exact gating  
**Status:** Missing  

---

## Modals / Forms

### Create / Edit Feedback Question

**Fields:** question (per language), type, sort_order, is_active  
**Actions:** Save, Cancel  

### Create / Edit Category

**Fields:** name (i18n), sort_order, is_active  

### Delete question/category

**ConfirmationDialog** — confirm unused or archive via `is_active` (prefer deactivate)

---

## Data model

```text
Store 1─* Review
Review 0..1 Tip (unique tip_id)
Review → CategoryRatings, TagAssignments, FeedbackResponses
Store 1─* ReviewCategory / ReviewTag / FeedbackQuestion
```

Enums: `ReviewVisibility` PRIVATE|PUBLIC; `ReviewSentiment` POSITIVE|NEUTRAL|NEGATIVE; `FeedbackQuestionType` RATING|TEXT.

---

## User flows

```text
Manager reviews feedback
  Sidebar → Reviews → Filter → Open detail → Read

Configure questions
  Settings → Reviews & feedback → Edit questions → Save
  → Next customer tip flow shows updated questions

Customer low rating
  → Private feedback form → Review PRIVATE
Customer high rating
  → Public prompt → optional redirect → Review may be PUBLIC / flag redirected
```

---

## Implementation notes

- Feature: `features/reviews/`.  
- Sentiment/visibility chips from dropdown options files.  
- Demo “recognition badges” (super-fast, etc.) map conceptually to tags — wire to `ReviewTag` when API ready.
