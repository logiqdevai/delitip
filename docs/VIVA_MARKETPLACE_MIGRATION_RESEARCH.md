# Migrating Delitip Payouts from IBAN Bank Transfer to Viva Marketplace (Connected Accounts)

**Status of this document:** research + refactor proposal, dated 2026-09-01. Written in response to a direct question — should Delitip move from the currently-implemented IBAN Bank Transfer payout model (see `PAYMENT_SYSTEM_IMPLEMENTATION_PLAN.md`) to Viva's Marketplace API (connected accounts), for stronger PSD2 compliance. Sourced from Viva's current public developer docs (`developer.viva.com`) and, where full page fetches timed out, from Viva's own search-indexed doc excerpts (Google/Bing snippets) — flagged inline wherever a claim rests on a snippet rather than a full page read. **No code has been changed as part of this document** — this is research only, per the request.

---

## 1. Executive summary

**Recommendation: plan for Marketplace as a Phase 5 migration, but don't start engineering work on it until Delitip has (a) contacted Viva's sales team and confirmed commercial access, and (b) run one real store and one real employee through the actual hosted onboarding flow in the sandbox.** The technical picture is much better than the original audit could confirm — the SDK wrapper for this is already fully built and unused in this codebase (`api/src/integrations/viva/services/viva-marketplace.service.ts`), and Viva's docs now explicitly state KYC/KYB is available for **both businesses and individuals**, which directly answers the original audit's open question about whether employees (natural persons) can be onboarded. But two real costs remain that a pure "more compliant" framing undersells:

1. **Commercial gate is still real.** Marketplace access requires a Sales conversation and Viva provisioning a "platform account" for Delitip — this cannot be self-served, in sandbox or production, and has no defined timeline in the public docs.
2. **Onboarding UX cost shifts from us to the payee.** IBAN linking today asks a store owner or employee for two text fields (IBAN, name) — nothing else. Marketplace onboarding sends every store *and every employee* through Viva's own hosted KYC flow (identity verification, address, etc.) before they can receive a single payout. For a tipping app where many employees are casual/part-time staff, this is a materially heavier ask, and some fraction will likely not complete it — that's a product/business trade-off, not just an engineering one.

The rest of this document details the mechanics, what's reusable, and a concrete phased refactor plan, so that decision can be made with full information.

---

## 2. Why this matters: the PSD2 angle, reconfirmed

Viva's own current documentation states this plainly and unconditionally (not hedged, unlike the "confirm with Viva/legal" framing the original audit had to use):

