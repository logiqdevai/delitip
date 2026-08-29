# API Test Coverage Plan

**Audience:** an AI coding agent picking up this file cold. Read this whole document before writing a single test.

## Status

Phase 1 is done: every `*.module.ts` under `api/src` (41 files) has a co-located `*.module.spec.ts` that verifies the module's DI graph compiles (`Test.createTestingModule({ imports: [XModule] }).compile()`). Those are **wiring smoke tests only** — they mock `PrismaService` with `{}` and call no business logic. Full suite currently: `41 test suites / 130 tests`, all green (`cd api && npx jest`).

Phase 2 (this file) is real coverage: actually exercising service/controller/guard/pipe/util logic — happy paths, every thrown-exception branch, boundary conditions — against mocked dependencies. This is the bulk of the work and is tracked as a checklist below, most important first.

**Phase 2 status: complete.** All 108 checklist items done. Full suite: `cd api && npx jest` → 149 test suites (41 module-wiring + 108 unit specs), 1072 tests, all passing. Five real (pre-existing) production bugs were found along the way, documented in [Findings](#findings--open-questions), and have since all been fixed (with the corresponding tests updated to assert the corrected behavior) — still 149/149 green after the fixes.

## How to work through this file

1. Take the **first unchecked item, top to bottom, within the current tier**. Don't skip around or jump to a later tier while earlier-tier items remain unchecked, unless the user explicitly redirects you.
2. Read the target source file in full (and anything non-trivial it calls — DTOs for shape, other injected services for their contract) before writing anything.
3. Create `<name>.spec.ts` co-located next to the source file (matches the existing convention from phase 1).
4. Write tests per the conventions below. Run just that file (`cd api && npx jest <relative-path-from-src>`), iterate until green.
5. Run the full suite (`cd api && npx jest`) to confirm no regressions before moving on.
6. Check the box (`- [x]`) for that item in this file and move to the next.
7. If you find a genuine pre-existing bug while reading/testing (not a testability issue): do **not** silently change production behavior. Log it under [Findings](#findings--open-questions) with file/line and a one-sentence description. Only fix it yourself if the fix is trivial, obviously correct, and doesn't change any behavior a caller could be relying on (e.g. a clearly-unreachable null check) — otherwise leave it for a human to decide.
8. Don't commit. Leave that to the operator running you.

Periodically (e.g. every ~10 items, or whenever you're unsure), re-run the full suite and skim this file's own accuracy — if a module turns out to have more or fewer methods than assumed here, just adjust the checklist rather than treating the mismatch as a blocker.

## Conventions

**Test runner:** Jest via `cd api && npx jest <path>`. Config lives in `api/package.json`'s `"jest"` key — `rootDir: src`, `testRegex: .*\.spec\.ts$`, and `moduleNameMapper` for the `@/*` / `generated/*` / `src/*` path aliases (already fixed in phase 1 — don't re-break it).

**File location:** co-located with the source file, same base name, `.spec.ts` suffix. Never a separate `__tests__/` tree.

**Framework style:** plain Jest + `@nestjs/testing`'s `Test.createTestingModule` when you want real DI (e.g. testing a guard that's `@Injectable()` with a `Reflector`), or just `new ServiceUnderTest(mockDep1, mockDep2)` directly when the class has no decorated dependencies that matter — either is fine, prefer whichever is less ceremony for the file at hand. Most services here take `PrismaService` (+ maybe `AccessControlService`, `UsersService`, etc.) via constructor injection with no other magic, so direct instantiation with hand-built mocks is usually simplest:

```ts
import { NotFoundException } from '@nestjs/common';
import { TipsService } from './tips.service';

describe('TipsService', () => {
  let service: TipsService;
  let prisma: any;
  let accessControl: any;
  let usersService: any;

  beforeEach(() => {
    prisma = {
      qrCode: { findUnique: jest.fn() },
      tip: { create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), count: jest.fn(), aggregate: jest.fn() },
      tipDistribution: { createMany: jest.fn() },
      alertPreference: { findFirst: jest.fn() },
      alert: { findFirst: jest.fn(), create: jest.fn() },
      store: { findUnique: jest.fn() },
      distributionRuleRecipient: { findMany: jest.fn() },
      $transaction: jest.fn((fn) => fn(prisma)),
    };
    accessControl = { assertStoreAccess: jest.fn() };
    usersService = { findOrCreateByEmail: jest.fn() };
    service = new TipsService(prisma, accessControl, usersService);
  });

  it('throws NotFoundException when the QR code does not exist', async () => {
    prisma.qrCode.findUnique.mockResolvedValue(null);
    await expect(service.createPublicTip({ qr_code_id: 'x', amount: 500 } as any))
      .rejects.toThrow(NotFoundException);
  });

  // ... one test per branch/exception/edge case
});
```

**Use real Prisma enums, not magic strings.** Every enum referenced in a test (`recipient_type`, roles, statuses, etc.) must come from `generated/prisma` (e.g. `import { DistributionRecipientType, OrganizationRole, AuthRole } from 'generated/prisma'` then `DistributionRecipientType.STORE`), never a bare string literal like `'STORE'`. This also forces you to use the *right* enum for the *right* field — e.g. `AuthUser.role` is an `AuthRole` (`USER`/`ADMIN`/`SUPER_ADMIN`/`SUPPORT`), while an `OrganizationMember.role` is an `OrganizationRole` (`OWNER`/`STORE_MANAGER`/`ACCOUNTANT`) — don't mix them up (easy to do since both are just `string` in a loosely-typed mock).

**Important — don't use `{}` as a Prisma mock here.** Phase 1's `.overrideProvider(PrismaService).useValue({})` was fine because those tests never called a method. Phase 2 tests call real logic, so build a mock object with `jest.fn()` for exactly the Prisma model methods the file under test actually calls, and set return values per test with `.mockResolvedValue(...)` / `.mockResolvedValueOnce(...)`. For `$transaction`, mock it as `jest.fn((fn) => fn(prismaMock))` so the callback body runs against the same mock (see example above) unless the file passes a plain array to `$transaction`, in which case mock it as `jest.fn((ops) => Promise.all(ops))`.

**What "full coverage" means per file type:**
- **Services:** one test per public method's happy path, one test per thrown exception/guard branch (e.g. every `NotFoundException`/`BadRequestException`/`ForbiddenException`/`ConflictException` site), and boundary/edge cases called out in the checklist below. Assert both the return value AND that Prisma was called with the right `where`/`data` shape via `toHaveBeenCalledWith(...)` where it matters (e.g. tenant-scoping filters — these are security-relevant, don't skip them).
- **Controllers:** per AGENTS.md, controllers hold no business logic — so these tests are thinner. Mock the service, verify the controller calls the right service method with the right args (extracted correctly from `@CurrentUser()`/`@Body()`/`@Query()`/`@Param()`), and that it returns whatever the service returned. Don't re-test business logic here.
- **Guards/strategies/pipes:** call `canActivate`/`validate`/`transform` directly with hand-built mock `ExecutionContext`/args — no need for a full HTTP request. Cover both allow and deny paths.
- **Pure utils** (no DI): exhaustive input → output table, including edge cases (empty arrays, zero amounts, rounding).

