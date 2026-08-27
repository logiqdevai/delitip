# DelyTip — Product Specification

## 1. Product Overview

**DelyTip** is a digital tipping and customer feedback platform designed primarily for restaurants, cafés, bars, hotels, salons, and other service-based businesses.

The core idea is simple:

**A customer scans a QR code → chooses the employee they want to thank → leaves a tip → optionally rates their experience and writes a review.**

The platform gives businesses a simple way to collect digital tips while also turning customer feedback into useful information about their service and employees.

DelyTip should feel extremely simple for customers. There should be no complicated registration process or app installation required.

For businesses, DelyTip provides a central dashboard where they can manage Stores, employees, QR codes, tips, reviews, customer feedback, and performance.

---

# 2. The Customer Experience

The customer is the most important part of the product.

The entire experience should take only a few seconds.

### Step 1 — Scan the QR code

The Store places a DelyTip QR code on locations such as:

- Restaurant tables
- Receipts
- Menus
- Hotel rooms
- Hotel reception
- Bar counters
- Café tables
- Checkout areas
- Employee cards
- Promotional materials

The customer scans the QR code using their phone camera.

No application download should be required.

### Step 2 — Store page

The customer is shown a branded page for the Store.

For example:

> **Thank you for visiting Bella Restaurant**
>
> Did someone make your experience special today?

The page can show:

- Store logo
- Store name
- Address
- Short message
- Employee/team members
- Tip options
- Review options

The Store should be able to customize this page.

---

# 3. Employee Selection

A key feature of DelyTip is allowing customers to recognize a specific employee.

Which employees appear, and whether the customer gets to choose, follows directly from how the QR code was set up (§9).

### Choosing among several

When a QR code is assigned multiple employees in **Choose one** mode — the default — the customer picks:

> **Who would you like to thank?**
>
> Maria — Waitress  
> Nikos — Waiter  
> Elena — Bartender  
> George — Host

The tip goes to whichever employee they select, per the rule (§5).

### One employee, no choice needed

A QR code assigned exactly one employee — for example, one placed on that employee's table card — shows that employee automatically:

> **Thank Maria**

This removes the need for the customer to select anyone.

### A fixed team, no choice needed

A QR code assigned multiple employees in **Team** mode shows all of them with no selection step, since the tip is always split between them per the rule (§5):

> **Thank Maria & Nikos**

### No employee at all

A QR code assigned zero employees skips this step entirely — the tip goes straight to the Store (§5, §9).

---

# 4. Digital Tipping

After selecting an employee, the customer can leave a tip.

Stores can configure suggested amounts such as:

- €2
- €5
- €10
- €20

There can also be a:

**Custom Amount**

option.

The customer chooses the amount and proceeds with the payment.

The tipping experience should be fast and require as little information as possible.

---

# 5. Tip Distribution

DelyTip supports every way a Store might want to split a tip through one unified model: a **Distribution Rule**.

### Distribution Rules

A Distribution Rule is a list of recipients and their share of the tip, always adding up to 100%. A recipient is either the **Store itself** or a **specific Employee**. This one structure covers every scenario a Store needs:

| Scenario | Distribution Rule |
|---|---|
| All tips go to the Store | Store: 100% |
| All tips go to the employee | Employee: 100% |
| Split between two employees (e.g. head server + assistant) | Employee A: 70%, Employee B: 30% |
| Store keeps a service fee, employee gets the rest | Store: 10%, Employee: 90% |
| Store keeps a fee, employees split the rest by their own share | Store: 10%, Employee A: 63%, Employee B: 27% |

Nothing about the customer's experience changes based on which rule is in effect — they just tap an amount and pay. The Distribution Rule only determines what happens to the money afterward.

### Reusable rules

A Store builds a small library of named Distribution Rules — for example "Standard," "Head Server + Assistant," "House Fee 10%" — and applies any of them:

- As the **Store's default rule**, used whenever a tip doesn't specify otherwise
- To a **specific QR code** (§9), overriding the Store default for that QR code only

A hotel with 40 tables using the same "Head Server + Assistant 70/30" split configures it once and applies it wherever it's needed, rather than re-entering the split on every QR code.

