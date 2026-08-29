# Customer Account

## Feature Overview

Optional registered Customer view of tip and review history after tipping with an email that later claims Accounts. Spec §11, §29.

**Roles:** Registered Customer  
**Prisma:** `User` + `Tip`/`Review` where `customer_user_id` or matching email claimed  
**Dependencies:** Auth register, Customer tip flow  
**Status:** **Missing**

---

## Hierarchy

```text
Customer Account
├── Register / Sign in (shared auth — unclear dedicated customer mode)
├── History (/me or /customer)                  [missing — suggested]
│   ├── Tips list
│   └── Reviews list
└── Account switcher entry “Customer”           [missing]
```

---

## Pages

### Customer History

**Route (suggested):** `/me` or `/customer` — product decision required before adding to `Routes`  
**Purpose:** Show past tips and reviews for the claimed Customer Account  
**Access:** Authenticated User with customer activity  

**Sections:** Tips (amount, store, date, status); Reviews (rating, comment, store)  
**Actions:** Open tip/review detail (read-only)  
**Empty:** “No history yet” — CTA explanation  
**Privacy:** Only after registration; unclaimed email history inaccessible (spec)

**Unclear (do not invent without decision):**  
- Export data  
- Delete account / GDPR erasure UI  
- Edit profile beyond User fields  
- Tip again deep link  

---

## Auth notes

Spec allows Customer Accounts to exist unclaimed until register. Sign-up today is Business-oriented — **unclear** whether a lightweight customer register exists separately or the same `/auth/sign-up` with different path.

Account switcher shows Customer view when applicable ([navigation.md](./navigation.md)).

---

## Data model

```text
User ← Tip.customer_user_id
User ← Review.customer_user_id
Optional denormalized customer_email / customer_name on Tip/Review
```

---

## User flows

```text
Guest tips with email
  → Unclaimed Customer Account accumulates
Later registers with same email
  → Claims Accounts → History page shows past tips/reviews
```

---

## Open questions

1. Exact route and nav entry for Customer history?  
2. Passwordless magic link vs password for customers?  
3. Data deletion / privacy center screens?
