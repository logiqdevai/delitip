# Authentication

## Feature Overview

Sign-in, sign-up, password reset, and invite claiming for Users who become Organization members, Employees, or Customers.

**Roles:** Public → authenticated User  
**Prisma:** `User`, `PasswordResetToken`; post-auth: `Organization`, `OrganizationMember`, `Employee`  
**Dependencies:** Onboarding, Account switcher, Legal pages  
**Status:** Sign-up **Wired**; Business + Employee sign-in **Wired**; Forgot/reset password **Wired**; Invite accept **Missing**

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
├── Forgot Password (/auth/forgot-password) [page]
├── Reset Password (/auth/reset-password?token=) [page]
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
**Employee form fields:** Email, Password; Forgot password link; callout that PIN is not supported yet  

**Primary actions:** Business → `useLoginBusiness` → dashboard; Employee → `useLoginEmployee` → employee portal  
**Desired success:**  
- Business Owner/Manager/Accountant → `Routes.dashboard.root` (or `Routes.onboarding` via guard when no Org membership)  
- Employee → `Routes.employee.root`  
- Multi-account → Account switcher (Post-MVP)  

**Business success (current):** Session stored → `Routes.dashboard.root`; invalid credentials → error toast + field validation  
**Employee success (current):** Session stored → `Routes.employee.root` via email/password (same login API)  
**Errors:** Invalid credentials toast; field validation  
**Permission:** N/A (portal vs portal enforcement is task 1.3)  

**Data model:** `User.email` / `User.phone` / `User.password`  
**Schema gap:** PIN not in Prisma — MVP uses email/password; PIN remains Post-MVP / product decision

### Sign Up

**Route:** `Routes.auth.sign_up`  
**Purpose:** Create business account (User + Organization + first Store — desired)  
**Access:** Public  
**Role switcher:** Employee selection navigates to sign-in `?role=employee` (no employee self sign-up)  

**Fields (existing):** Venue name, Business Type select, Team Size select, Full name, Work email, Password; agree to Terms/Privacy  

**Dropdown sources (existing):**  
- `config/constants/dropdowns/businesses/business-type-form.options.ts` (aliases `StoreIndustry`)  
- `…/team-size-form.options.ts` (UI-only; not persisted)  

**API flow:** `POST /auth/email/register` → session → optional `PATCH /users/me` (name) → `POST /organizations` with nested first `store` (`name` + `industry`)  

**Post-submit:** Redirect `Routes.onboarding` (Step 1 business profile; skip to dashboard when Store already exists)  
**Validation:** Zod + `zodResolver` via `features/auth/validation-schemas/auth.schema.ts`  
**Errors:** Toast on failure; field messages for validation

### Forgot Password

**Route:** `Routes.auth.forgot_password` → `/auth/forgot-password`  
**Status:** Wired  
**Purpose:** Request reset email  
**Prisma:** `PasswordResetToken`  
**Fields:** Email  
**Actions:** Submit → inline success (does not reveal whether email exists)  
**API:** `POST /auth/forgot-password`

### Reset Password

**Route:** `Routes.auth.reset_password` → `/auth/reset-password?token=`  
**Status:** Wired (matches API email link `AppUrls.resetPassword`)  
**Fields:** New password, confirm password  
**Actions:** Submit → `POST /auth/reset-password` → toast → sign-in  
**Errors:** Missing token → invalid-link state; invalid/expired token → error toast

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
  /auth/sign-in → Business form → Validate → `POST /auth/email/login`
    → Single org → /dashboard
    → Multi account → Account switcher (Post-MVP)
    → Error → toast + stay

Employee Sign In
  /auth/sign-in?role=employee → Email+password → `POST /auth/email/login` → /employee

Business Sign Up
  /auth/sign-up → Form → Agree legal → Register + create Org/Store
    → /dashboard
    → Validation errors stay on form
    → API error → toast

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
