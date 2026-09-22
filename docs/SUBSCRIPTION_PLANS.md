# Delitip Subscription Plans

Proposed plans, features, and pricing, based only on capabilities that are currently built in the codebase.

## Current state

- **Plan names don't match.** The database enum is `STARTER / PROFESSIONAL / ENTERPRISE`. The landing page (`app/src/app/(landing)/components/landing-pricing.tsx`) advertises **Starter / Business / Organization** at €0 / €29 / Custom.
- **Only one feature is gated.** `app/src/app/dashboard/analytics/components/analytics-workspace-gate.tsx` requires `PROFESSIONAL`. Nothing else checks the plan.
- **Every new organization is created as `ENTERPRISE`** (`api/src/modules/organizations/services/organizations.service.ts:50`), so in practice every account has every feature.
- **No billing provider is connected.** Per `api/src/modules/subscriptions/services/subscriptions.service.ts`, plan changes "take effect immediately and for free."
- **Revenue already comes from each tip.** `TIP_PLATFORM_COMMISSION_PERCENTAGE` defaults to **5%** (`api/src/shared/config/platform-finance/platform-finance.config.ts`) and is recorded on every `PaymentTransaction`. A subscription would be a second revenue stream on top of this commission.

## Plan overview

| | **Starter** | **Professional** | **Enterprise** |
|---|---|---|---|
| **Price** | €0 | **€29** / location / month | **€99** / location / month, from 5 locations |
| **Tip commission** | 5% | 3% | 1.9% |
| **Locations** | 1 | Up to 3 | Unlimited |
| **Employees** | Up to 10 | Unlimited | Unlimited |
| **QR codes & spots** | Unlimited | Unlimited | Unlimited |
| **Annual billing** | — | €290 / location / year (2 months free) | Custom |

## Starter — €0

Starter includes the full customer tipping flow, so the free plan is usable on its own and earns revenue through commission.

- QR tipping flow with no customer account (`/{storeSlug}/q/{code}`)
- 1 location, up to 10 employees, unlimited QR codes and spots
- Viva card payments, IBAN payout accounts, payouts
- Tips ledger and payment details
- Star ratings, comments, and redirect to a public review site above the rating threshold
- Branding: logo, cover image, brand colors, welcome and thank-you messages
- Localization in all 11 supported languages
- Owner role only
- Getting-started onboarding

## Professional — €29 / location / month

Professional covers day-to-day operations. It includes everything in Starter, plus:

- **Analytics workspace**: overview, tips, employees, stores, insights (already gated at this plan)
- **Custom tip distribution**: distribution rules, team/pooled splits, and both the `DIRECT` and `VIA_STORE` payout modes
- **Settlements** with CSV export for payroll (`settlements-csv.utils.ts`)
- **Custom review categories, review tags, and feedback questions**
- **Alerts**: all four `AlertType`s, with preferences per store
- **QR template customization** (`QrTemplateCustomization`: custom canvas and elements)
- **Employee dashboard**: staff see their own tips, rating, and feedback
- **Refunds** started by a manager
- All roles: Owner, Store Manager, Accountant
- Up to 3 locations

## Enterprise — from €99 / location / month

Enterprise is for businesses with many locations. It includes everything in Professional, plus:

- Unlimited locations and **analytics that compare locations** (`/dashboard/analytics/stores`)
- **Members limited to one store**: for example, a manager who can only access one location (`OrganizationMember.store_id`). This provides multiple management levels.
- **Insight summaries**: periodic feedback analysis (`InsightSummary`)
- Tax details, VAT configuration, and billing identity for invoices (`vat_number`, `legal_name`, `doy`)
- Dedicated support and account manager
- Commission below 1.9%, negotiated for high tip volume

## Pricing rationale

### €29 matches the current landing page

The landing page already shows €29, so it doesn't need new messaging. €29 is also a common price for the middle plan in EU hospitality software.

### Price per location, not per organization

- Almost all data belongs to a `Store`: employees, QR codes, branding, reviews, payouts.
- A group with 8 locations uses about 8× the resources of a single café.
- Revenue grows as a customer adds locations.

### Lower commission makes upgrading pay off

Take a busy restaurant that receives **€4,000/month** in tips:

| Plan | Commission | Subscription | Total monthly cost |
|---|---|---|---|
| Starter | €200 (5%) | €0 | **€200** |
| Professional | €120 (3%) | €29 | **€149** |

Upgrading saves the restaurant €51 per month. Delitip receives €29 of predictable monthly revenue in exchange for €80 of commission that changes with tip volume. Showing this comparison on the billing page gives customers a clear reason to upgrade.

> **Note:** Commission is currently one global environment variable. To charge a different rate per plan, `PlatformFinanceConfig` needs to use the organization's plan when it calculates the commission.

### The free plan's limits push growing businesses to upgrade

10 employees is enough for a single café, but a full restaurant team will need more and will move to Professional. The limit also matches the "Up to 10 team members" already on the landing page.

## Implementation checklist

1. **Default new organizations to `STARTER`** instead of `ENTERPRISE` (`organizations.service.ts:50`). Decide how to grandfather existing organizations.
2. **Add `PlanGate`** to distribution, settlements, alerts, review categories, review tags, feedback questions, and QR templates.
3. **Check the plan on the server.** `PlanGate` only hides UI. The API has no plan checks, so all endpoints are currently open to every plan. Add a guard next to `assertStoreAccess`.
4. **Enforce the numeric limits** (locations, employees) when records are created. Nothing limits them today.
5. **Set commission by plan** in `PlatformFinanceConfig`.
6. **Connect real billing.** `api/src/integrations/stripe/` already exists, and `Subscription` already has the `billing_provider_customer_id` and `billing_provider_subscription_id` fields.
7. **Use the same plan names everywhere.** Either rename the landing page plans to Professional/Enterprise, or add display names in `subscription-plan-form.options.ts`.