**Scope exclusions — do not write specs for:**
- `*.module.ts` (done in phase 1).
- `*.dto.ts`, `*.entity.ts`, `*.interface.ts` / `*.interfaces.ts` — no behavior.
- `*.schema.ts` (Zod query schemas) — declarative only, **unless** one uses `.refine()`/`.transform()` with custom logic beyond parsing, in which case test just that logic.
- Static config/constant modules with no functions: `shared/config/account/account-categories.ts`, `shared/config/account/account-countries.ts`, `shared/config/app-urls/index.ts`, `shared/config/email/index.ts`, `shared/config/error-codes/index.ts`, `shared/constants/email.ts`. (If one of these turns out to export an actual function, test that function — check before skipping.)
- `main.ts` (bootstrap, not unit-testable in a meaningful way).

---

## Tier 1 — Money movement & security boundary (do these first, in order)

These are either directly financial (tips, refunds, payouts, subscriptions, distribution splitting) or the auth/access-control boundary everything else depends on. Bugs here are the highest-cost bugs in the app.

- [x] `shared/utils/distribution/distribution-calculator.util.ts` — pure function, no DI, the highest-value target in the whole codebase. It implements the "§5" tip-splitting spec referenced in its own comments. Test matrix: empty/no recipients (100% to a synthetic Store line); only Store recipients; employee recipients but zero selected employees (leftover folds into lowest-`sort_order` Store line, or becomes a synthetic Store line if none exist); one or more selected employees matching named rule recipients exactly; selected employees not named in the rule at all ("selected but unnamed" pooling, splitting the unmatched pool evenly across them); unmatched pool redistributed proportionally across matched recipients when there's no unnamed bucket; the `matchedTotal === 0` fallback (even split); the "employees selected but none named and no unnamed bucket" fallback that donates to Store; rounding — `finalizeAmounts` uses `Math.floor` per line then dumps the remainder on the first (lowest sort_order) line, verify total always equals `tipAmount` exactly across a set of amounts that don't divide evenly (e.g. 3-way split of 100).
- [x] `shared/services/access-control/access-control.service.ts` — the authorization backbone every store/org-scoped endpoint relies on. Test `isPlatformAdmin` (ADMIN/SUPER_ADMIN vs regular role); `assertOrgAccess` (platform admin bypass, no-membership → `ForbiddenException`, wrong role in `allowedRoles` → `ForbiddenException`, valid membership returned); `assertStoreAccess` (store not found → `NotFoundException`, platform admin bypass, org-level membership takes precedence over store-level, store-level-only membership, no membership at all → `ForbiddenException`, role check); `getAccessibleStoreIds` (platform admin gets all org stores, org-level member gets all org stores, store-level-only member gets just their stores); `assertEmployeeSelfOrStoreAccess` (employee not found → `NotFoundException`, self bypass returns `isSelf: true` without calling `assertStoreAccess`, non-self delegates to `assertStoreAccess`).
- [x] `shared/guards/jwt.guard.ts` — `handleRequest` branches: `JsonWebTokenError` → `UnauthorizedException` with `code: 'invalid_token'`; generic `err`/no `user` → `UnauthorizedException` with `code: 'authentication_required'`; success path attaches `user` to the GraphQL context and delegates to `super.handleRequest`. Note it reads from `GqlExecutionContext` even for a presumably-REST guard — worth confirming/covering as-is.
- [x] `shared/guards/roles.guard.ts` — no `@Roles()` metadata → allow; metadata present but no `request.user`/`user.role` → deny; `SUPER_ADMIN` always allowed regardless of required roles; role present in `requiredRoles` → allow; role not present → deny.
- [x] `modules/auth/strategies/jwt.strategy.ts` — read the file first (23 lines); test `validate()`'s payload → user-object mapping and any failure path.
- [x] `shared/utils/jwt/jwt.service.ts` (`CreateJwtService`) — `signToken` calls `JwtService.signAsync` with the configured secret/expiration; `verifyToken` happy path and its `UnauthorizedException` wrap on a bad token; `getExpirationTime` decodes and returns `exp`.
- [x] `shared/pipes/zod.validation.pipe.ts` — valid input passes through parsed; invalid input throws `BadRequestException` shaped as `{ message, errors: [{ field, message }] }` from a `ZodError`; a non-Zod throw is wrapped as a generic `BadRequestException`.
- [x] `modules/tips/services/tips.service.ts` — the core product flow. `createPublicTip`: QR code not found → `NotFoundException`; inactive QR code / inactive store → `BadRequestException`; `resolveSelectedEmployeeIds` branches (zero assigned employees, exactly one assigned employee auto-selected, `TEAM` mode returns all assigned, `CHOOSE_MANY` with missing/empty `employee_ids` → `BadRequestException`, `CHOOSE_MANY` with an id not assigned to the QR → `BadRequestException`, `CHOOSE_ONE` missing `employee_id` → `BadRequestException`, `CHOOSE_ONE` with an unassigned id → `BadRequestException`); custom-amount enforcement (`allow_custom_tip_amount` false + amount not in `suggested_tip_amounts` → `BadRequestException`); distribution rule resolution (QR-level rule wins over store default; no rule → empty recipients passed to the calculator); customer user resolution (email present → `usersService.findOrCreateByEmail` called, no email → `customer_user_id` undefined); currency fallback to store currency; the tip + `tipDistribution.createMany` write happens inside `$transaction`; `triggerPerformanceChangeAlert` is fire-and-forget (`.catch(() => {})`) — verify a rejection there does NOT propagate out of `createPublicTip`; thank-you message: store's translated message wins when present, otherwise the generated default naming the thanked employee(s) or store. Also test `triggerPerformanceChangeAlert` directly (private, but reachable via `createPublicTip` — or extract via `(service as any).triggerPerformanceChangeAlert` if you need to isolate it): disabled preference → no-op; already-alerted-today → no-op; `previous === 0` → no-op (avoid divide-by-zero); change below `PERFORMANCE_CHANGE_THRESHOLD_PERCENT` (20%) → no-op; above threshold → creates an `Alert` with the right up/down title. Then `findAll` (access-control call, every optional query filter branch, pagination) and `findOne` (not found → `NotFoundException`, access-control call using the tip's `store_id`).
- [x] `modules/tips/tips.controller.ts`
- [x] `modules/tips/public-tips.controller.ts`
- [x] `modules/refunds/services/refunds.service.ts` — `loadTip` not-found path; `createPublicRequest` (email → `findOrCreateByEmail`, no email → falls back to `tip.customer_user_id`, `amount` defaults to full `tip.amount`); `create` (access-control roles `['OWNER','STORE_MANAGER','ACCOUNTANT']`); `findAll`/`findOne` (not found, access-control, status filter); `update` — already-`COMPLETED`/`REJECTED` refund → `BadRequestException`; transitioning to `COMPLETED` also flips the tip's status to `REFUNDED` inside the same `$transaction`; transitioning to any other status does not touch the tip.
- [x] `modules/refunds/refunds.controller.ts`
- [x] `modules/refunds/public-refunds.controller.ts`
- [x] `modules/distribution-rules/distribution-rules.service.ts` — read first; likely CRUD plus percentage-sum validation and default-rule assignment — confirm and cover every branch, especially anything that guards against recipient percentages not summing sanely (mirrors the calculator's assumptions).
- [x] `modules/distribution-rules/distribution-rules.controller.ts`
- [x] `modules/payout-accounts/payout-accounts.service.ts` — note: **no real payment processor is wired up here** ("connecting an account is simulated as instantly successful and ACTIVE" per the file's own comment) — don't invent tests assuming real Stripe/Viva calls happen. `createForStore` (`OWNER`-only access, duplicate `store_id` → `ConflictException`); `findForStore` (not found → `NotFoundException`); `updateForStore` (not found → `NotFoundException`, partial-update semantics — only `status`/`provider` when present in the DTO); `createForUser`/`findForUser` mirror the store versions for the user-owned case.
- [x] `modules/payout-accounts/payout-accounts.controller.ts`
- [x] `modules/payout-accounts/user-payout-account.controller.ts`
- [x] `modules/subscriptions/services/subscriptions.service.ts` — note: **no real billing provider is wired up** ("plan changes take effect immediately and for free" per the file's own comment, §32) — this is intentional, not a bug to flag. `findOne` (org access, not-found); `changePlan` (`OWNER`-only, sets `ACTIVE` + a 30-day period window — freeze/inject a fake `Date` or assert the delta rather than an absolute timestamp); `cancel` (`OWNER`-only, sets `CANCELED`).
- [x] `modules/subscriptions/subscriptions.controller.ts`
- [x] `modules/auth/services/email.service.ts` — `registerWithEmail`, `loginWithEmail`, `waitlist`. Cover duplicate-email handling, password hashing/verification (bcrypt — mock or use real bcrypt with a short cost factor, your call), and whatever email-sending side effect exists (mock `ResendModule`'s mail service, verify it's called but that a failure doesn't necessarily block the response if the code uses `setImmediate`/fire-and-forget per AGENTS.md's stated pattern — check which it actually does here).
- [x] `modules/auth/services/password.service.ts` — `forgotPassword`, `resetPassword`. Cover token/OTP generation & expiry logic, invalid/expired reset token handling, and the actual password update.
- [x] `modules/auth/controllers/email.controller.ts`
- [x] `modules/auth/controllers/password.controller.ts`
- [x] `shared/utils/otp/otp.service.ts` — `generateOtp` with default and custom options (length, character classes); the `try/catch` wraps the underlying generator's throw as `InternalServerErrorException` — force that branch if feasible (e.g. an invalid combination), otherwise at least document why it's untestable and move on.

## Tier 2 — Core domain CRUD (used across nearly every flow)

Standard pattern across this tier: access-control-gated CRUD over Prisma. Focus each spec on (a) the access-control call happening with the right role list, (b) not-found branches, (c) any uniqueness/conflict checks, (d) query filter/pagination branches on list endpoints.

- [x] `modules/users/services/users.service.ts` — pay special attention to `findOrCreateByEmail` (used by tips/refunds) — find-vs-create branch, and how `first_name`/name hints are applied on create.
- [x] `modules/users/users.controller.ts`
- [x] `modules/organizations/services/organizations.service.ts`
- [x] `modules/organizations/services/organization-members.service.ts`
- [x] `modules/organizations/organizations.controller.ts`
- [x] `modules/organizations/organization-members.controller.ts`
- [x] `modules/stores/services/stores.service.ts`
- [x] `modules/stores/stores.controller.ts`
- [x] `modules/stores/public-stores.controller.ts`
- [x] `modules/spots/services/spots.service.ts`
- [x] `modules/spots/spots.controller.ts`
- [x] `modules/employees/services/employees.service.ts`
- [x] `modules/employees/employees.controller.ts`
- [x] `modules/qr-codes/qr-codes.service.ts` — `validateRefs` (private helper — likely validates `employee_ids`/`distribution_rule_id` belong to the store, exercise via the public methods that call it); `create`/`update`/`remove`/`findAllForStore`/`findOne`/`stats`; `findPublicByCode` is the unauthenticated lookup the public tip flow depends on — cover not-found and inactive-code cases carefully since it's public-facing.
- [x] `modules/qr-codes/utils/qr-code.utils.ts` — pure function(s), read and cover exhaustively (likely code generation/formatting).
- [x] `modules/qr-codes/qr-codes.controller.ts`
- [x] `modules/qr-codes/public-qr.controller.ts`

## Tier 3 — Secondary product features

Same CRUD-over-Prisma pattern as Tier 2, lower blast radius if wrong.

- [x] `modules/reviews/services/reviews.service.ts` (largest file in this tier at 336 lines — budget more time)
- [x] `modules/reviews/reviews.controller.ts`
- [x] `modules/reviews/public-reviews.controller.ts`
- [x] `modules/review-categories/services/review-categories.service.ts`
- [x] `modules/review-categories/review-categories.controller.ts`
- [x] `modules/review-tags/services/review-tags.service.ts`
- [x] `modules/review-tags/review-tags.controller.ts`
- [x] `modules/feedback-questions/services/feedback-questions.service.ts`
- [x] `modules/feedback-questions/feedback-questions.controller.ts`
- [x] `modules/alerts/services/alerts.service.ts`
- [x] `modules/alerts/services/alert-preferences.service.ts` — note `tips.service.ts` reads `AlertPreference` directly via Prisma rather than through this service; keep that in mind, don't assume a dependency that isn't there.
- [x] `modules/alerts/controllers/alerts.controller.ts`
- [x] `modules/alerts/controllers/alert.controller.ts`
- [x] `modules/alerts/controllers/alert-preferences.controller.ts`
- [x] `modules/analytics/services/analytics.service.ts` (237 lines)
- [x] `modules/analytics/services/store-analytics.service.ts`
- [x] `modules/analytics/utils/period.utils.ts` — likely pure date/period-bucketing helpers, good exhaustive-table candidate.
- [x] `modules/analytics/controllers/analytics.controller.ts`
- [x] `modules/analytics/controllers/store-analytics.controller.ts`
- [x] `modules/insights/insights.service.ts` (216 lines)
- [x] `modules/insights/insights.controller.ts`
- [x] `modules/documents/services/documents.service.ts` — uses `GcsService` for file storage; mock it (don't hit real GCS).
- [x] `modules/documents/documents.controller.ts`

## Tier 4 — Shared pure utilities (cheap, no DI, do opportunistically)

No mocking needed — pure input/output. Good filler when blocked on something else, or to knock out in a batch.

- [x] `shared/utils/slug/slug.utils.ts`
- [x] `shared/utils/translation/translation.utils.ts` — this backs `resolveTranslatedText`, used by `tips.service.ts`'s thank-you-message logic — make sure the fallback-language behavior it relies on is covered.
- [x] `shared/utils/mock-payment/mock-payment.utils.ts` — `generateMockPaymentReference` / `generateMockProviderAccountId`, used by tips and payout-accounts. Just verify shape/format and uniqueness-ish behavior (e.g. two calls don't return identical values, if that's how it's implemented).
- [x] `shared/utils/images/image-base64.utils.ts`
- [x] `shared/utils/pagination/pagination-query.schema.ts` — the `paginate(items, total, query)` helper used everywhere for list responses; verify the exact shape (`{ data, pagination: { total, page, limit, total_pages, has_next, has_prev } }`) and edge cases (`total === 0`, last page, single page).

## Tier 5 — Live integration wrappers (currently reachable from real flows)

Mock the external SDK client itself (don't hit real Google Maps / GCS / Resend / Redis / Postgres over the network).

- [x] `shared/services/google-maps/google-maps.service.ts`
- [x] `modules/google-maps/google-maps.service.ts`
- [x] `modules/google-maps/google-maps.controller.ts`
- [x] `integrations/storage/gcs/services/gcs.service.ts` — this is the one actually used (by `documents.service.ts`).
- [x] `integrations/storage/gcs/gcs.adapter.ts`
- [x] `integrations/storage/gcs/config/gcs.config.ts` — logs an error and no-ops when `GCS_PROJECT_ID`/`GCS_BUCKET_NAME` are unset (seen already in phase 1 test output) — cover both the configured and unconfigured paths.
- [x] `integrations/storage/gcs/config/gcs-folders.config.ts`
- [x] `integrations/notifications/resend/services/mail.service.ts` — this is the one actually used (by `modules/auth`).
- [x] `integrations/notifications/resend/resend/resend.adapter.ts`
- [x] `integrations/notifications/resend/resend/resend.config.ts`
- [x] `integrations/notifications/resend/utils/templates.utils.ts`
- [x] `shared/services/cache/cache.service.ts`
- [x] `modules/health/health.service.ts`
- [x] `modules/health/checkers/postgres.health.ts`
- [x] `modules/health/checkers/redis.health.ts`
- [x] `modules/health/health.controller.ts`
- [x] `app.controller.ts`
- [x] `app.service.ts`

## Tier 6 — Currently unwired / dead code (verify before investing, then do last)

**Before starting any item in this tier**, re-confirm it's still unused with a quick grep (`grep -rn "StripeAccountsService\|StripeProductsService\|..." api/src/modules` etc.) — if something in Tier 1–3 started importing it since this plan was written, promote it to the appropriate earlier tier instead of leaving it here.

As of writing: nothing under `modules/**` imports any Stripe service, `ElasticsearchService`, or `AiService`. `integrations/notifications/twillio` and `integrations/notifications/smtp` are also unused (only Resend is wired into `auth`). `StripePaymentsWebhooksService` in particular is largely commented-out scaffold code seemingly carried over from a different project (bookings/credits domain) — most of its `switch` cases are no-ops today; only test what actually executes (signature verification, the one still-live `charge.updated` balance-transaction branch), don't invent tests for commented-out code paths.

- [x] `integrations/stripe/services/stripe-accounts..service.ts` (note the double-dot in the filename — that's real, not a typo you should "fix" without asking)
- [x] `integrations/stripe/services/stripe-customers.service.ts`
- [x] `integrations/stripe/services/stripe-payments.service.ts`
- [x] `integrations/stripe/services/stripe-payments-webhooks.service.ts`
- [x] `integrations/stripe/services/stripe-products.service.ts`
- [x] `integrations/stripe/services/stripe-coupons.service.ts`
- [x] `integrations/stripe/stripe.config.ts`
- [x] `integrations/storage/elasticsearch/elasticsearch.service.ts`
- [x] `integrations/ai/services/ai.service.ts`
- [x] `integrations/ai/utils/ai.config.ts`
- [x] `integrations/ai/utils/ai-cost.ts` — even though the AI service is unwired, if this contains real cost-calculation math it's a cheap, worthwhile pure-function test regardless.
- [x] `integrations/ai/utils/ai-pricing.ts` — same note as above.
- [x] `integrations/notifications/smtp/services/mail.service.ts`
- [x] `integrations/notifications/smtp/config/smtp.config.ts`
- [x] `integrations/notifications/smtp/smtp/smtp.adapter.ts`
- [x] `integrations/notifications/twillio/services/calls.service.ts`
- [x] `integrations/notifications/twillio/services/sms.service.ts`
- [x] `integrations/notifications/twillio/utils/calls.utils.ts`
- [x] `integrations/notifications/twillio/config/twilio.config.ts`
- [x] `core/queues/bull-board.middleware.ts` — pairs with `BullBoardModule`, already flagged as dead/incomplete wiring in phase 1.

---

## Findings / open questions

Seed notes from the research done while building this plan — not bugs, just context worth not re-discovering:

- Tips and payouts run on **simulated payments** (`generateMockPaymentReference`/`generateMockProviderAccountId`) — there is no live payment processor wired into the tip-collection or payout flow today. Don't write tests that assume real money movement through Stripe/Viva for those two flows.
- Subscriptions/billing is similarly unbilled today (`SubscriptionsService`'s own comment: "No real billing provider is wired up... plan changes take effect immediately and for free").
- The entire `integrations/stripe` module, `ElasticsearchModule`, and the AI integration are currently dead code — not imported by any feature module. Confirmed via `grep -rn "StripeAccountsService\|...\|ElasticsearchService\|AiService" api/src/modules` returning no hits.
- `GraphQLModule` and the real queue registrations in `BullBoardModule` are also dead/incomplete (documented already in the phase-1 module specs with structural-only tests and inline comments explaining why).

- `shared/utils/distribution/distribution-calculator.util.ts:99-109` — the third branch of `calculateTipDistribution` ("employees selected but none of them are named... and there's no unnamed-selected bucket") is unreachable via the public function signature: whenever `matched.length === 0`, `selectedButUnnamed` is by construction the full (non-empty, since we're past the `selectedEmployeeIds.length === 0` early return) `selectedEmployeeIds` array, so the `selectedButUnnamed.length > 0` branch always wins first. Confirmed by writing the full test matrix — no realistic input reaches it. Not fixing (the comment itself says "shouldn't normally happen", it's defensive), just documenting so nobody burns time trying to hit it with a 17th test case.

- **[FIXED]** `integrations/stripe/services/stripe-accounts..service.ts` — `getConnectedBalance`/`listBalanceTransactions`/`listCharges`/`listPayouts` called the Stripe SDK inside `try { return this.stripe.X.list(...); }` without `await`, so a rejected promise was returned as-is to the caller — the `catch (error) { throw new error; }` (itself buggy: `new error` throws `TypeError: error is not a constructor`) never actually ran for async rejections. Fixed to `return await this.stripe.X.list(...)` + `throw error;`. Externally-visible behavior is unchanged (the original Stripe error still propagates unwrapped) but now via an intentional, correct path.
- **[FIXED]** `integrations/storage/gcs/gcs.adapter.ts:42-72` — `uploadImage`'s write-stream `error` event rejected the returned Promise directly with the raw error, bypassing the method's outer `try/catch`, unlike every other error path in the same method (which wrap as `"Failed to upload image: ..."`). Fixed by wrapping the stream-error rejection the same way.
- **[FIXED]** `modules/auth/controllers/email.controller.ts` — `registerWithEmail` wrapped `return this.authService.registerWithEmail(dto)` in a try/catch with an empty catch body that was dead code (the call wasn't `await`ed, so a rejection propagated regardless). Removed the pointless try/catch; behavior unchanged.
- **[FIXED]** `integrations/stripe/services/stripe-payments-webhooks.service.ts` — two `switch` cases in `handleStripeWebhook` were missing a trailing `break`: `'customer.updated'` fell into `'payment_method.detached'` (harmless, both bodies commented out); `'charge.failed'` (when its early inner `break` wasn't hit) fell into `'charge.updated'`'s *live* code, unintentionally calling `stripePaymentsService.getBalanceTransaction(...)` on a charge.failed event. Added the missing `break`s.
- **[FIXED]** `integrations/stripe/services/stripe-products.service.ts` — `getPrice` returned `unit_amount` in raw cents, while `createPrice`/`listPrices` both divide by 100. Made `getPrice` consistent with the other two.

_(Agent: append new findings here as you go, in the same terse file/line + one-sentence style.)_
