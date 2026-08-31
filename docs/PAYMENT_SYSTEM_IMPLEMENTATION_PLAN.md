# Delitip Payment & Tip Distribution System — Implementation Plan

**Status of this document:** audit + implementation roadmap, based on direct inspection of the codebase (`api/`, `app/`) as of 2026-08-30 and Viva.com's public developer documentation (`developer.viva.com`, its OpenAPI spec, and `euhelp.viva.com`). No Viva capability claim below is assumed — each is either verified against a cited public doc or explicitly marked as unverifiable/gated and requiring direct confirmation from Viva.

**One-paragraph summary of where things stand:** Delitip's tip creation, splitting, refund-request, and payout-account UX are fully built and working — but every step that should touch real money is mocked. `Tip.status` is set to `COMPLETED` the instant a customer taps "Pay," with a fake `MOCK-xxxxxxxx` payment reference; `PayoutAccount.provider_account_id` is a locally generated `mock_acct_xxxx` string created on an empty POST; no `TipDistribution` has ever transitioned to `PAID` anywhere in the code. A large, well-structured Viva SDK wrapper (`api/src/integrations/viva`) and a smaller, domain-mismatched Stripe wrapper (`api/src/integrations/stripe`) already exist, but **neither is imported into `AppModule`** — they are unreachable from any HTTP route. This document specifies exactly what to build to turn the mock into a real, production-ready Viva-backed payment and payout system, reusing the existing Distribution Rule engine as-is.

---

## Table of Contents

