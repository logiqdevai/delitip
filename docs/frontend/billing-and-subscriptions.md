# Billing and Subscriptions

## Feature Overview

Organization-level subscription plans that gate features and scale by Stores/employees. Spec §32.

**Roles:** Organization Owner only  
**Prisma:** `Subscription` (1:1 Organization), `SubscriptionPlan`, `SubscriptionStatus`  
**Dependencies:** Organizations, feature gating in navigation  
**Status:** **Missing** in portal; landing pricing CTAs only

---

## Hierarchy

```text
Billing
├── Landing Pricing (/#pricing)                 [marketing — existing]
└── Billing Settings (/dashboard/settings/billing or /dashboard/billing)  [missing]
    ├── Current plan
    ├── Plan comparison / upgrade
    └── Payment method (provider customer)
```

---

## Pages

### Billing Settings

**Route (suggested):** `/dashboard/settings/billing` or `/dashboard/billing`  
**Purpose:** View and change Org subscription  
**Access:** Owner only — hide from Store Manager / Accountant / Employee  

**Sections:**  
- Current plan (`STARTER` | `PROFESSIONAL` | `ENTERPRISE`)  
- Status (`TRIALING` | `ACTIVE` | `PAST_DUE` | `CANCELED`)  
- Period start/end  
- Manage in provider portal (billing_provider_* ids)  

**Actions:** Upgrade / Downgrade; Open customer portal; Cancel (**ConfirmationDialog**)  

**Plan entitlements (spec — use for gating, not invent extras):**  

| Plan | Includes |
| --- | --- |
| Starter | Basic tipping, QRs, employees, basic reviews, basic analytics |
| Professional | Multiple Stores, advanced analytics, employee performance, custom feedback, review management, alerts |
| Enterprise | Unlimited Stores, advanced reporting, custom branding, multiple management levels, advanced analytics, dedicated support |

**Unclear:** Exact numeric limits (Stores/employees) per plan; UI for limit reached.

### Landing Pricing

**Existing:** Marketing section with CTAs to sign-up/contact — keep as acquisition, not billing management.

---

## Feature gating (desired)

When `Subscription.plan` is Starter:

- Hide or lock multi-store switcher create  
- Lock Alerts, advanced Analytics tabs, AI Insights with upgrade CTA  

Do not hardcode plan checks in random components — centralize (inferred helper in features/subscriptions).

---

## Data model

```text
Organization 1─1 Subscription
plan, status, billing_provider_customer_id?, billing_provider_subscription_id?, period dates
```

---

## User flows

```text
Owner hits plan limit
  → Upsell modal → Billing → Upgrade → Provider checkout → ACTIVE PROFESSIONAL
  → Features unlock

Past due
  → Banner on dashboard → Update payment method
```

---

## Open questions

1. Trial length and what Starter includes during trial?  
2. Who hosts checkout (Stripe Customer Portal etc.)?  
3. Per-Store pricing vs flat plan?