A QR code's rule is picked when the QR code is created, but it isn't locked in — the Store can change which rule a QR code uses at any time. The new rule applies to every tip from that point on; tips the QR code already generated are unaffected.

### How this plays out for customers

This follows directly from how the QR code was set up (§9) — how many employees are assigned, and in which mode:

- **General Store tip (zero employees)** — no employee selection is shown; the tip goes to the Store, per the rule's Store share (typically Store: 100%).
- **Individual tipping (one employee)** — a QR code associated with one employee (§3) uses that employee's applicable rule, typically Employee: 100%, or Store: X% / Employee: (100−X)% if the Store takes a fee. Example: Customer leaves €10 → Maria receives €10 (or €9 if the Store keeps a 10% fee).
- **Choose one (multiple employees, default)** — the customer picks a single employee from those assigned (§3); the rule's Employee share goes entirely to whoever they pick.
- **Team (multiple employees, no choice)** — the QR shows all assigned employees with no selection step, and the tip is automatically split across them per the rule. Example: €20 on a 70/30 rule → Maria receives €14, Nikos receives €6.

### Who can configure this

Only an Organization Owner or Store Manager (§26) can create or edit Distribution Rules and assign them to QR codes. Employees can see their own tips and which rule produced them (§13), but cannot change how a tip is split — keeping the split itself outside individual negotiation or dispute.

### Rounding

When a split produces a fractional amount smaller than the currency's smallest unit, the remainder is added to the first-listed recipient's share, so the total paid out always equals the tip amount exactly.

---

# 6. Customer Reviews

After leaving a tip, the customer can optionally leave feedback.

For example:

> **How was your experience?**
>
> ★★★★★

The customer can then write:

> "Maria was extremely helpful and friendly."

The review can include:

- Star rating
- Written feedback
- Employee recognition
- Optional categories

For example:

**How would you rate the service?**

- Friendliness
- Speed
- Professionalism
- Overall experience

The Store can decide which questions are shown.

---

# 7. Review Flow

DelyTip should distinguish between **private feedback** and **public reviews**.

This is important for Stores.

A customer could be asked:

> **How was your experience?**

If they give a high rating, DelyTip could optionally encourage them to leave a public review.

For example:

> "We're glad you enjoyed your experience. Would you like to share your experience with others?"

The customer could then be directed toward the Store's preferred review platform.

If the customer gives a low rating, the system can instead encourage private feedback:

> "We're sorry your experience wasn't perfect. Please tell us what happened so we can improve."

This gives the Store an opportunity to identify problems before they become public negative reviews.

---

# 8. Customer Feedback

Stores should be able to create customized feedback questions.

For example:

### Restaurant

> How was the food?

> How was the service?

> How was the atmosphere?

### Hotel

> How was your room?

> How was the reception?

> How was your stay?

### Salon

> How satisfied are you with the service?

> How was your stylist?

This allows DelyTip to work across multiple industries.

---

# 9. QR Code Management

Every Store can create multiple QR codes.

For example:

**Restaurant**

- Table 1
- Table 2
- Table 3
- Bar
- Reception
- Receipt
- Takeaway counter

Each QR code can have its own identity, including which employee(s) it's associated with and which Distribution Rule (§5) applies to tips through it.

### Creating a QR code

When creating a QR code, the Store assigns any number of employees to it — zero, one, or many — and picks the Distribution Rule (§5) that applies to tips through it:

- **Zero employees** — a Store-only QR, e.g. a reception desk or general checkout tip jar. No employee selection is shown; the whole tip goes to the Store, per the rule's Store share.
- **One employee** — the QR auto-shows that employee (§3); no selection needed.
- **Multiple employees** — the Store also picks a mode: **Choose one** (default) shows all assigned employees and lets the customer pick who to thank (§3); **Team** shows all of them with no selection step and splits the tip across them automatically per the rule (§5).

Both the assigned employees and the rule applied can be changed at any time after the QR code is created (§5).

This allows the Store to understand where interactions are coming from.

For example:

> Table 12 generated 14 tips this week.

> Bar generated €320 in tips.

> Reception generated 42 reviews.

The QR codes can also be downloaded and printed.

---

# 10. Organizations and Stores

DelyTip's account model is built around two concepts: **Organizations** and **Stores**.