> "If you act as an 'intermediary' for customers and sellers without yourself selling the products or services and customer payments are being routed between multiple parties, you need to use Viva's marketplace solution in order to comply with PSD2." — [PSD2 Compliance | Viva.com Developer Portal](https://developer.viva.com/about-viva/psd2-compliance/) (via search excerpt)

> "Viva Wallet's PSD2-compliant payment solution for online marketplaces removes the requirement for them to become licensed providers of regulated payment services." — [Marketplace Payment Platform](https://www.viva.com/en-eu/product/marketplaces)

Delitip is structurally exactly this: it collects a customer payment and routes it to third parties (stores, employees) it doesn't itself own. The original audit (§19 item 1) flagged this as an open compliance question requiring direct legal/Viva confirmation before scaling. This research doesn't resolve the legal question (that still needs Delitip's own counsel + a direct conversation with Viva), but it does confirm Viva's own positioning is unambiguous: **ad-hoc IBAN transfers from a platform account, at any real scale, are the posture Viva itself says requires the Marketplace solution instead.** This is the actual argument for doing this migration, independent of any other technical convenience.

---

## 3. What's already built and reusable — the good news

`api/src/integrations/viva/services/viva-marketplace.service.ts` and `api/src/integrations/viva/interfaces/viva-marketplace.interface.ts` already exist, fully implemented, and were **cross-checked against live web research in this pass — they match Viva's actual current API surface.** No new Viva SDK integration code is needed; only wiring it into application modules (same pattern as `VivaBankTransfersService` was wired in for the IBAN build).

Existing methods:

| Method | Endpoint | Purpose |
|---|---|---|
| `createConnectedAccount(payload)` | `POST /platforms/v1/accounts` | Invite a seller (store or employee) to onboard. Returns `{ accountId, invitation: { url, expirationDate } }`. |
| `getConnectedAccount(accountId)` | `GET /platforms/v1/accounts/{id}` | Poll status — `verified`, `acquiringEnabled`, `payouts`. |
| `updateConnectedAccount(accountId, payload)` | `PATCH /platforms/v1/accounts/{id}` | Update the account's payout config (auto-forward to a 3rd-party IBAN, or leave empty for manual handling). |
| `createTransfer(payload)` | `POST /platforms/v1/transfers` | Move funds from the platform's balance to a connected account, tied to a specific settled customer payment (`transactionId`) for reconciliation. |
| `reverseTransfer(transferId, payload)` | `POST /platforms/v1/transfers/{id}:reverse` | Claw back a transfer (partial or full) — the thing IBAN transfers structurally cannot do. |
| `createMarketplaceOrder(payload)` | `POST /checkout/v2/orders` (with a `transfer` object) | Same Smart Checkout order-creation call already used today, with an optional `transfer: { amount, connectedAccountId }` for auto-split at settlement. |
| `cancelTransaction(transactionId, query)` | `DELETE /acquiring/v1/transactions/{id}` | Marketplace-aware refund, with `reverseTransfers`/`refundPlatformFee` flags — automatically claws back the seller-side transfer and/or the platform's commission on refund. |

This directly resolves the two messiest parts of the current IBAN implementation:
- **`RefundsService`'s `requires_manual_reconciliation` flag** (needed today because IBAN transfers have no automatic clawback) becomes largely unnecessary — `reverseTransfers`/`refundPlatformFee` do this automatically, synchronously, as part of the refund call itself.
- **The `PayoutAccountStatus.PENDING → ACTIVE` promotion logic**, which today has to guess at Viva's IBAN-validation timing (`payment plan §19 item 6`, still unconfirmed), becomes an explicit `verified: boolean` field returned by `getConnectedAccount()` — no guessing, and there's a webhook for it (`Account Verification Status Changed`, EventTypeId 8194, already enumerated in the original audit's §2.2).

### Request shape detail worth noting

`CreateConnectedAccountRequest` (`api/src/integrations/viva/interfaces/viva-marketplace.interface.ts:24-37`) has **no `individual` vs `business` type field** — it's `{ email, mobile?, legalName?, tradeName?, taxNumber?, returnUrl, address?, branding, payouts? }`, all the business-shaped fields optional. This matches what search results describe: Delitip's API call is just an *invitation* (who to invite, what URL to send them back to, what branding to show); the actual KYC/KYB — including whatever distinguishes an individual filer from a registered business — happens entirely inside Viva's own hosted onboarding UI at the returned `invitation.url`. **This is good news for the individual-employee question**: nothing about our own API call forces a business shape onto an employee invitation.

---

## 4. What's confirmed vs. still open

### Confirmed (via live search against Viva's current docs, cross-checked against the existing SDK wrapper)

- **Individuals can be onboarded**, not just businesses: *"Viva.com conducts KYC and AML checks for businesses and individuals based on each country's local framework... Onboarding is handled by Viva via a digital process adjusted to local regulations... with no further action or input required by the ISV Partner."* This directly reverses the original audit's §2.3 "unverified/likely no" verdict for employee-level Marketplace onboarding.
- **A seller cannot receive payouts until fully onboarded/verified** — matches the `PENDING`-until-`ACTIVE` lifecycle already built for `PayoutAccount`, so the existing state machine concept carries over cleanly, just fed by a different verification signal (`verified: true` / webhook 8194 instead of an IBAN-validation guess).
- **Transfers are tied to a specific settled payment** (`transactionId` on `createTransfer`) and are described as executed "when the payment is settled" — this maps *very* naturally onto the architecture already built: Delitip already waits for the `1796`/`1799` webhooks before computing `net_distributable_amount` and freezing `TipDistribution` rows. Marketplace transfers would slot into that exact same "wait for settlement, then act" point in `PaymentWebhooksService`, not require a new timing model.
- **Refund clawback is automatic** via `reverseTransfers`/`refundPlatformFee` on the marketplace cancel-transaction call, confirmed by both the SDK wrapper's existing typed interface and search results describing the same two flags.
- **The commercial gate is real and unavoidable**: *"you should sign up for a Viva account, then provide your account details to Viva via your Sales representative or Live Chat. Viva will create your platform account and provide you with relevant credentials."* No self-service path exists, in sandbox or production. This matches the original audit's "Blocking issue #1" finding — nothing has changed here.
- **Fee framing**: *"With a Viva Wallet Business Account, sellers will be able to accept their funds and the marketplace owner will not be charged a transfer fee."* The phrasing implies the fee-free path assumes the seller holds an actual **Viva Wallet Business Account** — i.e., full Viva onboarding, not just "linked a bank account." Exact pricing for other configurations was not published in the pages found; needs a direct question to Viva Sales alongside the access request.

### Still open — needs direct Viva confirmation before committing engineering effort

1. **Exact individual-onboarding UX and any restrictions** (minimum age, country coverage, document requirements) — the general "KYC for businesses and individuals" claim is Viva's own marketing/support copy, not a field-by-field spec. Needs a real test invitation sent to a real (or clearly-marked sandbox test) individual in the actual sandbox to see the flow employees would go through.
2. **Whether a connected account requires the seller to hold an actual Viva Wallet** (with everything that implies — their own login, their own dashboard) **or can just auto-forward to a 3rd-party IBAN with a lighter touch.** The `payouts: { iban?, bankAccountId? }` field on `CreateConnectedAccountRequest`/`ConnectedAccount` suggests the latter is possible ("used for sellers that wish to automatically receive their payouts to a 3rd-party bank account" — i.e., a connected account *can* be configured to just forward to a bank account, without the seller actively using a Viva wallet day-to-day), which would meaningfully soften the UX cost flagged in §1 — but this needs to be confirmed against a real sandbox onboarding flow, not assumed from a one-line interface comment.
3. **Onboarding turnaround time** — no published SLA for how long a connected account takes to move from invited to verified.
4. **Whether Delitip's current tipping/no-purchase-of-goods business model is what Viva's Marketplace product is actually designed and priced for** — Marketplace framing throughout Viva's docs is "sellers of goods," and Delitip's stores/employees aren't selling goods, they're receiving gratuities. This is worth raising explicitly with the Sales conversation — it may be a non-issue, or it may affect approval/pricing.
5. **Full request/response schema of `createConnectedAccount`/`getConnectedAccount`** beyond what the existing interface file documents — page fetches to the tutorial itself (`developer.viva.com/tutorials/marketplace/create-a-connected-account/`) timed out in this research pass and were not independently re-verified beyond what the pre-existing SDK wrapper already encodes (which was, however, cross-checked as accurate against multiple independent search results, so it's a reasonable non-final basis to build from).

---

## 5. Refactor plan (for when access is confirmed)

Structured so it can proceed **store-first**, since stores are unambiguously business entities and the least uncertain part of this migration; employee-level connected accounts should follow only after item 4.1 above is confirmed against a real sandbox test.

### 5.1 Database schema

Extend, don't replace — `PayoutAccount.payout_method` already has `CONNECTED_ACCOUNT` as an enum value (added during the IBAN build specifically to leave this door open, per the original plan's §5 framing). Additive changes:

```prisma
model PayoutAccount {
  // existing IBAN fields (bank_account_id, iban_last4, beneficiary_name) stay —
  // an account is either IBAN or CONNECTED_ACCOUNT, keyed by payout_method
  connected_account_id     String?   // Viva's accountId from createConnectedAccount
  connected_account_verified Boolean @default(false)  // mirrors `verified` from getConnectedAccount / webhook 8194
  onboarding_url            String?  // the invitation.url, shown to the payee until they complete onboarding
  onboarding_url_expires_at DateTime?
}
```

```prisma
model Payout {
  // existing fields (provider_transfer_id etc.) already generic enough to reuse —
  // provider_transfer_id holds either a bank-transfer commandId or a marketplace transferId
  // no new fields strictly required; recipient/payout_method is inferred via the
  // PayoutAccount.payout_method the Payout's payout_account_id points to
}
```

```prisma
model Refund {
  // requires_manual_reconciliation stays as a column (harmless if unused),
  // but the refund flow for CONNECTED_ACCOUNT-method tips sets it to false
  // automatically, since reverseTransfers/refundPlatformFee handle it inline
}
```

### 5.2 Backend module changes

- **`payout-accounts` module**: `createForStore`/`createForUser` branch on a new `payout_method` in the request (or a store/organization-level feature flag deciding which method is offered) — for `CONNECTED_ACCOUNT`, call `VivaMarketplaceService.createConnectedAccount({ email, returnUrl, branding, legalName? })` instead of `VivaBankTransfersService.linkBankAccount`, store `connected_account_id`/`onboarding_url`, leave `status = PENDING`. A new webhook handler branch for `Account Connected`/`Account Verification Status Changed` (8193/8194) promotes to `ACTIVE` — replacing the current opportunistic `getBankAccount().isArchived` proxy-check entirely with the real signal.
- **`tips` module**: `createPublicTip` — if the store's own `PayoutAccount.payout_method === CONNECTED_ACCOUNT`, use `VivaMarketplaceService.createMarketplaceOrder` (adds the optional `transfer` object) instead of `VivaCheckoutService.createOrder`. **Recommend leaving the `transfer` object unset even for marketplace orders** and continuing to compute+execute transfers explicitly after settlement (§5.3 below) rather than relying on Viva's auto-transfer-on-settlement — this preserves the existing, already-tested "wait for confirmed net amount, then split" invariant (§8/§9 of the original plan) instead of introducing a second, Viva-driven split path to reconcile against.
- **`payments` module (webhooks)**: add handling for `8193`/`8194` (account connected/verified) and `8448` (Transfer Created) alongside the existing `768`/`769` bank-transfer events — same dispatch pattern, new `EventTypeId` cases in `PaymentWebhooksService`.
- **`payouts` module**: `PayoutsService.executeTransfer` branches on the claimed `PayoutAccount.payout_method` — `CONNECTED_ACCOUNT` calls `VivaMarketplaceService.createTransfer({ amount, connectedAccountId, transactionId })` instead of the bank-transfer fee-quote+`:send` pair. Simpler than the IBAN path (no separate fee-quote step).
- **`refunds` module**: for a tip whose store/employee used `CONNECTED_ACCOUNT`, call `VivaMarketplaceService.cancelTransaction(transactionId, { reverseTransfers: true, refundPlatformFee: <business decision> })` instead of `createFastRefund`/`createRebate`, and skip the `requires_manual_reconciliation` flagging path entirely — the automatic reversal makes it moot.

### 5.3 Split-timing decision (explicit recommendation)

Do **not** use the `transfer` object at order-creation time. Continue computing `net_distributable_amount` only after the processor fee is confirmed (`1799` webhook) and creating `TipDistribution` rows at that point, exactly as today — then, on a manual "Pay out now" run (or later, a scheduled one), execute one `createTransfer` per eligible recipient instead of one bank transfer. This keeps the already-built and already-tested distribution-freeze logic, RBAC, and atomic-claim mechanism (§10 of the original plan) completely unchanged — only the last-mile execution call swaps out. This is the single biggest reason this migration is lower-risk than it might first appear: **the hard part (correct split calculation, idempotency, atomic claiming, hold windows) was already built for a provider-agnostic shape and doesn't need to be touched.**

### 5.4 Frontend changes

- Replace the `IbanPayoutAccountDialog` form (for whichever payout method is being offered) with a simple "Connect with Viva" button that calls the create-connected-account endpoint and redirects (or opens) to the returned `invitation.url` — Viva's own hosted flow handles everything past that point, so this is *less* frontend work than the IBAN form, not more.
- `pending-distributions-panel.tsx` / payout account status displays: swap `iban_last4` display for a simple "Connected to Viva" indicator once verified; `PayoutAccountStatus` badge logic (`PENDING`/`ACTIVE`/`RESTRICTED`/`DISABLED`) is unchanged.
- New: a return page for the onboarding redirect (`returnUrl`), conceptually identical in shape to the existing `/checkout/return` page — lands the store owner or employee back in the dashboard/employee app after completing Viva's hosted onboarding.

### 5.5 Migration / coexistence strategy

Because `PayoutAccount.payout_method` already exists as a discriminator, **this does not need to be a hard cutover.** Recommended approach:
1. Ship Marketplace support as an *additional* option, store-level first (organizations opt in per store, or Delitip enables it centrally once approved).
2. New payout accounts default to `CONNECTED_ACCOUNT` once available; existing IBAN-linked accounts keep working unchanged (`PayoutsService`'s branch-on-`payout_method` handles both indefinitely — no forced migration of already-linked IBANs required).
3. Decide employee-level rollout only after the individual-onboarding sandbox test (§4 item 1) confirms the UX is acceptable for casual/part-time staff; if it isn't, employees can permanently stay on the IBAN path (already fully built and working) while stores move to Marketplace — a legitimate, permanent hybrid, not just a transitional one, since PSD2's intermediary concern is arguably most acute at the store level (registered business ↔ platform) rather than the platform ↔ individual-employee leg.

---

## 6. Recommended next step

This is a business/legal decision more than an engineering one at this point: **contact Viva's sales team (or Live Chat) to request Marketplace/platform-account access for the sandbox**, explicitly mentioning (a) the tipping/gratuity business model (not goods-selling, per open question §4.4) and (b) the need to onboard individual employees, not just registered store businesses, and ask directly about the KYC UX/turnaround for that case. Once a platform account and test credentials exist, the very first useful engineering step is a **single manual end-to-end sandbox test** — invite one test store and one test individual through `createConnectedAccount`, walk the actual `invitation.url` flow, and see exactly what it asks for — before writing any application code. That one test resolves nearly every "still open" item in §4 at once, far more reliably than further doc research can.
