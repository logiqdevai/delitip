# Customer Tipping Flow

## Feature Overview

Mobile-first guest journey: scan QR → branded Store page → employee selection (mode-dependent) → tip amount → pay → thank-you → optional review/feedback → optional public review redirect. Spec §2–4, §6–7, §22, §29–30.

**Roles:** Guest / Customer (no login required)  
**Prisma:** `Store`, `QrCode`, `QrCodeEmployee`, `Employee`, `DistributionRule`, `Tip`, `TipDistribution`, `Review`, `ReviewCategory`, `FeedbackQuestion`, `FeedbackResponse`  
**Dependencies:** QR setup, Store branding, Payments provider, Localization, Privacy copy  
**Status:** **Partial** — entry route live; selection → pay → review still Missing; prototype at `/client`

---

## Hierarchy

```text
Customer Tip Flow
├── Entry: /{storeSlug}/q/{code}            [exists — branded landing + employees]
├── Prototype: /client                      [existing demo]
│   └── Steps (local state, not routes)
│       ├── Tip amount
│       ├── Feedback
│       └── Success
└── Desired wizard steps
    ├── Store branded landing + employees
    ├── Tip amount
    ├── Payment
    ├── Thank-you
    └── Review / feedback (± public redirect)
```

These are **flow steps**, not sidebar pages. Optional deep links per step are **unclear**.

---

## Pages / Screens

### Live Tip Entry (desired)

**Route:** `/{storeSlug}/q/{code}` (from Prisma comment on `QrCode`)  
**Add to `Routes`:** `Routes.tip(storeSlug, code)` — implemented  
**Purpose:** Full customer journey for a specific QR  
**Access:** Public  
**Parent:** None (standalone mobile surface)  
**Entry:** Camera scan / printed QR / employee tip link  
**Implementation status:** Entry landing shipped (`app/[storeSlug]/q/[code]`); selection / amount / pay / thank-you / review still open 

**Main sections:**  
1. Store chrome (logo, name, address, welcome message)  
2. Employee selection (see modes)  
3. Tip amount (presets + custom if allowed)  
4. Payment  
5. Thank-you (custom message, amount, recipient)  
6. Review / feedback  

**Data displayed:** Store branding; employees assigned to QR (photo, name, position); `suggested_tip_amounts`; currency  
**Primary actions:** Select employee(s), choose amount, Pay, Submit review, Skip review  
**Secondary:** Language switcher; privacy disclosures  
**Empty:** QR inactive / Store inactive → error state  
**Loading:** Skeleton matching mobile layout  
**Error:** Invalid code, payment failed, network  

**Permission:** None (public). Distribution rule **must not** change customer UX (spec §5).

### Client Prototype (existing)

**Route:** `Routes.client.root` → `/client`  
**Purpose:** Side-by-side demo of customer flow + fake business view  
**Access:** Public (marketing demo)  
**Do not** treat as production tip URL. Replace consumer path with live QR route.

**Existing steps:** Tip presets $3/$5/$8 + custom → Feedback (stars, tags, note, Apple Pay/Card) → Success receipt → “Make another tip”

---

## Employee selection modes

Driven by `QrCode` employee assignments + `QrCodeSelectionMode`:

| Situation | UI | Schema |
| --- | --- | --- |
| 0 employees | Skip selection; tip to Store | No `QrCodeEmployee` rows |
| 1 employee | Auto “Thank {name}” — no picker | One join row |
| Many + `CHOOSE_ONE` | Single-select list (default) | Enum |
| Many + `CHOOSE_MANY` | Multi-select checkboxes | Enum; split renormalized among selected |
| Many + `TEAM` | Show names, no choice | Enum |

---

## Tip amount

**Config:** `Store.suggested_tip_amounts` (Int[] minor units), `Store.allow_custom_tip_amount`, `Store.currency`  
**Actions:** Select preset or enter custom → continue to payment  
**Validation:** Amount &gt; 0; respect allow_custom flag  

---

## Payment

**Providers in schema:** `PaymentProvider` = `VIVA` | `STRIPE` | `PAYPAL`  
**Unclear:** Exact checkout UI, wallets, fees, receipt fields  
**On success:** Create `Tip` (`status` → `COMPLETED`), freeze `TipDistribution` rows  
**On failure:** `TipStatus.FAILED`; allow retry  

---

## Thank-you

**Content:** Amount, recipient label, `Store.thank_you_message` (i18n Json)  
**Next:** Continue to review or done  

---

## Review / feedback branch (spec §7)

| Condition | Behavior |
| --- | --- |
| Rating ≥ `Store.public_review_rating_threshold` | Encourage public review; optional redirect to `public_review_redirect_url`; set `redirected_to_public_platform` |
| Rating below threshold | Encourage private feedback (`ReviewVisibility.PRIVATE`) |

**Unclear:** Exact threshold default; copy; whether redirect is automatic or button.

**Review fields:** `rating`, `comment`, optional category ratings, feedback responses, tags  
**Customer identity optional:** `customer_email` / `customer_name` / `customer_user_id` — disclose email linking (spec §29)

---

## Privacy disclosures (required copy — §29)

Communicate:

- What they are paying  
- Who receives the tip  
- What data is collected  
- Public vs private review  
- Email linking to Account if provided  
- Language / possible machine translation  

---

## Modals

None required for happy path. Optional:

### Payment failed dialog

**Trigger:** Provider error  
**Actions:** Retry, Cancel  

### Leave flow confirm

**Unclear** whether needed mid-payment  

---

## Data model

```text
QrCode → Store, Employees, optional DistributionRule
Tip → Store, QrCode, optional Employee, optional Customer User
Tip 1─* TipDistribution (frozen %)
Tip 1─0..1 Review
Review → CategoryRatings, TagAssignments, FeedbackResponses
```

**Do not invent** tip rows without `qr_code_id` (required in schema).

---

## User flows

```text
Scan QR
  → Load Store + QrCode
  → Inactive? → Error
  → Employee step (mode)
  → Amount
  → Pay
      → Fail → Retry
      → Success → Tip COMPLETED + TipDistributions
  → Thank-you
  → Review?
      → Skip → End
      → Rate high → Public prompt → optional redirect
      → Rate low → Private feedback form → Submit Review
```

**Guest with email later registers:** Claims Customer Account history ([customer-account.md](./customer-account.md)).

---

## Implementation notes

- Feature: `features/tips/` + `features/reviews/` for mutations.  
- UI under `app/` route segment for QR (suggested `app/[storeSlug]/q/[code]/`).  
- Compliment/tag labels → `config/constants/dropdowns/` (client currently hardcodes `ClientComplimentTags`).  
- Format money from Int minor units + `Currency` enum.  
- Language: resolve Json message maps with `Store.primary_language` fallback ([localization.md](./localization.md)).
