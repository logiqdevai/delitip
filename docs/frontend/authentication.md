# Authentication

## Feature Overview

Sign-in, sign-up, password reset, and invite claiming for Users who become Organization members, Employees, or Customers.

**Roles:** Public → authenticated User  
**Prisma:** `User`, `PasswordResetToken`; post-auth: `Organization`, `OrganizationMember`, `Employee`  
**Dependencies:** Onboarding, Account switcher, Legal pages  
**Status:** Sign-in / Sign-up **Partial** (mock); Forgot password **Missing**; Invite accept **Missing**

---

## Hierarchy

```text
Authentication
├── Sign In (/auth/sign-in)                 [page]
│   ├── Role switcher (Business | Employee) [control]
│   ├── Business form
│   └── Employee form
├── Sign Up (/auth/sign-up)                 [page]
│   ├── Role switcher (Business locked)
│   └── Business registration form
├── Forgot Password (/auth/forgot-password) [missing]
├── Reset Password (token URL)              [missing — unclear path]
└── Invite Accept                           [missing — unclear path]
```

**Layout:** `app/src/app/auth/layout.tsx` → `AuthShell` (header, split form + brand panel, footer)

---

## Pages

### Sign In

**Route:** `Routes.auth.sign_in` (`/auth/sign-in`)  
**Query:** `?role=employee` selects Employee form  
**Purpose:** Authenticate Business (Org member) or Employee  
**Access:** Public  
**Sections:** Role switcher; social buttons (Business only, presentational); credential form; link to sign-up  

**Business form fields:** Email, Password; Forgot password link → `Routes.auth.forgot_password`  
**Employee form fields:** Phone or email, 6-digit PIN; info callout  

**Primary actions:** Submit (currently fake 1s delay — **no redirect**)  
**Desired success:**  
- Business Owner/Manager/Accountant → `Routes.dashboard.root` or onboarding if incomplete  
- Employee → `Routes.employee.root`  
- Multi-account → Account switcher  

**Errors:** Invalid credentials toast; field validation  
**Permission:** N/A  

**Data model:** `User.email` / `User.phone` / `User.password`  
**Schema gap:** PIN not in Prisma — product decision required before treating PIN as production auth

### Sign Up

**Route:** `Routes.auth.sign_up`  
**Purpose:** Create business account (User + Organization + first Store — desired)  
**Access:** Public  
**Role switcher:** Employee selection navigates to sign-in `?role=employee` (no employee self sign-up)  

**Fields (existing):** Venue name, Business Type select, Team Size select, Full name, Work email, Password; agree to Terms/Privacy  

**Dropdown sources (existing):**  
- `config/constants/dropdowns/businesses/business-type-form.options.ts`  
- `…/team-size-form.options.ts`  

Align Business Type with `StoreIndustry` enum when wiring API.

**Desired post-submit:** Create User + Organization + Store → `/onboarding` or dashboard  
**Existing:** Fake submit only  

### Forgot Password

**Route:** `Routes.auth.forgot_password`  
**Status:** Missing  
**Purpose:** Request reset email  
**Prisma:** `PasswordResetToken`  
**Fields:** Email  
**Actions:** Submit → success message (do not reveal whether email exists — inferred security practice)  
**Follow-up page:** Reset with token — **unclear** exact route (suggest `/auth/reset-password?token=`)

### Invite Accept

**Status:** Missing  
**Spec:** Org invite and Employee invite by email create placeholder Accounts; register claims them (§11)  
**Unclear:** Dedicated invite token URL vs email-only claim on register  

---

## Modals / dialogs

None required for core auth. Optional: “Check your email” after forgot-password — page state preferred.

---

## User flows

```text
Business Sign In
  /auth/sign-in → Business form → Validate → Authenticate
    → Single org → /dashboard or /onboarding
    → Multi account → Account switcher
    → Error → toast + stay

Employee Sign In
  /auth/sign-in?role=employee → PIN form → Authenticate → /employee

Business Sign Up
  /auth/sign-up → Form → Agree legal → Create account
    → /onboarding (desired)
    → Validation errors stay on form

Forgot Password
  Sign-in → Forgot password → Enter email → Success state
    → Email link → Reset form → Sign in
```

**Cancellation:** Navigate away; no unsaved-changes guard required for auth forms (inferred).

---

## Implementation notes

- Feature module: `features/auth/` (hooks, services, interfaces, schemas).  
- UI stays in `app/auth/components/`.  
- Replace social buttons with real OAuth only when backend exists — do not invent OAuth schema.  
- After real auth, store session for axios interceptor (`config/api/axios.ts`).