An **Organization** is the top-level account. It is what a user signs up for, what gets billed, and what people are granted access to. An Organization does not run tips or reviews itself — it is an umbrella.

A **Store** is where the actual DelyTip experience happens. Each Store is fully self-contained, with its own:

- Branding (logo, name, cover image, colors, messages)
- Employees
- QR codes
- Tipping configuration
- Review and feedback configuration
- Tips, reviews, and analytics

> Note: elsewhere in this document, "business" is used informally to describe whoever is running DelyTip day-to-day. Formally, that maps to a **Store**. Most Organizations will have exactly one Store, and for them the distinction is invisible — they just have "their DelyTip account."

This two-level model is intentionally generic so it can represent several different real-world structures without DelyTip needing to know which one it is:

### A single business, one location

> **Bella Restaurant** (Organization)
> - Bella Restaurant (Store)

One Organization, one Store. This is the common case and should feel exactly as simple as a single-business setup always has.

### One brand, multiple branches

> **ABC Hospitality** (Organization)
> - Athens (Store)
> - Thessaloniki (Store)
> - Heraklion (Store)
> - Rhodes (Store)

Each branch is its own Store — own employees, QR codes, tips, reviews, feedback, and analytics — but they share one Organization for billing and access.

### Independently branded stores under one owner

> **Petros's Ventures** (Organization)
> - Bella Restaurant (Store)
> - Luxe Hair Salon (Store)

The two Stores can have completely different branding, industries, and configuration. Nothing about a Store assumes its siblings look or behave like it.

### Franchise-style structure

> **Delitip Franchise Group** (Organization)
> - Downtown Location (Store, own manager)
> - Airport Location (Store, own manager)

Same shape as the branch case, but the emphasis is on each Store operating semi-independently under shared branding, with store-level managers rather than a single manager overseeing everything.

### Cross-store view

The Organization dashboard can show:

- A combined view aggregating all Stores (tips, reviews, ratings, employees recognized)
- A per-Store view, with the ability to switch between Stores

This mirrors the existing filter-by-location idea, generalized to any Store regardless of what kind of business it represents.

### Users and Organizations

A user account is not locked to one Organization. Someone can belong to multiple Organizations — for example, an owner running both a café Organization and a salon Organization, or a regional manager who has been granted access across several Organizations. Each membership carries its own role (see §26), and the user can switch between Organizations the way one switches between workspaces.

### Billing

Billing happens at the Organization level. One subscription covers every Store under that Organization, with the plan tier scaling by number of Stores, employees, or features (see §32) rather than requiring a separate subscription per Store.

---

# 11. User Identity and Accounts

DelyTip separates two ideas: a **User** is a real person, identified by their email. An **Account** is a specific role attached to that email — a Customer Account, an Employee Account (at a specific Store), or an Organization Account (membership in a specific Organization, with a role per §26).

One User can hold several Accounts — of the same type or different types — all tied together by their email.

The same person can hold, at once:

- One or more Organization Accounts (Organization Owner, Store Manager, Accountant — see §26)
- One or more Employee Accounts (staff at a specific Store, receiving tips and recognition)
- A Customer Account, built from tipping and reviewing at any Store, including ones they have no other relationship to

For example:

> Maria owns a small café (Organization Account, Owner role, her own Organization). She also works evening shifts as a waitress at a friend's restaurant (Employee Account at that Store). And when she's out with friends, she uses DelyTip to tip other businesses she visits (Customer Account). All three are separate Accounts, but they belong to the same DelyTip User because they share her email.

### Accounts can exist before anyone logs in

An Account doesn't require the person to sign up first — it can be created passively, the first time their email shows up in a relevant context:

- A customer tips using an email → a Customer Account is created (or reused, if one already exists) for that email, with no password. It just holds their tipping and review history.
- A Store adds someone as staff by email → an Employee Account is created (or reused) for that email at that Store, with no password.
- An Organization invites someone as a member by email → an Organization Account is created (or reused) for that email, with no password.

In every case, the Account exists and starts accumulating activity from that point on, but nobody can log into it yet — it's a placeholder tied to an email, not a login.

### Registering claims every linked Account

At any point, the person behind that email can register — set a password for the first time. That single action activates their User identity for login, and every Account already tied to that email (Customer, Employee, Organization) becomes accessible immediately from that one login.

