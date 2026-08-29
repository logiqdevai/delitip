# Landing and Marketing

## Feature Overview

Public marketing site and contact channel. No authenticated Prisma entities. Pricing CTAs lead into auth / contact.

**Roles:** Public  
**Dependencies:** Auth sign-up, Contact, Legal pages  
**Status:** Landing + Contact **Existing**; Legal **Missing**

---

## Hierarchy

```text
Marketing
├── Landing (/)                         [page]
│   ├── Announcement banner
│   ├── Header
│   ├── Hero
│   ├── Industries
│   ├── How it works (#how-it-works)
│   ├── Ecosystem (#ecosystem)
│   ├── Calculator (#calculator)
│   ├── Pricing (#pricing)
│   ├── CTA
│   └── Footer
├── Contact (/contact)                  [page]
├── Legal Terms (/legal/terms)          [missing]
└── Legal Privacy (/legal/privacy)      [missing]
```

---

## Pages

### Landing

**Route:** `Routes.home` → `/`  
**File:** `app/src/app/(landing)/page.tsx`  
**Purpose:** Convert visitors to sign-up or tip-flow demo.  
**Access:** Public  
**Sections:** AnnouncementBanner, Header, Hero, Industries, HowItWorks, Ecosystem, Calculator, Pricing, CTA, Footer  
**Primary actions:** Create account → `Routes.auth.sign_up`; Demo → `Routes.client.root` / `Routes.landing.demo`  
**Secondary:** Anchor nav; pricing CTAs → sign-up or contact  
**Data:** Static copy in components (no API)  
**Empty / loading / error:** N/A (static)

### Contact

**Route:** `Routes.contact` → `/contact`  
**Purpose:** Sales, support, billing, partnerships inquiries  
**Access:** Public  
**Sections:** LandingHeader, ContactHero (form + aside), LandingFooter  
**Form fields:** Topic chips (Sales & demos / Account support / Billing / Partnerships), Full name, Work email, Business (optional), Message  
**Actions:** Submit (fake pending → success)  
**Aside:** `info@delitip.com`; Account help → sign-in  
**Data model:** **Frontend-only** — no Prisma model (**schema gap** if persistence required)  
**Validation (desired):** Zod schema in route or feature when wired; required name, email, message, topic

### Legal Terms / Privacy

**Routes:** `Routes.legal.terms`, `Routes.legal.privacy`  
**Status:** Missing `page.tsx`; linked from sign-up and footer  
**Purpose:** Legal copy for registration agreement and trust  
**Access:** Public  
**Unclear:** Exact legal content ownership

---

## Forms

### Contact Form

**Trigger:** `/contact`  
**Fields:** topic, fullName, workEmail, businessName?, message  
**Actions:** Cancel N/A; Submit  
**Success:** Inline success state (existing)  
**Error:** Toast / field errors when API exists

---

## User flows

```text
Visitor → Landing → Create account → /auth/sign-up
Visitor → Landing → Demo → /client
Visitor → Contact → Submit inquiry → Success state
Visitor → Sign-up → Terms/Privacy links → [missing pages]
```

---

## Implementation notes

- Keep marketing components under `app/(landing)/components/` and `app/contact/components/`.
- Do not put marketing copy enums in `features/`.
- Pricing plan labels should eventually align with `SubscriptionPlan` dropdown options under `config/constants/dropdowns/`.
