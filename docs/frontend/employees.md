# Employees

## Feature Overview

Manage Store staff profiles used for tipping attribution, QR assignment, and performance. Spec §12.

**Roles:** Owner, Store Manager (manage); Employee (own profile read in employee portal)  
**Prisma:** `Employee`, `Document` (photo), optional `User`, `QrCodeEmployee`, tips/reviews relations  
**Dependencies:** QR, Distribution, Reviews, Auth invites  
**Status:** **Wired** — list/create/edit/deactivate on `/dashboard/employees`; detail page still missing

---

## Hierarchy

```text
Employees
├── Employee List (/dashboard/employees)        [page — wired]
├── Employee Detail (/dashboard/employees/:id)  [missing]
├── Create / Invite Employee                    [modal — wired]
└── Edit Employee                               [modal — wired]
```

---

## Pages

### Employee List

**Route:** `Routes.dashboard.employees`  
**Purpose:** Browse staff for the selected Store  
**Access:** Owner, Store Manager  
**Entry:** Sidebar “Employees”; Overview CTAs  

**Sections (existing):** Header + “Add New Employee”; grid of employee cards  

**Card data (demo):** Photo, name, role/position, employment label, tips7d, rating, reviewCount, recognition badge, On/Off Shift pill  

**Desired list data from schema:** `full_name`, `email`, `position`, `is_active`, photo URL, aggregated tips/rating/review counts  

**Primary actions:** Add New Employee (button exists, no handler)  
**Secondary per card:** View QR → currently links Access page (should open employee/QR detail)  

**Empty:** “No employees yet” + Add CTA  
**Loading:** Card grid skeleton  
**Error:** Toast  

**Context menu (desired):** View details, Edit, View QR, Activate/Deactivate, Remove (`ConfirmationDialog`)

### Employee Detail

**Route (suggested):** `/dashboard/employees/:employeeId` → add `Routes.dashboard.employee(id)`  
**Status:** Missing  
**Purpose:** Full profile + performance + personal QR  
**Sections:** Header (photo, name, position, status); Tips summary; Reviews; Feedback; Personal QR; Linked User invite status  
**Actions:** Edit, Deactivate, Print QR  
**Related:** `Employee`, `Tip`, `Review`, `QrCode` (personal)

---

## Modals / Forms

### Create / Invite Employee Modal

**Trigger:** Add New Employee  
**Title:** Add employee  
**Fields:** full_name (required), email (required), position?, photo upload?, send invite?  
**Validation:** Zod; unique email per store **unclear** (schema has no unique on email alone)  
**Actions:** Cancel, Save / Invite  
**Success:** Close modal; invalidate employees query; toast  
**Permission:** Owner, Store Manager  

### Edit Employee Modal / Form

**Fields:** Same as create + `is_active`  
**Photo:** `Document` upload (`DocumentType.IMAGE` / `LOGO` as appropriate)

### Deactivate / Remove Confirmation

**Component:** `ConfirmationDialog`  
**Unclear:** Soft deactivate (`is_active=false`) vs hard delete — prefer deactivate (inferred from `is_active`)

---

## Data model

```text
Store 1─* Employee
Employee 0..1 User
Employee 0..1 photo Document
Employee *─* QrCode (via QrCodeEmployee)
Employee 1─* Tip / Review (optional FKs)
```

No Employee role enum — staff identity only.

---

## User flows

```text
Add Employee
  List → Add → Modal → Validate → Create Employee
    → Optional invite email → Placeholder until User registers
    → Refresh list

View Detail
  List → Card click → Detail
    → Edit → Save → Toast
    → Deactivate → Confirm → is_active false
```

---

## Implementation notes

- Feature: `features/employees/`.  
- Status labels from dropdowns (`employee-status-form.options.ts` when added).  
- Do not put components under `features/employees/components/`.  
- Employment type strings in demo (“Full-time”) are **not** in schema — **do not persist** without schema support.