This is what lets, for example, a customer who has been tipping anonymously for months eventually register and see their entire tipping and review history already there — nothing needs to be re-entered or migrated, because it was attached to their email the whole time.

### One login, multiple views

Once registered, signing in is a single login for the User. §10 already describes switching between Organizations — that same switcher extends to cover every Account tied to the identity:

- **Organization/Store view(s)** — any Organization Account the person holds, and within it any Store
- **Employee view(s)** — any Store where the person has an Employee Account, showing their personal tips, reviews, and recognition (§13)
- **Customer view** — their Customer Account's tipping and review history across every Store they've interacted with

A person with only one Account — for example, a customer who has never worked anywhere or run a business — simply never sees the switcher. It stays invisible until there's more than one to switch between, the same principle as §10 and §25.

### Privacy

Customers still never need to register or sign in to leave a tip or review (§29 is unchanged) — an unclaimed Customer Account created this way grants nobody access to anything; it only becomes reachable once its owner registers with that email. Customers should be able to see and control this: understand that entering their email links this activity to an Account under that email, and have visibility into their own tipping/review history if they choose to register.

This also lays the groundwork for future features like Loyalty and Customer Profiles (§34), since a Customer Account can accumulate history well before anyone formally signs up.

---

# 12. Employee Management

Stores can create employee profiles.

Each employee can have:

- Name
- Photo
- Position
- Store
- Status
- Personal QR code
- Tips received
- Reviews
- Average rating
- Customer feedback

Employees should be able to see their own performance if the Store allows it.

---

# 13. Employee Dashboard

An employee could see:

### My Tips

> €842 this month

Broken down by which Distribution Rule (§5) produced each tip, so it's clear why a shared QR code paid out what it did.

### Average Rating

> 4.9 / 5

### Reviews

> 37 reviews

### Customer Recognition

> 24 customers specifically mentioned you

### Recent Feedback

> "Maria was extremely helpful."

This creates a positive feedback loop for employees.

It can also help Stores identify high-performing employees.

---

# 14. Dashboard Overview

The main dashboard should provide an overview of what is happening, at either the Store level or the aggregated Organization level (see §10).

For example:

### Today

**Tips:** €487  
**Transactions:** 83  
**Reviews:** 46  
**Average Rating:** 4.8  
**Employees Recognized:** 17

The dashboard should also show trends.

For example:

- Tips over time
- Reviews over time
- Average rating
- Best-performing employees
- Best-performing Stores
- Customer satisfaction
- Most common feedback

---

# 15. Tip Analytics

Stores should be able to understand their tipping activity.

They can see:

- Total tips
- Number of tips
- Average tip
- Tips per employee
- Tips per Store
- Tips per day
- Tips per week
- Tips per month

They should be able to filter the data by:

- Date
- Store
- Employee
- QR code

---

# 16. Employee Performance Analytics

DelyTip can provide a broader view of employee performance.

For example:

| Employee | Tips | Rating | Reviews |
|---|---:|---:|---:|
| Maria | €842 | 4.9 | 37 |
| Nikos | €710 | 4.8 | 31 |
| Elena | €523 | 4.7 | 24 |

This should not necessarily be positioned as a ranking system.

Instead, it should help managers understand:

**Who is consistently creating great customer experiences?**

---

# 17. Store Analytics

For Organizations with multiple Stores, managers can compare performance.

Example:

> **Athens**
>
> Tips: €4,820  
> Rating: 4.8

> **Thessaloniki**
>
> Tips: €3,240  
> Rating: 4.6

> **Heraklion**
>
> Tips: €5,120  
> Rating: 4.9

This can help management identify differences between Stores.

---

# 18. Customer Experience Score

DelyTip can combine different signals into an overall customer experience score.

For example:

- Ratings
- Reviews
- Feedback
- Employee recognition
- Tip activity

The Store could see:

> **Customer Experience Score: 94/100**

The score should be accompanied by an explanation of what is driving it rather than being treated as a mysterious metric.

---

# 19. Review Management

Stores should have a dedicated section for reviews.

They can:

- View reviews
- Filter reviews
- Search reviews
- Filter by employee
- Filter by Store
- Filter by rating
- Read customer comments

