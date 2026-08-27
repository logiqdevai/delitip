# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Customers** — patrons of restaurants, cafés, bars, hotels, salons, and other service businesses. They scan a QR code left at the point of service (table, receipt, menu, hotel room/reception, bar counter, checkout, employee card, promotional material) to thank and tip a specific employee, and optionally rate and review the experience. They never create an account or install an app; the entire loop must complete in seconds, ideally while still at the table.

**Businesses** — owners, managers, accountants, and other staff who use a central dashboard to manage locations, employees, QR codes, tips, reviews, feedback, and analytics. Businesses range from a single-location café (~1 location, ~6 employees, ~20 QR codes) to multi-location hospitality groups (8+ locations, hundreds of employees, hundreds of QR codes).

**Employees** — individual staff members who can optionally see their own performance (tips received, average rating, review count, recognition, recent feedback) when the business grants them access.

## Product Purpose

Delitip lets a customer scan a QR code, recognize a specific employee, leave a digital tip, and optionally rate and review the experience — with no registration or app install. For the business, it turns that same interaction into a dashboard covering tip collection, employee recognition, and customer feedback across locations and staff. Success is a customer act of appreciation completed in seconds, and a business that can see who is creating great experiences and where problems are emerging before they become public complaints.

## Positioning

Delitip is not a QR-code tipping tool. The QR code is only the entry point. The product is the connection between digital tipping, customer feedback, employee recognition, and customer experience analytics in one loop:

QR scan → employee recognition → digital tip → customer rating → written feedback → business analytics → employee recognition & improvement → better customer experience.

A neighboring product that only does QR tipping, or only does review collection, could not truthfully claim this combined loop.

## Operating Context

- QR codes are physically placed at tables, on receipts, menus, hotel rooms, hotel reception, bar counters, café tables, checkout areas, employee cards, and promotional materials.
- Each QR code is independently identifiable and trackable (e.g. "Table 12 generated 14 tips this week"), can optionally be pre-bound to a specific employee so the customer skips employee selection, and can be downloaded/printed by the business.
- Businesses onboard through a 7-step flow: create business profile → add location(s) → add employees → configure tipping → configure reviews/feedback → create QR codes → print/place QR codes.
- Multi-location businesses manage employees, QR codes, tips, reviews, feedback, and analytics per location, or aggregated across all locations.
- Feedback questions are customizable per business/industry (e.g. restaurant: food/service/atmosphere; hotel: room/reception/stay; salon: satisfaction/stylist).

## Capabilities and Constraints

**Customer flow:** scan → branded business page (logo, name, location, short message, team, tip options, review options) → employee selection (or already resolved by a pre-bound QR) → tip amount (business-configured suggested amounts, e.g. €2/€5/€10/€20, plus a custom amount) → optional star rating + written feedback + business-chosen category questions (e.g. friendliness, speed, professionalism) → thank-you confirmation (business-customizable message). No account required at any step; only the information necessary for the chosen action is collected.

**Tip distribution:** individual (entire tip to one employee), team (split among employees per business-configured rules), or general business tip (no employee selected).

**Review vs. private feedback branching:** a high rating can prompt the customer toward the business's preferred public review platform; a low rating instead prompts private feedback so the business can address the issue before it becomes a public review.

**QR code management:** businesses create multiple QR codes per location, each with its own identity and analytics (tips, amounts, review counts attributable to that code).

**Location management:** each location has its own employees, QR codes, tips, reviews, feedback, and analytics; businesses can view combined or filtered-by-location.

**Employee management:** profiles include name, photo, position, location, status, personal QR code, tips received, reviews, average rating, and feedback. An optional employee dashboard surfaces the employee's own tips, average rating, review count, times specifically mentioned, and recent feedback.

**Business dashboard:** a daily snapshot (tips, transactions, reviews, average rating, employees recognized) plus trends (tips over time, reviews over time, average rating, best-performing employees/locations, customer satisfaction, most common feedback).

**Analytics:** tip analytics (totals, counts, averages, per employee/location/day/week/month), filterable by date, location, employee, and QR code. Employee performance analytics is explicitly **not** meant to be positioned as a ranking system — its purpose is identifying who is consistently creating great experiences. Location analytics lets multi-location businesses compare performance. A composite "Customer Experience Score" combines ratings, reviews, feedback, recognition, and tip activity, and must always ship with an explanation of what is driving it, not as an opaque number.

**Review management:** businesses can view, filter, and search reviews by employee, location, or rating. Reviews can be auto-categorized (positive: friendly/fast/professional/atmosphere; negative: slow/waiting/staff availability/food issue).

**AI feedback analysis (optional/advanced):** automatic summarization of feedback trends over time (e.g. satisfaction change, common praise/complaints, standout employees) instead of requiring a manager to read every review individually.

**Alerts:** configurable notifications for positive events (e.g. employee compliments), negative trends (e.g. satisfaction drop at a location), individual reviews (e.g. a low-star review), and performance shifts (e.g. tips up at a location) — business chooses which alerts it wants.

**Branding:** businesses can customize logo, name, cover image, brand colors, welcome message, thank-you message, employee photos, and review questions, so the customer feels they are interacting with the business, not a generic third-party platform.

**Roles/permissions:** Owner (full access), Manager (employees, reviews, analytics), Employee (own tips and feedback), Accountant (financial/payment information).

**Payments and payouts:** every transaction records amount, date, time, employee, location, status, and payout status. Employees can see tips attributed to them and payout availability per the business's payout setup. Managers can look up a transaction, review its status, and handle eligible refunds or escalate to support.

**Subscription plans (feature scope, pricing undecided):**
- *Starter* — basic tipping, QR codes, employees, basic reviews, basic analytics.
- *Professional* — multi-location, advanced analytics, employee performance, custom feedback, review management, alerts.
- *Enterprise* — unlimited locations, advanced reporting, custom branding, multiple management levels, advanced analytics, dedicated support.

**Undecided / explicitly open:** payment processor/provider, exact subscription pricing, and whether the "Future Features" set (loyalty/points, employee bonus rewards, returning-customer profiles, campaigns, digital receipts, reservations integration, staff recognition programs, broader customer-experience CRM) is in scope for the current build phase.

## Brand Commitments

- Confirmed product name for this codebase: **Delitip** (the product specification document at `docs/DelyTip_Product_Specification.md` spells it "DelyTip" — treat that as the same product; "Delitip" is the spelling of record going forward).
- The user has expressed a preference for **lime** as a brand/accent color. No logo, full palette, or typefaces exist yet — the rest of the visual identity is open.

## Evidence on Hand

- `docs/DelyTip_Product_Specification.md` is the authoritative source for product behavior and is reflected throughout this file.
- No real business data, customer testimonials, logos, photography, or other brand assets exist yet. Future design and content work must not fabricate these — synthetic/placeholder content must be clearly labeled as such.

## Product Principles

1. **The customer moment is sacred and must stay frictionless.** No account creation, no app install; scan-to-thank-you should complete in seconds, at the table.
2. **The business's identity, not a third-party platform's.** Every customer-facing surface should read as the business's own experience, not a generic third-party tipping page.
3. **Catch problems privately before they go public.** Low ratings route to private feedback; high ratings route toward public review — the product exists to give the business a chance to fix things first.
4. **Recognition, not ranking.** Employee performance data is meant to identify and celebrate consistently great service, never to shame or punitively rank staff.
5. **Explain the number, don't just report it.** Composite metrics like the Customer Experience Score always ship with what is driving them.
