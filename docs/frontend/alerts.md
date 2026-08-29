# Alerts

## Feature Overview

Configurable Store alerts for compliments, satisfaction drops, low ratings, and performance changes. Spec §21.

**Roles:** Owner, Store Manager (configure + receive); delivery to Accountant/Employee **unclear**  
**Prisma:** `Alert`, `AlertPreference`, `AlertType`  
**Dependencies:** Reviews, Tips, Analytics, Settings  
**Status:** **Missing**

---

## Hierarchy

```text
Alerts
├── Alerts Inbox (/dashboard/alerts)            [missing — suggested nav item]
└── Alert Preferences                           [settings tab — missing]
```

**Schema gap:** No Notification / email/push channel model — implement **in-app** inbox first.

---

## Pages

### Alerts Inbox

**Route (suggested):** `/dashboard/alerts` → `Routes.dashboard.alerts`  
**Purpose:** Read Store alerts  
**Access:** Owner, Store Manager  

**List data:** type, title, message, employee?, is_read, created_at  
**Actions:** Mark read; Mark all read; Open related review/employee if linked  
**Empty:** “No alerts”  
**Loading:** List skeleton  
**Badge:** Unread count on sidebar (desired)

### Alert Preferences

**Location:** Settings → Alert preferences  
**Data:** Per `AlertType` row in `AlertPreference` (`is_enabled`)  
**Types:**  
- `POSITIVE_COMPLIMENTS`  
- `NEGATIVE_SATISFACTION_DROP`  
- `LOW_RATING_REVIEW`  
- `PERFORMANCE_CHANGE`  

**Actions:** Toggle enables; Save (or autosave)  
**Permission:** Owner, Store Manager  

---

## Modals

None required. Optional detail drawer for long messages.

---

## Data model

```text
Store 1─* AlertPreference (unique per alert_type)
Store 1─* Alert (optional employee_id)
```

---

## User flows

```text
Low rating occurs
  → System creates Alert
  → Manager sees badge → Inbox → Mark read → Open review

Disable noise
  Settings → Alert preferences → Turn off PERFORMANCE_CHANGE → Save
```

---

## Open questions

1. Email/SMS/push delivery?  
2. Org-level vs Store-level preferences for Owners?  
3. Real-time (websocket) vs poll?