Reviews could be categorized automatically.

For example:

**Positive**

- Friendly service
- Fast service
- Professional
- Good atmosphere

**Negative**

- Slow service
- Waiting time
- Staff availability
- Food issue

This makes large volumes of feedback easier to understand.

---

# 20. AI Feedback Analysis

An optional advanced feature could automatically analyze customer feedback.

Instead of requiring the manager to read hundreds of reviews, DelyTip could summarize them.

For example:

> **This week**
>
> Customer satisfaction increased by 8%.
>
> Customers particularly praised the friendliness of the staff.
>
> The most common complaint was waiting time during dinner.
>
> Maria received the highest number of positive mentions.

This turns DelyTip from a simple tipping platform into a **customer experience intelligence platform**.

---

# 21. Alerts

The Store could receive alerts for important events.

For example:

### Positive

> Maria has received 10 customer compliments today.

### Negative

> Customer satisfaction at the Athens Store has dropped below your normal average.

### Review

> A customer left a 2-star review mentioning long waiting times.

### Performance

> Tips at your Thessaloniki Store increased 24% this week.

The Store should be able to choose which alerts it wants to receive.

---

# 22. Customer Thank-You Experience

After a successful tip, the customer should receive a simple confirmation.

For example:

> **Thank you.**
>
> Your €10 tip was sent to Maria.
>
> Your appreciation means a lot.

The Store can customize this message.

This small interaction is important because the product should feel like an act of appreciation rather than simply another payment.

---

# 23. Store Branding

Stores should be able to customize their DelyTip experience.

They can add:

- Logo
- Store name
- Cover image
- Brand colors
- Welcome message
- Thank-you message
- Employee photos
- Review questions

The goal is for the customer to feel that they are interacting with the Store, not a generic third-party platform.

Welcome message, thank-you message, and review questions can each be translated into multiple languages (§24).

---

# 24. Localization and Multi-Language Support

Every piece of customer-facing text a Store writes — welcome message, tipping message, thank-you message, feedback and review questions (§8) — should be able to appear in more than one language.

### Language selection

DelyTip detects the customer's language automatically from their phone or browser, and shows a small language switcher on the page in case they'd rather see it in a different one.

### How translations are produced

A Store writes each message once, in its primary language. DelyTip automatically translates it into every other language the Store supports, and the Store can review and hand-edit any of those translations if the machine translation doesn't read right.

### Scope

The same mechanism covers any Store-authored customer-facing text, not just branding messages:

- Welcome message
- Thank-you message
- Feedback and review questions (§8)
- Any other custom text the Store adds to its page

It does not cover the platform's own interface — buttons, navigation, system messages — which is DelyTip's own localization, independent of what a Store writes.

### Fallback

If a language doesn't have a translation yet — the Store hasn't reviewed it, or auto-translation hasn't run — the customer sees the Store's primary-language version rather than a blank field or a broken translation.

---

# 25. Scaling Across Organization Sizes

Building on the Organization/Store model in §10, DelyTip needs to work equally well at very different scales.

A small café Organization might have:

> 1 Store  
> 6 employees  
> 20 QR codes

A hotel group Organization might have:

> 8 Stores  
> 300 employees  
> Hundreds of QR codes

The system should accommodate both without making the small-Organization experience unnecessarily complicated. A single-Store Organization should never feel like it's using a "multi-store product with one store filled in" — the extra structure should stay invisible until it's needed.

---

# 26. Employee Permissions

Organizations should be able to control what different users can access.

Roles apply at either the Organization level or the Store level (see §10). An Organization-level role sees across every Store; a Store-level role is scoped to just that Store — this is what makes the franchise-style structure in §10 work, where each Store can have its own manager who cannot see other Stores.

### Organization Owner

Full access across every Store in the Organization, including billing.

### Store Manager

Can see employees, reviews and analytics for their Store only, and can create or edit that Store's Distribution Rules (§5).

### Employee

Can see their own tips and feedback.

### Accountant

Can access financial and payment information, at the Organization or Store level depending on how they were granted access.

This keeps sensitive information restricted to the appropriate people.

The same person can hold different Accounts in different places at once — for example, an Organization Account as Owner of their own business while also holding an Employee Account elsewhere (see §11).

---

