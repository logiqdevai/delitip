# Invoice-gated payout requests

_Added 2026-10-16. Complements `PAYMENT_SYSTEM_IMPLEMENTATION_PLAN.md` §10 (Payout Architecture)._

## Why

For Greek tax compliance a Store must invoice Delitip for the tips it is paid.
Until this feature, an OWNER pressed **Pay out now** and `PayoutsService.run()`
moved money immediately, with nothing invoiced. Now, when the platform-wide
switch `AppConfig.payout_invoice_required` is on, the Store's own money can
only leave through an admin-reviewed **payout request** backed by an uploaded
invoice. Approval executes the Viva transfer.

## What is gated

Only the `'STORE'` recipient group of `loadEligibleGroups`: STORE-type shares plus
EMPLOYEE shares with `payout_mode = VIA_STORE` (pooled money the Store hands to
staff off-platform). DIRECT employee shares are individuals' money, no invoice
covers them, and they keep flowing through the self-service run — the Store row
is simply reported with skip reason `INVOICE_REQUIRED` and the button reads
**Pay out staff**.

## Flow

```
Store (OWNER)                     API                                  Admin
─────────────                     ───                                  ─────
GET  …/payout-requests/preview ─► exact amount, period, "invoice to"
issue invoice for that TOTAL
POST /documents (PDF/JPG/PNG)
POST …/payout-requests ─────────► snapshot + LOCK distributions
                                  (TipDistribution.payout_request_id)
                                  setImmediate:
                                    AI read (gpt-4o-mini) → verdict
                                    email admins ──────────────────────► review page
                                                                         approve ──► claimGroup(request) + Viva transfer
                                                                         reject  ──► release rows, note
Alert + email to owners ◄─────────────────────────────────────────────── either way
```

### Locking

`TipDistribution.payout_request_id` is set inside the submit transaction with
`updateMany(... where payout_id null AND payout_request_id null AND PENDING)`.
Every other payout path excludes locked rows unconditionally:

- `eligibleDistributionsWhere()` (`modules/payouts/utils/payout-groups.utils.ts`)
  — the single definition of "payable now", shared by `run()` and submission.
- `DistributionRulesService.pendingDistributionsFilter` — a payout-mode switch
  cannot re-route a locked row.
- `summarizePendingDistributions` reports locked money as `requested_total_amount`
  and `resolveEligibility` returns `hold_reason: 'PAYOUT_REQUESTED'`.

Turning the switch OFF does not unlock open requests; they stay reviewable.

### Statuses

`PayoutRequestStatus`: `PENDING_REVIEW → APPROVED | REJECTED | CANCELLED`.
There is deliberately no `PAID`/`FAILED`:

- **Paid** is derived from `payout.status === COMPLETED` (webhook-owned).
- A failed Viva transfer leaves the request `PENDING_REVIEW` with
  `failure_reason`; the rows are still locked, so the admin simply approves
  again. The late-failure webhook (`handleBankTransferExecuted`) reverts an
  `APPROVED` request the same way.
- One open request per Store, enforced by a pre-check plus the lock count
  inside the transaction (no partial unique index — Prisma can't model it).

### Refunds after submission

`RefundsService` still cancels PENDING rows. The admin detail computes a live
`integrity` block (`locked_count`, `stale_count`, `live_amount`, `is_stale`);
approval returns 409 while stale. Since the invoice amount before VAT must equal the
amount, partial approval is never valid — the admin rejects with a note and
the Store re-requests the corrected figure.

## Invoice amount and VAT

The payout amount is what the Store invoices **before VAT**; the Store adds its own VAT on top. The automatic check therefore compares `net_amount` (or total − VAT when only those are readable) to the request amount, and separately checks net + VAT = total.

## Automatic invoice check

`InvoiceVerificationService` downloads the invoice from GCS, calls
`AiService.generateObjectFromFile()` (Vercel AI SDK `generateObject`, PDF as a
`file` part, JPEG/PNG as an `image` part; model `INVOICE_EXTRACTION_MODEL` (a constant in `invoice-extraction.schema.ts`),
`gpt-4o-mini`) with `InvoiceExtractionSchema`, and runs the pure
`verifyInvoice()` comparison. The result is advisory only.

| Issue code | Hard? | Meaning |
| --- | --- | --- |
| `NOT_AN_INVOICE` | → UNREADABLE | Not an invoice |
| `NET_MISSING` | → UNREADABLE | No amount before VAT read (falls back to total − VAT) |
| `NET_MISMATCH` | yes | Amount before VAT ≠ request amount (exact cents) |
| `NET_ROUNDING` | no | ±1 cent on a photo/scan |
| `CURRENCY_MISMATCH` | yes | |
| `ISSUER_VAT_MISMATCH` | yes | vs `Organization.vat_number` (EL/GR prefix, spaces, dots ignored) |
| `ISSUER_VAT_MISSING` / `ORG_VAT_MISSING` | no | Can't compare |
| `RECIPIENT_VAT_MISMATCH` | yes | vs `AppConfig.platform_vat_number` (only when set) |
| `INVOICE_NUMBER_MISMATCH` | no | vs the number the Store typed |
| `DATE_SUSPICIOUS` | no | Before `period_to − 1d` or after now + 1d |
| `NET_PLUS_VAT_MISMATCH` | no | |

Verdict: `MATCH` (no hard issues) / `MISMATCH` / `UNREADABLE`. `check_status`
is `SKIPPED` when `payout_invoice_ai_check_enabled` is off or no
`OPENAI_API_KEY` is configured, `FAILED` on exceptions (admin can re-run).

## AppConfig fields

`payout_invoice_required`, `payout_invoice_ai_check_enabled`,
`platform_legal_name`, `platform_vat_number`, `platform_tax_office`,
`platform_address`, `payout_invoice_instructions`. Any signed-in user can
read the gate and the invoice details via `GET /app-config/payout-policy`.

## Endpoints

Store (`JwtGuard` + `assertStoreAccess`):
`GET stores/:storeId/payout-requests/preview`, `POST stores/:storeId/payout-requests`
(OWNER), `GET …`, `GET …/:id`, `GET …/:id/invoice-url` (signed GCS URL — the
bucket is private), `POST …/:id/cancel` (OWNER).

Admin (`ADMIN`/`SUPER_ADMIN`): `GET admin/payout-requests`, `GET …/pending-count`,
`GET …/:id`, `GET …/:id/invoice-url`, `POST …/:id/approve`, `POST …/:id/reject`,
`POST …/:id/recheck`.

## Notifications

- Admins: `payout-request-submitted.hbs` after the AI check (recipients = users
  with role ADMIN/SUPER_ADMIN, fallback `EmailConfig.email_addresses.contact`).
- Store owners: `Alert` of type `PAYOUT_REQUEST_APPROVED` / `_REJECTED` plus
  `payout-request-approved.hbs` / `payout-request-rejected.hbs`.

## Frontend

- Tips → Payments: **Request payout** (3-step dialog: what you'll be paid →
  invoice details + upload → what happens next), **Pay out staff**, an
  "Under review" figure and an open-request banner with Cancel.
- Tips → Payouts: **Payout requests** table above the payout history.
- Admin → Payments & Payouts: **Payout requests** tab with a pending badge;
  `/dashboard/admin/payout-requests/[id]` shows the invoice, an
  expected-vs-found checks table, the locked tips, integrity warnings and
  **Approve & pay** / **Reject**.
- Admin → App Config: "Payout invoices" card with the switches and details.