1. [Current System Analysis](#1-current-system-analysis)
2. [Viva Capability Analysis](#2-viva-capability-analysis)
3. [Recommended Payment Architecture](#3-recommended-payment-architecture)
4. [End-to-End Payment Flow](#4-end-to-end-payment-flow)
5. [Store Account / Payout Setup](#5-store-account--payout-setup)
6. [Customer Tip Checkout Flow](#6-customer-tip-checkout-flow)
7. [Webhook Processing](#7-webhook-processing)
8. [Commission Calculation](#8-commission-calculation)
9. [Employee Tip Distribution](#9-employee-tip-distribution)
10. [Payout Architecture](#10-payout-architecture)
11. [Database Changes](#11-database-changes)
12. [API Changes](#12-api-changes)
13. [Frontend Changes](#13-frontend-changes)
14. [Transaction Ledger and Financial Logging](#14-transaction-ledger-and-financial-logging)
15. [Error Handling and Edge Cases](#15-error-handling-and-edge-cases)
16. [Security Requirements](#16-security-requirements)
17. [Implementation Plan by Step](#17-implementation-plan-by-step)
18. [Files/Modules That Need Changes](#18-filesmodules-that-need-changes)
19. [Open Questions or Viva API Limitations](#19-open-questions-or-viva-api-limitations)

---

## 1. Current System Analysis

### 1.1 What already exists and works today

| Capability | State | Where |
|---|---|---|
| QR → employee selection → tip amount UI | **Real, working** | `app/src/app/[storeSlug]/q/[code]/**` |
| Tip creation record | **Real, but mock-paid** | `POST /public/tips`, `api/src/modules/tips/services/tips.service.ts:43-140` |
| Distribution Rule engine (percentage split, Store/Employee recipients, choose-one/choose-many/team renormalization, rounding remainder) | **Real, fully working, no changes needed** | `api/src/shared/utils/distribution/distribution-calculator.util.ts:33-132`, `api/src/modules/distribution-rules/**` |
| `TipDistribution` rows (frozen per-recipient amounts) | **Real** | created transactionally alongside `Tip` (`tips.service.ts:89-118`) |
| Refund request/approve workflow | **Real, but no processor call** | `api/src/modules/refunds/**` — status transitions only, no Viva/Stripe API is ever called |
| Payout account "connect" | **Mocked** — instantly `ACTIVE`, fake `provider_account_id`, no IBAN/bank details collected anywhere | `api/src/modules/payout-accounts/payout-accounts.service.ts:16-33,58-71` |
| Employee earnings dashboard, tip history | **Real read views**, but the "earnings" are unpaid `TipDistribution` rows — `payout_status` never reaches `PAID` | `api/src/modules/employees/services/employees.service.ts:151-224` |
| Subscription billing | **Fully mocked** — plan changes are free and instant, no Stripe customer/subscription object is ever created | `api/src/modules/subscriptions/services/subscriptions.service.ts:9-11,29-44` |
| Viva SDK wrapper (OAuth2, Checkout, Transactions, Wallets, Bank Transfers, Marketplace, Resellers, Data Services, RF Codes, Sources, Webhooks-support) | **Built, but disconnected** — not imported in `AppModule`, no controller, not called from any of the above modules | `api/src/integrations/viva/**` |
| Stripe SDK wrapper (Connect accounts, Checkout, PaymentIntents, webhooks) | **Built, disconnected, and domain-mismatched** — references `booking_uuid`/`BookingStatus`/`account.credits`, concepts that don't exist in this schema; webhook handler's Prisma writes are entirely commented out | `api/src/integrations/stripe/**`, esp. `services/stripe-payments-webhooks.service.ts:62-328` |
| BullMQ/Redis queue infrastructure | **Provisioned, unused** — `QueuesModule` registers a global BullMQ connection and Bull Board admin UI, but zero `@Processor`/queues are registered anywhere in the app | `api/src/core/queues/queues.module.ts` |
| Frontend payment provider SDK | **Absent** — no Stripe.js/Viva SDK package in `app/package.json`, no checkout redirect, no return-URL handling | confirmed via dependency + route search |

### 1.2 What is missing (the gap this document closes)

- No real charge is ever collected from a customer.
- No webhook receiver exists for Viva or Stripe (`VivaWebhooksService`/`StripePaymentsWebhooksService` are orphaned services with no `@Controller`).
- No financial breakdown (processor fee, platform commission) is calculated or stored anywhere — the concept doesn't exist in the schema or the frontend today (`grep` for `platform_fee`/`commission` across `app/src` returned zero matches).
- No IBAN or bank-detail collection exists for stores or employees.
- No payout ever executes — `PayoutStatus.PAID`/`FAILED` are unused enum values.
- No idempotency mechanism exists anywhere in the payment path (no idempotency keys, no webhook dedupe table).
- No reconciliation/expiry sweep exists for abandoned or stuck payment attempts.

### 1.3 Why this matters for the design

Because *nothing* is wired up yet, this is a green-field build on top of a well-designed domain model (Organization → Store → Employee → DistributionRule → Tip → TipDistribution) that does **not** need to change shape — it needs a real payment/settlement layer bolted on. The Distribution Rule engine, RBAC guards, and multi-tenant Organization/Store model should be reused as-is; §9 explicitly confirms no changes are needed there beyond feeding it a different input amount (net-of-fees instead of gross).

---

## 2. Viva Capability Analysis

All items sourced from `developer.viva.com` and its published OpenAPI spec, verified by a dedicated research pass. Full citations are in the research trail; key facts:

### 2.1 Smart Checkout (payment collection) — **confirmed, fully documented, no partner approval needed**

- Two-part host architecture: `accounts.vivapayments.com` (OAuth2 token) + `api.vivapayments.com` (REST: orders, transactions) + `www.vivapayments.com` (hosted checkout page + legacy Basic-auth `/api/*` endpoints). Demo equivalents: `demo-accounts.`, `demo-api.`, `demo.` — this exactly matches what's already encoded in `api/src/integrations/viva/viva.config.ts:37-53`.
- Flow: `POST /connect/token` (OAuth2 client-credentials, Basic auth with client id/secret) → `POST https://api.vivapayments.com/checkout/v2/orders` (returns `orderCode`) → redirect (full page, **not an iframe** — Viva's docs warn this breaks Apple Pay/Klarna/BLIK/EPS/P24/PayU/IRIS) to `https://www.vivapayments.com/web/checkout?ref={orderCode}` → customer pays → Viva redirects to a **Success/Failure URL configured on the payment Source**, not passed per-order → server verifies via `GET /checkout/v2/transactions/{transactionId}` (**mandatory** per Viva's own docs — never trust the redirect alone).
- Order payload supports a first-class `tipAmount` field and `disableExactAmount` (let the customer choose the amount) — both directly relevant, since Delitip's "amount" *is* the tip.
- `orderCode` is a 16-digit number that exceeds `Number.MAX_SAFE_INTEGER` in JS — **must be stored/transmitted as a string**, not a number, everywhere in our stack (DB column, JSON payloads, frontend state).
- `paymentTimeout` defaults to 1800 seconds (30 min) — after that the order expires with **no webhook fired** (see §2.2).

### 2.2 Webhooks — **confirmed, but with a critical caveat: no HMAC signature exists**

- Configured per event type in the Viva merchant portal (Settings → API Access → Webhooks), max 10 URLs per event type.
- Relevant event types: `Transaction Payment Created` (1796), `Transaction Reversal Created` (1797, refunds), `Transaction Failed` (1798), `Transaction Price Calculated` (1799, **this is when Viva's own commission is deducted and observable**), `Command Bank Transfer Created`/`Executed` (768/769, IBAN payout tracking), `Account Connected`/`Account Verification Status Changed` (8193/8194, marketplace only), `Transfer Created` (8448, marketplace only).
- **Authenticity verification has no signature/HMAC.** The mechanisms Viva actually provides are: (a) a one-time verification-key handshake at webhook registration (`GET /api/messages/config/token` with Basic auth → `{"Key": "..."}`, which your endpoint must echo back on a GET — this is exactly what `VivaWebhooksService.getVerificationKey()`/`buildHandshakeResponse()` already implements, just never wired to a route); (b) published IP address ranges to allowlist; (c) Viva's own explicit instruction to **always re-fetch the transaction server-side before trusting a webhook's claimed status/amount**. This directly drives §7 and §16 below.
- **At-least-once delivery is explicit and documented**: non-2xx responses trigger 24 retry attempts, once per hour, for up to 24 hours. Payloads carry a `MessageId` (UUID) — this is the correct idempotency key.
- No webhook fires for a cancelled checkout or an expired/abandoned order — these must be detected by a **polling/reconciliation sweep**, not a webhook (§15).

### 2.3 Marketplace API / connected accounts (Option A) — **real capability, but commercially gated and business-shaped**

- Viva has a genuine Stripe-Connect equivalent: `POST /platforms/v1/accounts` onboards a connected "seller" (hosted KYC/KYB flow), and a payment can auto-split via a `transfer` object on order creation, or be split after the fact via `POST /platforms/v1/transfers` (supports multi-seller, queued until settlement or instant against available balance).
- **Blocking issue #1 — commercial gate:** Viva's own docs state verbatim that Marketplace API access requires talking to a Viva sales representative, submitting a marketplace-specific due-diligence questionnaire, and (in some cases) a VISA marketplace form. Even the *demo* environment platform account must be manually provisioned by Viva, and seller self-onboarding does not work in demo without manually pasting an `accountId`.
- **Blocking issue #2 — payee shape:** Onboarding fields are business-shaped (`legalName`, `tradeName`, `taxNumber`, eKYB). Nothing in Viva's public docs addresses onboarding a natural person (an individual employee) as a connected account. This makes Option A a plausible fit for **Store-level** payouts (stores are registered businesses) but an **unverified/likely-poor fit for Employee-level** payouts.
- Region: pan-European, described as supporting ~24 European markets including Greece; no per-country capability table is published.

### 2.4 Bank Transfer API / IBAN payouts (Option B) — **real capability, available today, works for individuals**

- `POST /banktransfers/v1/bankaccounts` links and validates **any IBAN** — Viva's own spec example explicitly labels the sample as *"the IBAN of the Greek partner"*, i.e., this is designed for paying third parties, not just your own settlement account.
- Fee quote (`POST .../fees`) then execute (`POST .../bankaccounts/{id}:send`) with `{amount, walletId, description, bankCommandId}`, tracked via `Command Bank Transfer Created/Executed` webhooks (768/769).
- Requires only "Account Transactions Credentials" + "Allow transfers between accounts" enabled in the merchant portal — **no sales approval, no due-diligence questionnaire**, unlike Marketplace.
- Constraint: IBAN currency must match the platform's Viva merchant account currency.
- **Important compliance caveat found in Viva's own marketplace documentation**: Viva states that if a platform acts as an "intermediary" between customers and sellers, PSD2 requires using the marketplace solution rather than moving funds via ad-hoc bank transfers. This is exactly Delitip's structural position (collecting from customers, remitting to stores/employees) and is called out explicitly in §19 as an item requiring direct confirmation from Viva/legal before going live at scale — it does not block building the technical flow, but it is a real regulatory question, not a formality.

### 2.5 Refunds — **confirmed**

- Standard: `DELETE https://www.vivapayments.com/api/transactions/{id}` (Basic auth, not OAuth2 — different host than everything else). Marketplace variant adds `reverseTransfers`/`refundPlatformFee` flags.
- Same calendar day → "Cancel/Reverse"; previous calendar day → "Refund/Void." Both support partial amounts, repeatable until the full amount is returned. No documented absolute cutoff beyond same/previous day framing — full/partial availability for older transactions should be confirmed with Viva if Delitip needs a longer refund window (§19).
- `Transaction Reversal Created` (1797) webhook confirms completion.

### 2.6 Fees — **not publicly published; must be confirmed contractually**

- Interchange++ model: interchange fee (from ~0.2% for EU consumer debit) + scheme fee + a **negotiated, non-public** "Viva.com acquiring fee" based on monthly card turnover.
- The fee base explicitly includes tip amounts, per Viva's own FAQ — directly relevant since Delitip's entire transaction *is* a tip.
- The only programmatic visibility into the actual fee charged is the `Transaction Price Calculated` (1799) webhook and the per-transfer `fee` returned synchronously by the Bank Transfer API's fee-quote call. There is no way to know the exact processor fee for a card transaction at order-creation time — only after settlement.

### 2.7 Capability verdict, mapped to the brief's two options

| | Option A — Connected Viva Account | Option B — IBAN payout |
|---|---|---|
| Technically supported | Yes | Yes |
| Available without a partner agreement | **No** — sales-gated | **Yes** |
| Works for individual employees | **Unverified / likely no** (business-shaped onboarding) | **Yes** — arbitrary IBAN, no KYB |
| Automatic split at payment time | Yes (`transfer` object) | No — computed and sent separately |
| Platform's regulatory position | Cleaner (Viva explicitly built this for PSD2 intermediary compliance) | Requires confirming PSD2 posture with Viva/legal |
| **Recommendation** | Phase-2 candidate for **Store**-level payouts only, once/if partner approval is obtained | **Recommended for V1**, for both Store and Employee payouts |

---

## 3. Recommended Payment Architecture

**Collection:** Viva Smart Checkout, OAuth2 client-credentials, a single platform-level Viva merchant account (matching the existing global `VIVA_MERCHANT_ID`/`VIVA_SOURCE_CODE` config shape — no per-store Viva account is required or supported without Marketplace onboarding).

**Settlement:** All customer tips land in Delitip's own Viva wallet. Viva deducts its own processing fee at settlement (observable, not controllable, via the 1799 webhook). Delitip's platform commission is a separate, configurable deduction computed on the **gross** tip amount, not on the post-Viva-fee amount (§8).

**Payout (recommended for V1):** Bank Transfer API (Option B) — both stores and employees register an IBAN; Delitip holds funds and remits via `:send`. This is the only option available without commercial gating and the only one confirmed to work for individual (non-business) payees. Marketplace connected accounts (Option A) are documented as a **future, Store-only** upgrade path, contingent on Viva partner approval — see §19.

**Distribution timing (recommended): Scheduled, not immediate.** Reasons:
1. Viva's actual processing fee for a given transaction is only known after settlement (1799 webhook or reconciliation), so the exact net-distributable amount cannot be finalized synchronously at payment time.
2. Refunds/cancellations remain possible for same-day and previous-day transactions; paying out instantly and then having to claw back an IBAN transfer (which, unlike a Marketplace transfer, has no `reverseTransfers` flag) is operationally painful.
3. Batching payouts per recipient reduces the number of (fee-bearing) bank transfers.

Recommended default: a **daily** payout batch job that only includes `TipDistribution` rows whose parent `Tip` is `COMPLETED`, whose processor fee has been confirmed, and which are older than a configurable hold window (e.g., 2 days, comfortably past Viva's refund-eligibility framing) — plus an explicit **"Pay out now"** manual trigger per store, satisfying the brief's "Manual by store" option at the same time.

**Distribution split calculation:** unchanged — the existing `calculateTipDistribution()` engine is reused verbatim, just fed the *net distributable amount* instead of the gross tip amount (§9).

---

## 4. End-to-End Payment Flow

```
Customer scans QR
  → app/[storeSlug]/q/[code] (existing, unchanged)
  → selects employee(s) + amount (existing, unchanged)
  → "Pay" → POST /public/tips  [MODIFIED]
        creates Tip(status=CREATED) + PaymentTransaction row
        calls VivaCheckoutService.createOrder()  →  Viva orderCode
        returns { tipId, checkoutUrl }
  → frontend full-page redirects to Viva Smart Checkout  [NEW]
  → customer pays on Viva's hosted page
  → Viva redirects back to Delitip's configured Success/Failure URL  [NEW return page]
        with query params: t (transactionId, may be absent), s (orderCode), eventId
  → frontend calls GET /public/tips/:id/status  [NEW]  (short poll, since webhook may race)
  → in parallel/independently: Viva POSTs webhook (EventTypeId 1796/1798) to /webhooks/viva  [NEW]
        handler re-fetches GET /checkout/v2/transactions/{id} (never trusts payload alone)
        upserts WebhookEvent by MessageId (idempotency)
        on confirmed success: Tip.status=COMPLETED, computes financial breakdown (§8),
        freezes TipDistribution rows via existing calculateTipDistribution() (§9)
  → customer sees Success / Failure / Cancelled state (existing "done" step + 2 new states)
  → [later] reconciliation sweep catches abandoned/expired orders with no webhook (§15)
  → [later] scheduled payout batch job pays out COMPLETED, hold-window-cleared distributions
        via Viva Bank Transfer API, per recipient (§10)
```

---

## 5. Store Account / Payout Setup

**Decision:** IBAN-based (Option B) for V1, for both Store and Employee payout accounts. This directly supersedes the current mock flow while keeping the same conceptual shape (`PayoutAccount` per Store or per User).

**Store flow (modify existing `POST /stores/:storeId/payout-account`):**
1. Store owner enters IBAN + beneficiary (legal business) name in a new form (`app/src/app/dashboard/payments/components/payout-account-card.tsx` — currently a single button with an empty POST body).
2. Backend calls `VivaBankTransfersService` → `POST /banktransfers/v1/bankaccounts` with `{iban, friendlyName, beneficiaryName}`.
3. Store the returned `bankAccountId` on `PayoutAccount`; set `status = PENDING` until Viva's validation completes (the exact validation semantics/timing should be confirmed against Viva's response — see §19), then `ACTIVE`.
4. **Do not persist the raw IBAN** beyond what's needed to display a masked confirmation (e.g., last 4 digits) — after linking, the only durable identifier we need is Viva's `bankAccountId` (§16).

**Employee flow:** identical mechanism, via `POST /users/me/payout-account`, with copy that makes clear this is the employee's **personal** IBAN (distinguishing it from the store's business IBAN in the UI).

**Status display:** Store/employee dashboards should show `PENDING` (submitted, awaiting validation), `ACTIVE` (can receive payouts), `RESTRICTED`/`DISABLED` (surfaced if Viva ever reports an issue — currently unused enum values with no real trigger; once real, a failed bank-transfer webhook or manual admin action should be able to set these).

**Recommendation vs. brief's Option A/B question:** ship Option B now; keep the schema's `provider`/`payout_method` fields generic enough (§11) that a Store could later be switched to a Marketplace connected account (Option A) without a schema rewrite, if/when Viva partner approval is obtained.

---

## 6. Customer Tip Checkout Flow

### Backend (`api/src/modules/tips`)

1. **`POST /public/tips` — MODIFY.** Currently (`tips.service.ts:43-140`) creates the `Tip` as `COMPLETED` synchronously. New behavior:
   - Validate QR/store/amount exactly as today (unchanged logic).
   - Create `Tip` with `status = CREATED` and a `PaymentTransaction` row (§11) holding `gross_amount`, `currency`.
   - Call `VivaCheckoutService.createOrder()` with `amount` (minor units), `tipAmount` = same value, `merchantTrns` = internal tip id, `customerTrns` = store-facing description, `sourceCode` from platform config, `paymentTimeout` (consider shortening from the 1800s default to match the UX — e.g. 600s — to reduce the abandoned-order window).
   - Persist `viva_order_code` (as a **string**) on `PaymentTransaction`.
   - Return `{ tipId, checkoutUrl }` to the frontend — do **not** return final success yet.
   - **Idempotency:** accept an `Idempotency-Key`/`client_request_id` from the frontend (generated once per checkout attempt) so a network retry of the "Pay" tap doesn't create two Viva orders for one intended tip (§16).

2. **`GET /public/tips/:id/status` — NEW.** Lightweight public read, returns `{ status, amount, employee, distribution_summary? }` — used by the return page to resolve the final outcome without waiting on the webhook.

### Frontend (`app/src/app/[storeSlug]/q/[code]`)

- `components/steps/review-step.tsx` — **MODIFY**: "Pay" now calls the modified `POST /public/tips`, then does a **full-page redirect** (`window.location.href`, never an iframe) to the returned `checkoutUrl`.
- **NEW route**: a payment-return page (e.g. `app/[storeSlug]/q/[code]/return` or a dedicated top-level route matching whatever URL is registered as the Viva payment Source's Success/Failure URL — see the per-source URL constraint in §2.1/§19). It reads the `s`/`t` query params Viva appends, correlates back to the local `tipId` (round-tripped via `merchantTrns`/local storage/query param, mirroring the existing `?tip=<id>` pattern already used for the done-step), and polls `GET /public/tips/:id/status` briefly (e.g. up to ~10s with backoff) before falling back to a "still processing, check back shortly" state if neither the redirect nor a quick poll has resolved it yet (webhook delay case, §15).
- `components/steps/done-step.tsx` — **MODIFY**: extend beyond today's single "success" rendering to branch on `COMPLETED` / `FAILED` / `CANCELLED` / "still processing."
- **NEW** failure and cancelled UI states — currently entirely absent (today's flow only ever reaches the done-step from a synchronous success response).

---

## 7. Webhook Processing

**New controller** (does not exist today — `VivaWebhooksService` currently has no route): `api/src/integrations/viva/controllers/viva-webhooks.controller.ts`, mounted at e.g. `POST /webhooks/viva` and also handling `GET /webhooks/viva` for the one-time verification handshake (Viva GETs the URL at registration time expecting the cached `{Key: ...}` JSON from `VivaWebhooksService.getVerificationKey()`).

**Processing steps for every inbound POST:**
1. **IP allowlist check** (§16) — reject anything not from Viva's published ranges before any parsing.
2. Parse `EventTypeId`, `MessageId`, `EventData`.
3. **Idempotency:** `INSERT ... ON CONFLICT DO NOTHING` into a new `WebhookEvent` table keyed by `MessageId` (unique). If the insert conflicts (already seen), acknowledge `200` immediately and stop — this handles Viva's documented at-least-once/24-retry delivery.
4. Enqueue the actual processing onto a BullMQ queue (new — the infra exists in `api/src/core/queues` but has zero registered queues today) rather than doing it inline, so a transient DB failure is retried by the queue instead of by Viva's hourly retry cadence, and the HTTP handler can ack fast.
5. **Never trust `EventData` for state transitions.** For `Transaction Payment Created` (1796) and `Transaction Failed` (1798), the processor must call `GET /checkout/v2/transactions/{transactionId}` (already implemented, unused: `VivaTransactionsService.getTransaction`) and act on the verified `statusId`/`amount`, matched against the `Tip`'s expected amount and `merchantTrns`.
6. On verified success: within one DB transaction, set `Tip.status = COMPLETED`, `paid_at`, compute and persist the financial breakdown (§8) on `PaymentTransaction`, and create the frozen `TipDistribution` rows via the **existing, unmodified** `calculateTipDistribution()` (§9).
7. On verified failure: `Tip.status = FAILED`, store the failure reason.
8. For `Transaction Reversal Created` (1797): route into the refund-completion path (§10.4).
9. For `Transaction Price Calculated` (1799): update `PaymentTransaction.processor_fee_confirmed` — this is the trigger that unblocks a distribution from being eligible for payout (§10).
10. For `Command Bank Transfer Created/Executed` (768/769): update the corresponding `Payout` row's status.

**Reconciliation safety net (§15):** a scheduled job independently sweeps any `Tip` still `CREATED`/`PROCESSING` past `paymentTimeout`, and calls `GET /api/orders/{orderCode}` / `GET /checkout/v2/transactions/{id}` directly — this covers the two cases Viva's docs say never produce a webhook (cancelled checkout, expired/abandoned order).

---

## 8. Commission Calculation

**Configuration:** `TIP_PLATFORM_COMMISSION_PERCENTAGE` as a platform-wide env var default (matching the brief's example exactly), read once via a small `PlatformFinanceConfig` service — never hardcoded inline anywhere a percentage is used. Architecture leaves room for an optional future per-Store override (a nullable `commission_percentage_override` column on `Store`), but that is not required for V1; document it as a phase-2 hook, not a blocker.

**Order of calculation** (matches the brief's example, resolved against Viva's actual settlement model from §2.6):

```
Gross Tip Amount                                  (what the customer paid; = Tip.amount)
− Payment Processor Fee (Viva's actual fee)        (confirmed post-settlement via 1799 webhook/reconciliation)
− Platform Commission (% of GROSS Tip Amount)      (percentage snapshotted at transaction time)
= Net Amount Available for Distribution
```

Commission is computed on the **gross** amount rather than the post-processor-fee amount so that the platform's take is predictable and independent of card-network fee variance — this is a deliberate design choice, not a Viva constraint, and should be confirmed with the business owner if a different convention is preferred.

**Viva does return its actual processing fee — use that real value, not an estimate, for the final ledger.** Confirmed: the `Transaction Price Calculated` webhook (EventTypeId `1799`) fires when Viva withdraws its own commission from a settled transaction and carries the real fee amount for that specific transaction; it's independently re-queryable via the Data Services transaction-search API (`VivaDataServicesService.searchTransactions`) for reconciliation if the webhook is ever missed. So `processor_fee_confirmed_amount` on `PaymentTransaction` (§11) should always end up populated from Viva's own data, never computed from a guessed percentage.

**The only wrinkle is timing, not availability:** the 1799 webhook arrives *after* settlement, which is after `Transaction Payment Created` (1796) confirms the tip itself — so there's a short window where a tip is `COMPLETED` but its exact fee isn't known yet. Handling this window:
- Store a **provisional** breakdown at payment confirmation using a small configurable fallback constant — `TIP_PROCESSOR_FEE_ESTIMATE_PERCENTAGE`, defined the same way as `TIP_PLATFORM_COMMISSION_PERCENTAGE` (§8, not hardcoded inline) — for **UI display only** (e.g. showing an approximate net amount on the tip-detail page before settlement finishes).
- The moment the 1799 webhook (or the reconciliation lookup) delivers the real fee, overwrite the provisional value and set `processor_fee_confirmed = true`.
- **Payouts must only be computed/executed against the confirmed, Viva-supplied breakdown** — never the provisional estimate (§10.2 already requires `processor_fee_confirmed = true` as a payout-eligibility condition, so this is enforced structurally, not just by convention).

**Historical accuracy:** every `PaymentTransaction` row snapshots the exact `commission_percentage_used` and resulting `commission_amount` at the time of that transaction. Changing `TIP_PLATFORM_COMMISSION_PERCENTAGE` going forward must never trigger recomputation of past rows — this is satisfied purely by storing the value per-row rather than deriving it live from current config (§11, §14).

---

## 9. Employee Tip Distribution

**No change to the split algorithm.** `calculateTipDistribution()` (`api/src/shared/utils/distribution/distribution-calculator.util.ts:33-132`) already correctly implements every scenario in Product Spec §5 (Store/Employee recipients, choose-one/choose-many/team renormalization, rounding remainder to the lowest-sort-order recipient) and needs zero modification.

**What changes is the input:** today it's called with the full `Tip.amount` (gross); going forward it must be called with the **Net Amount Available for Distribution** from §8 — i.e., after the webhook handler confirms payment and finalizes the fee breakdown, not at tip-creation time as it is today. This means `TipDistribution` row creation moves from `TipsService.createPublicTip()` (today) to the webhook confirmation handler (§7) — a real behavioral change, since a `Tip` can now exist for a period without any `TipDistribution` rows (while `status = CREATED`/`PROCESSING`), whereas today they're created atomically and instantly.

**Distribution Rules module** (`api/src/modules/distribution-rules`) needs **no changes** — its CRUD, validation (percentages sum to 100 ±0.01), and rule-deletion guards (blocking deletion of a rule already referenced by a past Tip, preserving audit history) are already correct and reusable as-is.

**Historical accuracy requirement is already met structurally**: `TipDistribution` rows are already immutable snapshots independent of the live `DistributionRule` — changing a rule, or reassigning a QR code to a different rule, correctly has no effect on past tips (confirmed in the existing service logic). The same pattern must be extended to the new financial fields (§8/§11): once frozen, a `PaymentTransaction`'s commission/fee snapshot never changes.

---

## 10. Payout Architecture

### 10.1 Model

New `Payout` entity = one Bank Transfer API execution to one recipient (Store or Employee), covering one or more `TipDistribution` rows accumulated since the last payout. This is new — nothing today executes a payout.

### 10.2 Eligibility for inclusion in a payout batch

A `TipDistribution` row is eligible when **all** of:
1. Parent `Tip.status = COMPLETED`.
2. Parent `PaymentTransaction.processor_fee_confirmed = true` (net amount is final, not provisional — §8).
3. `TipDistribution.payout_status = PENDING` (not already claimed by another in-flight payout, not `CANCELLED` by a refund).
4. The Tip's `paid_at` is older than a configurable hold window (default recommendation: 2 days) — mitigates the same-day/previous-day refund window from §2.5.
5. The recipient (Store or Employee) has a `PayoutAccount` with `status = ACTIVE`.

### 10.3 Execution

Scheduled BullMQ job (daily default, configurable) plus a manual **"Pay out now"** trigger per store (satisfies the brief's "Manual by store" option):
1. Within a DB transaction, atomically claim eligible distributions for one recipient by setting a `payout_id` FK (guarded by `WHERE payout_id IS NULL AND payout_status = 'PENDING'`) — prevents two concurrent batch runs from double-claiming the same distribution (§16).
2. Sum the claimed amount, create a `Payout` row (`status = PROCESSING`).
3. Call Bank Transfer fee-quote (`POST .../fees`) then `:send` with the summed amount.
4. On synchronous success/failure, or on the later `Command Bank Transfer Executed` webhook (769), update `Payout.status` and cascade to `TipDistribution.payout_status = PAID`/`FAILED`.
5. On failure: retry with backoff via the queue, up to a configured max attempt count, recording each attempt (§10.4). Distributions belonging to a permanently failed payout revert to `payout_status = PENDING` (or a new `RETRYING` interim state) so the next batch run picks them up rather than losing track of them.

### 10.4 Failure handling

- **Failed payouts**: retried automatically (bounded retries), then surfaced to the store/platform for manual intervention if exhausted.
- **Partial payout failures** (batch covers multiple distributions but the underlying single bank transfer either fully succeeds or fully fails, since Bank Transfer API `:send` is one amount to one IBAN): a "partial failure" at the payout level isn't possible per-transfer, but a *batch run* covering many recipients will naturally have some succeed and some fail independently — track per-`Payout` row, not globally.
- **Employees/stores without valid payout details**: excluded from the eligibility query (§10.2 condition 5); dashboard should surface "no payout account connected" clearly so the Store/employee knows why funds are accumulating unpaid.
- **Refund after payout already executed**: since IBAN transfers have no automatic clawback (`reverseTransfers` is a Marketplace-only flag), a refund on a `Tip` whose distributions were already paid out must be flagged for manual reconciliation (an accountant-role review), not silently absorbed — this is exactly why the hold window in §10.2 exists, to make this the rare case rather than the common one.

---

## 11. Database Changes

All changes are additive to the existing `api/prisma/schema.prisma`; no existing relevant field needs to be removed, only extended.

### New models

**`PaymentTransaction`** (1:1 with `Tip`) — the financial ledger row:
```prisma
model PaymentTransaction {
  id                        String    @id @default(uuid())
  tip_id                    String    @unique
  provider                  PaymentProvider  @default(VIVA)
  viva_order_code           String?   @unique   // string, not numeric — 16-digit orderCode exceeds JS safe integer
  viva_transaction_id       String?   @unique
  gross_amount              Int
  currency                  Currency
  commission_percentage_used Decimal  @db.Decimal(5,2)
  commission_amount         Int
  processor_fee_estimated   Int?
  processor_fee_confirmed_amount Int?
  processor_fee_confirmed   Boolean   @default(false)
  net_distributable_amount  Int?
  status                    PaymentTransactionStatus @default(CREATED)
  failure_reason            String?
  confirmed_at              DateTime?
  created_at                DateTime  @default(now())
  updated_at                DateTime  @updatedAt

  tip Tip @relation(fields: [tip_id], references: [id], onDelete: Cascade)

  @@index([status])
  @@index([provider])
}

enum PaymentTransactionStatus {
  CREATED PROCESSING SUCCEEDED FAILED CANCELLED EXPIRED
}
```
(Kept separate from `Tip` rather than bolting fields onto it, so `Tip` stays focused on the tipping/QR domain and the ledger stays a clean, auditable unit per §14.)

**`WebhookEvent`** — idempotency + audit log for every inbound Viva webhook:
```prisma
model WebhookEvent {
  id           String   @id @default(uuid())
  provider     PaymentProvider @default(VIVA)
  message_id   String   @unique   // Viva's MessageId
  event_type_id Int
  payload      Json
  processed_at DateTime?
  processing_error String?
  created_at   DateTime @default(now())
}
```

**`Payout`** — one bank-transfer execution to one recipient:
```prisma
model Payout {
  id                  String       @id @default(uuid())
  recipient_type      DistributionRecipientType
  store_id            String?
  employee_id         String?
  payout_account_id   String
  amount              Int
  currency            Currency
  provider            PaymentProvider @default(VIVA)
  provider_transfer_id String?     // Viva bank-transfer commandId
  status              PayoutExecutionStatus @default(PENDING)
  failure_reason      String?
  retry_of_payout_id  String?
  scheduled_for       DateTime?
  executed_at         DateTime?
  created_at          DateTime     @default(now())
  updated_at          DateTime     @updatedAt

  store    Store?    @relation(fields: [store_id], references: [id])
  employee Employee? @relation(fields: [employee_id], references: [id])
  payout_account PayoutAccount @relation(fields: [payout_account_id], references: [id])
  distributions TipDistribution[]
  retry_of Payout? @relation("PayoutRetry", fields: [retry_of_payout_id], references: [id])
  retries  Payout[] @relation("PayoutRetry")

  @@index([status])
  @@index([store_id])
  @@index([employee_id])
}

enum PayoutExecutionStatus {
  PENDING PROCESSING COMPLETED FAILED RETRYING CANCELLED
}
```

### Modified models

- **`TipDistribution`** — add `payout_id String?` (FK to `Payout`, nullable, set only within the atomic claim transaction of §10.3); keep existing `payout_status` enum but add `PROCESSING`, `RETRYING` values.
- **`PayoutAccount`** — add `iban_last4 String?`, `beneficiary_name String?`, `bank_account_id String?` (Viva's linked-account id from the Bank Transfer API), `payout_method PayoutMethod @default(IBAN)` (enum: `IBAN`, `CONNECTED_ACCOUNT` — future-proofs for Option A without a schema rewrite). **Do not add a raw IBAN column** — see §16.
- **`Refund`** — add `provider_reference String?`, `provider_status String?` to record Viva's actual refund response/webhook confirmation, since `update()` today only flips local status with no processor call.
- **`Tip`** — extend `TipStatus` enum: `CREATED`, `PROCESSING` (order created / webhook received & verifying), `COMPLETED` (existing), `FAILED` (existing), `CANCELLED` (new — customer backed out or order expired), `REFUNDED` (existing). Add index on `(status, created_at)` for the reconciliation sweep query.
- **`Store`** (optional, phase 2) — nullable `commission_percentage_override Decimal? @db.Decimal(5,2)`.

### Constraints/indexes worth calling out specifically

- `PaymentTransaction.viva_order_code` and `.viva_transaction_id` — unique, so a duplicate webhook or a retried order-creation call can never create two ledger rows for one Viva transaction.
- `WebhookEvent.message_id` — unique, the idempotency backbone of §7.
- The atomic-claim pattern in §10.3 (`payout_id IS NULL`) functions as the payout idempotency guard — no separate unique constraint is needed beyond it, since a distribution can only ever be claimed once its `payout_id` is set.
- Consider a partial unique index or a documented invariant that a `Tip` has at most one non-cancelled `PaymentTransaction` (schema keeps this simple via the 1:1 `@unique tip_id`, so it's enforced structurally, not by an extra constraint).

---

## 12. API Changes

| Endpoint | Change | Auth | Notes |
|---|---|---|---|
| `POST /public/tips` | **Modify** | none | Creates `Tip(CREATED)` + `PaymentTransaction`, calls Viva order creation, returns `checkoutUrl`. Accepts idempotency key. |
| `GET /public/tips/:id/status` | **New** | none | Polled by the return page; returns status + amount only (no PII beyond what's already public). |
| `GET /webhooks/viva` | **New** | Viva verification handshake only | Returns cached `{Key}` JSON for the one-time registration challenge. |
| `POST /webhooks/viva` | **New** | IP allowlist | Verifies, dedupes by `MessageId`, enqueues processing. |
| `POST /stores/:storeId/payout-account` | **Modify** | JWT, OWNER | Now requires `{iban, beneficiaryName}`; calls `VivaBankTransfersService`. |
| `POST /users/me/payout-account` | **Modify** | JWT | Same, for employees; personal-IBAN framing. |
| `GET /stores/:storeId/payouts` | **New** | JWT, store access | Payout history (doesn't exist today — no endpoint or UI). |
| `GET /employees/:id/payouts` | **New** | JWT, self or store access | Employee payout history. |
| `POST /stores/:storeId/payouts/run` | **New** | JWT, OWNER | Manual "pay out now" trigger. |
| `PATCH /refunds/:id` | **Modify** | JWT, OWNER/STORE_MANAGER/ACCOUNTANT | On `COMPLETED`, must call Viva's real refund endpoint (`VivaTransactionsService` already has `createFastRefund`/`createRebate`/native cancel — select the correct one per §2.5's same-day-vs-previous-day rule) before finalizing local status; store `provider_reference`. |
| `GET /tips/:id` | **Modify (additive)** | JWT | Include the new financial breakdown fields from `PaymentTransaction` (gross/fee/commission/net) for the tip-detail view. |
| Commission config | **New, optional (phase 2)** | JWT, ADMIN/OWNER | `PATCH /stores/:id/commission-override` only if a per-store override is actually needed; otherwise the env var alone satisfies the brief. |

**Idempotency requirements:** `POST /public/tips` should accept a client-generated request id; `POST /webhooks/viva` is idempotent via `WebhookEvent.message_id`; `POST /stores/:storeId/payouts/run` should no-op (or queue-dedupe) if a batch run for that store is already in progress.

**Validation additions:** IBAN format/checksum validation (IBAN mod-97) before calling Viva, both server- and client-side; amount validation unchanged.

---

## 13. Frontend Changes

### Customer (`app/src/app/[storeSlug]/q/[code]`)

- `components/steps/review-step.tsx` — modify "Pay" to redirect to Viva checkout instead of finishing synchronously.
- New payment-return route + interim "verifying your payment" state (spinner + short poll against `GET /public/tips/:id/status`).
- `components/steps/done-step.tsx` — extend to branch on success/failure/cancelled/still-processing, not just success.
- New failure/cancelled UI states (currently absent entirely).

### Store (`app/src/app/dashboard`)

- `payments/components/payout-account-card.tsx` — replace the empty-payload "Connect" button with a real IBAN + beneficiary-name form; show masked IBAN + `PENDING`/`ACTIVE`/`RESTRICTED`/`DISABLED` status meaningfully (today only `ACTIVE` is ever reachable).
- `tips/[tipId]/components/tip-detail-page-content.tsx` — add a financial breakdown panel: gross amount, processor fee, platform commission, net distributable — none of this exists today; only raw `payment_provider`/`payment_reference` strings are shown.
- **New** "Payouts" page/tab — history of executed `Payout` rows (date, recipient, amount, method, status, provider reference) — there is no such screen today.
- `payments/components/pending-distributions-panel.tsx` — extend to show "eligible for next payout on {date}" vs. "held until {date}" (hold-window awareness), plus a "Pay out now" button wired to the new manual-trigger endpoint.
- `refunds-queue-panel.tsx` — "Mark completed" action now triggers a real Viva refund call server-side; surface the provider's response/failure if the refund call itself fails (today it can only ever succeed, since it's a local status flip).

### Employee (`app/src/app/employee`)

- `components/employee-cash-out-provider.tsx` — replace the empty-payload connect flow with a real personal-IBAN form, with copy distinguishing it from a store's business IBAN.
- **New** payout status/history view — today only a "pending balance" figure exists, with no record of what's been paid out.

### Cross-cutting

- No payment provider SDK needs to be added — Smart Checkout is a plain redirect, not an embedded element, so no `@stripe/*`-equivalent Viva JS package is required client-side.
- `config/api/routes.ts` needs new route constants for all the new/modified endpoints above.

---

## 14. Transaction Ledger and Financial Logging

Satisfied primarily by the new `PaymentTransaction` model (§11), which — per the brief's checklist — stores: internal transaction id (`Tip.id`), store id, `Tip.id` as the "customer tip/payment ID," `viva_order_code`, `viva_transaction_id`, payment status (`PaymentTransactionStatus`), currency, `created_at`/`confirmed_at`, gross amount, `commission_percentage_used`, `commission_amount`, `processor_fee_confirmed_amount`, `net_distributable_amount`. Payment *method* (card/wallet/etc.) is available from Viva's transaction lookup response but isn't currently modeled — add a nullable `payment_method String?` to `PaymentTransaction` if the business wants it surfaced (Viva's transaction object exposes card brand/last4-equivalent fields; confirm exact shape against a live sandbox call before finalizing the column, since the research pass did not exhaustively enumerate every transaction-response field).

Per-employee distribution detail is already fully covered by the existing `TipDistribution` model plus the new `payout_id`/extended `payout_status` (§11) — no separate ledger table is needed there, since `TipDistribution` already carries `employee_id`, `percentage`, `amount`, and now gains `payout_status`, `payout_id` → `Payout.provider_transfer_id`/`executed_at`/`failure_reason`.

**Status vocabulary** — adopting the brief's suggested sets, mapped onto the concrete enums introduced above:
- Payment: `CREATED → PROCESSING → SUCCEEDED/FAILED/CANCELLED`, plus `REFUNDED`/`DISPUTED` as terminal states reached from `SUCCEEDED` (`PaymentTransactionStatus` + `Tip.status`; `DISPUTED` is a new value to add to `Tip.status` once a dispute-handling process exists — see §19 on chargebacks).
- Payout: `PENDING → PROCESSING → COMPLETED/FAILED/RETRYING/CANCELLED` (`PayoutExecutionStatus`).

---

## 15. Error Handling and Edge Cases

| Case | Handling |
|---|---|
| **Failed payment** | Webhook 1798 or verified `statusId != 'F'` → `Tip.status = FAILED`; no distributions created; customer sees a failure state with a retry affordance (new checkout attempt = new `Tip`). |
| **Cancelled payment** | No webhook fires for this per Viva's docs. Detected via the return redirect missing the `t` param, and/or the reconciliation sweep. |
| **Abandoned checkout** | Order expires after `paymentTimeout` with no webhook. Reconciliation job sweeps `Tip`s stuck in `CREATED`/`PROCESSING` past that window, actively checks `GET /api/orders/{orderCode}`, and marks them `CANCELLED`/`EXPIRED`. |
| **Duplicate webhook events** | `WebhookEvent.message_id` unique constraint (§7, §11). |
| **Delayed webhook delivery** | The return-page poll (§6) is the primary fast path for UX; the webhook + reconciliation sweep are the backend source of truth, so a slow/lost webhook never blocks the customer from seeing a correct outcome once the poll or a later reconciliation catches up. |
| **Payment succeeded at Viva but our API/DB failed transiently** | Webhook processing is queued (BullMQ) and retried on transient failure; Viva itself also retries the webhook up to 24 times over 24 hours; the reconciliation sweep is a second, independent safety net that would catch a `Tip` stuck `PROCESSING` even if both of those somehow failed. Because Viva already has the money and the transaction, no data is lost — only the local confirmation is delayed. |
| **API/DB failure mid-processing** | All state transitions (`Tip`/`PaymentTransaction`/`TipDistribution` creation) happen inside a single DB transaction — partial writes are impossible; a failed transaction simply leaves the `Tip` in its prior state for retry. |
| **Refunds** | `RefundsService.update()` must call Viva's real refund endpoint before marking `COMPLETED` locally (§12); same-day vs. previous-day distinction from §2.5 determines which Viva call to use. If distributions were already paid out, flag for manual accountant reconciliation rather than silently absorbing the loss (§10.4). |
| **Chargebacks/disputes** | Not found in Viva's public docs (§19, open question). Interim: a manual `DISPUTED` status + accountant-role review process; the payout hold window (§10.2) is a partial mitigation, not a full solution. |
| **Retrying failed operations** | Payouts: bounded retries with backoff via the queue, tracked through `Payout.retry_of_payout_id` chain. Webhooks: Viva's own 24x hourly retry, backstopped by queue-level retry on our side for transient errors distinct from permanent rejections. |

---

## 16. Security Requirements

- **Credential storage**: Viva client id/secret/API key/merchant id stay out of source control (already the case via `.env*`, currently unpopulated — see §19); for production, move to a proper secrets manager rather than plain env files — a general infra recommendation, not Viva-specific.
- **Webhook verification**: since Viva provides no HMAC (§2.2), authenticity rests on (a) IP allowlisting Viva's published ranges at the reverse-proxy or middleware layer, and (b) **mandatory** server-side re-fetch of the transaction via `GET /checkout/v2/transactions/{id}` before any state change — never trust `EventData` fields alone. This is not optional hardening; it's the only verification mechanism available.
- **Idempotent payment processing**: `WebhookEvent.message_id` unique constraint + queued processing (§7); client-supplied idempotency key on `POST /public/tips` (§12).
- **Idempotent payout processing**: atomic claim via `payout_id IS NULL` guard inside a DB transaction (§10.3) prevents double-claiming; `Payout` rows are never mutated to "unclaim" — a failed payout creates a retry row rather than resetting state in place, preserving a clean audit trail.
- **Preventing duplicate distributions**: `TipDistribution` rows are created exactly once, inside the same DB transaction as the webhook's confirmed-success handling, guarded by the same idempotency check that prevents double-processing that webhook event in the first place.
- **Preventing duplicate payouts**: covered by the atomic claim (above); additionally, before creating a new `Payout`, the batch job should check for an existing non-`FAILED`/`CANCELLED` `Payout` already covering the same distributions.
- **Authorization**: reuse existing guards/RBAC patterns exactly — financial breakdown visibility restricted to OWNER/ACCOUNTANT (per Product Spec §26, `Accountant` already exists as a role for exactly this purpose); manual payout trigger restricted to OWNER; employees can only view their own payout data (mirrors the existing `employees.controller.ts` self-or-store-access pattern).
- **Audit logging**: `WebhookEvent` (raw payload + processing outcome) and `Payout`/`Payout.retry_of_payout_id` chain together provide a full, queryable audit trail of every money-movement attempt; consider a lightweight generic `AuditLog` for admin actions like manually overriding a `PayoutAccount` status, if that capability is kept post-launch (today's mock `PATCH` that lets an Owner freely rewrite payout account status for "testing" must be removed or locked down once real accounts exist — see §18).
- **Sensitive data handling**: do **not** persist the raw IBAN after submission to Viva — store only a masked last-4 representation plus Viva's own `bankAccountId` reference (§11), minimizing PCI/GDPR-relevant data at rest. Card data is never touched by Delitip at all (Smart Checkout is fully hosted by Viva), which is the correct posture and requires no PCI-DSS SAQ beyond the lowest tier.
- **DB transactions**: every multi-row financial write (tip confirmation + distribution freeze; payout claim + `Payout` creation; refund completion + distribution cancellation) must be a single Prisma `$transaction`, matching the pattern already used correctly in `TipsService.createPublicTip()` today.
- **Retry mechanisms**: bounded, backed-off retries for payouts and webhook processing (above); never an unbounded retry loop.
- **Monitoring/error logging**: surface failed webhook processing, failed payouts, and reconciliation-sweep corrections (a `Tip` that had to be force-resolved by the sweep rather than a webhook) to whatever alerting channel the team already uses — not present in the current codebase and worth adding as part of this build, not as an afterthought.

---

## 17. Implementation Plan by Step

**Phase 0 — Foundations**
- Provision real Viva **demo** credentials; populate `VIVA_*` env vars in `.env.local`/`.env.staging` (currently blank/absent — §19).
- Import `VivaModule` into `AppModule`.
- Add `WebhookEvent`, `PaymentTransaction`, `Payout` models + migration (§11).
- Register a BullMQ queue for webhook processing and one for scheduled payouts (infra exists, unused today).

**Phase 1 — Real payment collection**
- Modify `POST /public/tips` to create a Viva order instead of completing instantly.
- Build `GET /public/tips/:id/status`.
- Build the `/webhooks/viva` controller (GET handshake + POST processing), IP allowlist, `GET /checkout/v2/transactions/{id}` re-verification.
- Move `TipDistribution` creation into the webhook confirmation path, fed by the net-distributable calculation (§8).
- Frontend: redirect-based checkout, return page, processing/failure/cancelled states.

**Phase 2 — Real payout accounts**
- Modify `PayoutAccount` creation to call `VivaBankTransfersService` with a real IBAN (§5).
- Frontend: real IBAN forms for store and employee, replacing both empty-payload "Connect" buttons.

**Phase 3 — Payout execution**
- Build `Payout` model usage: eligibility query, atomic claim, scheduled batch job, manual "pay out now" endpoint.
- Wire `Command Bank Transfer Created/Executed` webhooks to `Payout` status.
- Frontend: payout history pages (store + employee), "pay out now" button.

**Phase 4 — Refunds integration**
- Wire `RefundsService.update()` to real Viva refund calls; handle already-paid-out clawback flagging.
- Reconciliation sweep job for abandoned/expired orders (can land as early as Phase 1 in parallel, since it's independent).

**Phase 5 — Optional/future, commercially gated**
- Evaluate Marketplace API (Option A) for Store-level connected accounts, contingent on Viva partner approval (§2.3, §19) — pursue as a separate commercial track; does not block Phases 1–4.

**Phase 6 — Hardening**
- Monitoring/alerting on failed payouts and webhook processing.
- Security review of the webhook endpoint and IBAN handling specifically.
- Load/failure testing of the checkout redirect flow (abandoned tabs, double-taps on "Pay," slow networks).

---

## 18. Files/Modules That Need Changes

| Path | Change type |
|---|---|
| `api/src/app.module.ts` | Modify — import `VivaModule` (and remove/ignore `StripeModule`, see below) |
| `api/src/integrations/viva/**` | Reuse as-is for `VivaCheckoutService`, `VivaTransactionsService`, `VivaBankTransfersService`, `VivaWebhooksService`; **add** a new webhook controller (doesn't exist) |
| `api/src/integrations/stripe/**` | Decision needed — currently domain-mismatched/dead code (booking/credits terminology). Recommend removing or clearly marking as unused/legacy rather than leaving it as ambient confusion, since Viva is the path this plan builds on |
| `api/src/modules/tips/services/tips.service.ts` | Modify — split tip creation from distribution freezing; call Viva order creation |
| `api/src/modules/tips/controllers/*` | Modify/New — new status-polling endpoint |
| `api/src/modules/payout-accounts/**` | Modify — real IBAN linking instead of mock; lock down/remove the free-form status-override `PATCH` once real |
| `api/src/modules/refunds/services/refunds.service.ts` | Modify — call real Viva refund endpoint |
| `api/src/modules/employees/services/employees.service.ts` | Minor modify — extend payout summaries once `payout_status`/`Payout` are real |
| `api/src/shared/utils/mock-payment/mock-payment.utils.ts` | Remove once real flows replace every call site |
| `api/src/shared/utils/distribution/distribution-calculator.util.ts` | **No change** — reused as-is |
| `api/src/modules/distribution-rules/**` | **No change** |
| `api/prisma/schema.prisma` | Modify — new models/enums per §11 |
| `api/src/core/queues/**` | Modify — register real queues/processors (currently empty scaffolding) |
| **New**: `api/src/modules/payouts/**` | New module — `Payout` CRUD, eligibility query, batch job, manual trigger endpoint |
| **New**: webhook reconciliation job | New — scheduled sweep for abandoned/expired orders |
| `app/src/app/[storeSlug]/q/[code]/components/steps/review-step.tsx` | Modify |
| `app/src/app/[storeSlug]/q/[code]/components/steps/done-step.tsx` | Modify |
| **New**: payment return route/page | New |
| `app/src/app/dashboard/payments/components/payout-account-card.tsx` | Modify |
| `app/src/app/dashboard/tips/[tipId]/components/tip-detail-page-content.tsx` | Modify |
| **New**: `app/src/app/dashboard/payouts/**` | New |
| `app/src/app/employee/components/employee-cash-out-provider.tsx` | Modify |
| **New**: employee payout history view | New |
| `app/src/config/api/routes.ts` | Modify — new route constants |

---

## 19. Open Questions or Viva API Limitations

These require direct confirmation from Viva (sales/account manager/support), or a deliberate product/legal decision, before final sign-off — none of them block starting Phases 0–2, but all should be resolved before a production go-live:

1. **PSD2 "intermediary" posture** — Viva's own marketplace documentation states that a platform acting as an intermediary between customers and sellers should use the Marketplace solution for compliance. Delitip's Bank Transfer-based V1 design is structurally an intermediary. Confirm with Viva/legal whether the Bank Transfer API is an acceptable long-term posture or whether Marketplace onboarding becomes a compliance requirement at scale.
2. **Natural-person payee onboarding** — no public Viva documentation confirms whether an individual (non-business) can be onboarded as a Marketplace connected account. This affects only the Phase 5/Option-A future path, not the recommended V1 Bank Transfer approach.
3. **Chargebacks/disputes** — no dedicated webhook or endpoint was found in Viva's public docs. Confirm the actual process (manual notification? a different webhook family not covered by the public spec?) directly with Viva.
4. **Exact fee structure (partially resolved)** — Viva *does* return the real per-transaction processing fee post-settlement via the `Transaction Price Calculated` webhook (1799), so the final ledger (§8, §11) is always built from Viva's own actual figure, not a guess. What's still open: the underlying interchange++ acquiring-fee percentage is negotiated per-merchant and not published anywhere public, so there's no authoritative number to seed `TIP_PROCESSOR_FEE_ESTIMATE_PERCENTAGE` (the short-lived, display-only fallback used in the brief window before the 1799 webhook arrives — §8) or to model unit economics up front. Get the negotiated rate from the Viva account manager/contract and use it purely as that fallback constant's starting value.
5. **Bank Transfer `:send` idempotency** — the public spec doesn't document a client-supplied idempotency/reference parameter for the `:send` call; confirm whether retry-safety must be handled entirely on Delitip's side (as designed in §10.3/§16) or whether Viva offers a dedup key.
6. **IBAN validation turnaround/semantics** — the exact meaning and timing of the `POST /banktransfers/v1/bankaccounts` validation response (instant vs. asynchronous) should be confirmed against a live sandbox call before finalizing the `PENDING`→`ACTIVE` transition logic in §5.
7. **Rate limits** — not documented publicly; relevant for the payout batch job's call volume at scale.
8. **Settlement/hold-period configurability** — Viva's marketplace overview advertises the ability to hold seller funds for a custom period, but no API parameter for this is documented; irrelevant to the recommended Bank Transfer approach (where Delitip enforces its own hold window per §10.2) but relevant if Option A is pursued later.
9. **Per-store checkout branding vs. a single global merchant/source** — today's config (`VIVA_MERCHANT_ID`/`VIVA_SOURCE_CODE`) is global. Confirm whether the business wants per-store branded checkout pages (would require additional Viva payment Sources) or a single unified Delitip-branded checkout is acceptable for V1.
10. **Credentials are currently entirely unpopulated** — `VIVA_CLIENT_ID`/`VIVA_CLIENT_SECRET`/`VIVA_MERCHANT_ID`/`VIVA_API_KEY`/`VIVA_SOURCE_CODE` are blank in both `.env.local` and `.env.staging` today; a real Viva demo account must be provisioned before any of Phase 0 can be tested end-to-end.