# 27. Payments and Payouts

The platform should provide a clear record of every transaction.

Stores should be able to see:

- Tip amount
- Date
- Time
- Employee
- Store
- Transaction status
- Payout status

Employees should be able to see the tips attributed to them and the amount available according to the Store's payout setup.

The platform should make the flow transparent so employees and Stores can understand exactly where money went.

---

# 28. Refunds and Disputes

The Store should have access to transaction information when a customer requests assistance.

Managers should be able to:

- Find a transaction
- View its details
- Review its status
- Handle eligible refunds
- Contact support when necessary

---

# 29. Customer Privacy

Customers should not need to create an account simply to leave a tip or review.

The product should collect only the information necessary for the selected action.

Customers should also understand clearly:

- What they are paying
- Who receives the tip
- What information is being collected
- Whether their review is public or private
- Whether their activity is being linked to an existing DelyTip identity (see §11)
- What language they're being shown, and that a Store's messages may be machine-translated (see §24)

---

# 30. Mobile-First Experience

The customer-facing experience should be designed primarily for mobile phones.

A customer should be able to:

**Scan → Select → Tip → Review → Done**

without downloading an application or creating an account.

The entire experience should feel fast enough to complete while the customer is still at the table.

---

# 31. Business Setup

A new business should be able to get started through a simple onboarding process.

### Step 1

Create Organization and first Store. For a single-Store Organization, this happens as one step and the Organization stays invisible — it's presented as "create your business profile," not as a separate org-creation step.

### Step 2

Add additional Stores, if any (e.g. other branches or brands under the same Organization).

### Step 3

Add employees.

### Step 4

Configure tipping.

### Step 5

Configure reviews and feedback.

### Step 6

Create QR codes.

### Step 7

Print and place QR codes.

After that, the Store is ready to receive tips and feedback.

---

# 32. Subscription Plans

DelyTip can operate as a subscription SaaS.

Subscriptions are billed at the Organization level (see §10) — one subscription covers every Store under that Organization, with the plan tier scaling by number of Stores, employees, or features rather than requiring a separate subscription per Store.

Possible plans:

### Starter

For small businesses.

Includes:

- Basic tipping
- QR codes
- Employees
- Basic reviews
- Basic analytics

### Professional

For growing businesses.

Includes:

- Multiple Stores
- Advanced analytics
- Employee performance
- Custom feedback
- Review management
- Alerts

### Enterprise

For larger groups.

Includes:

- Unlimited Stores
- Advanced reporting
- Custom branding
- Multiple management levels
- Advanced analytics
- Dedicated support

The exact pricing can be determined later.

---

# 33. The Core Product Loop

The entire product can be understood through one simple loop:

**Customer interaction**

↓

**QR scan**

↓

**Employee recognition**

↓

**Digital tip**

↓

**Customer rating**

↓

**Written feedback**

↓

**Business analytics**

↓

**Employee recognition & improvement**

↓

**Better customer experience**

↓

**More satisfied customers**

This is the core value proposition of DelyTip.

---

# 34. Future Features

Once the core product is established, DelyTip could expand into additional areas.

### Loyalty

Customers could collect points or rewards from participating businesses.

### Employee Rewards

Businesses could create bonuses based on customer feedback.

### Customer Profiles

Returning customers could receive personalized experiences.

### Campaigns

Businesses could run campaigns such as:

> "Help us reach 1,000 five-star reviews."

### Digital Receipts

DelyTip could connect tipping, feedback and digital receipts into one experience.

### Reservations

The platform could eventually connect customer feedback with reservations.

### Staff Recognition

Businesses could recognize employees who consistently receive exceptional feedback.

### Customer Experience CRM

Over time, DelyTip could become a broader customer experience platform rather than just a tipping application.

---

# 35. Product Positioning

The important distinction is that **DelyTip should not be positioned simply as a QR-code tipping tool.**

The QR code is the entry point.

The actual product is:

> **A platform that connects digital tipping, customer feedback, employee recognition and customer experience analytics.**

For the customer:

**"Thank someone who made your experience better."**

For the employee:

**"Get recognized for great service."**

For the business:

**"Understand your customers and recognize your best people."**

That gives DelyTip a much larger potential market than simply selling QR codes for tips.
