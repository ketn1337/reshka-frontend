---

## description: Use this skill to review current code changes in the Reshka project before commit or merge. It should inspect git diff, identify risky changes, check React and TypeScript issues, verify booking/admin/API impact, detect secrets or config mistakes, and report findings before modifying code. Do not use this skill for implementing new features directly.

# Reshka Code Review Skill

You are reviewing current code changes in the Reshka project.

This skill is for pre-commit or pre-merge review. The goal is to identify defects, risky changes, missing validation, inconsistent data flow, broken UI behavior, API contract problems, booking flow regressions, admin inconsistencies, and accidental secret/config changes.

User request:

```text
$ARGUMENTS
```

## Primary Goal

Review the current changes before they are committed or merged.

Do not edit code immediately. First provide a structured review with findings, risks, and recommended fixes.

Only modify code if the user explicitly asks you to fix the review findings after the review.

## Use This Skill For

Use this skill for tasks such as:

* reviewing current changes before commit;
* checking `git diff`;
* finding regressions;
* checking TypeScript and React issues;
* checking booking flow impact;
* checking admin booking consistency;
* checking API contract changes;
* checking UI regressions;
* checking accidental edits to config files;
* checking secrets or credentials;
* checking whether documentation should be updated;
* checking whether validation commands should be run.

## Do Not Use This Skill For

Do not use this skill for:

* implementing a new feature from scratch;
* fixing bugs directly without review;
* redesigning UI;
* changing API contracts;
* updating documentation as the primary task;
* release validation after all work is done;
* committing or pushing changes.

If the user asks for implementation, use the relevant implementation skill first.

If the user asks for final release validation, use the release check skill.

## Required First Steps

Start by inspecting the repository state:

```bash
git status --short
git diff --stat
git diff
```

If staged changes exist, also inspect:

```bash
git diff --cached --stat
git diff --cached
```

If the diff is too large, summarize the changed files first and inspect the most important files by risk.

## Required Initial Assessment

Before writing review findings, identify:

```text
Changed files:
Change categories:
High-risk areas:
Validation commands available:
Documentation impact:
Review scope:
```

Then perform the review.

## Review Priorities

Review in this order:

1. Correctness and runtime errors.
2. Booking flow regressions.
3. API contract and data shape changes.
4. Admin booking consistency.
5. Public UI regressions.
6. TypeScript and React issues.
7. Error, loading, and empty states.
8. Security and secrets.
9. Documentation impact.
10. Maintainability.

Do not spend most of the review on style if there are correctness risks.

## Risk Categories

Classify findings as:

```text
Critical
High
Medium
Low
Nit
```

Use these meanings:

* `Critical`: likely crash, data loss, broken booking flow, exposed secret, or impossible build.
* `High`: likely user-visible regression, incorrect booking/admin/API behavior, or broken important path.
* `Medium`: probable bug under specific conditions, missing fallback, incomplete type handling, or maintainability risk.
* `Low`: minor issue, edge case, or small consistency problem.
* `Nit`: style, naming, or formatting suggestion with no functional impact.

## Project Documentation

Read documentation only when relevant to understand the changed area.

Useful files may include:

```text
CLAUDE.md
docs/PROJECT_CONTEXT.md
docs/claude/ARCHITECTURE.md
docs/claude/PUBLIC_APP.md
docs/claude/ADMIN_APP.md
docs/claude/BOOKING_FLOW.md
docs/claude/API.md
docs/claude/UI_GUIDE.md
```

Do not read all documentation by default if the diff is small.

## Public UI Review Rules

For public UI changes, check:

* homepage behavior;
* room cards;
* room detail page;
* room photos and galleries;
* search results;
* booking page;
* confirmation page;
* responsive layout;
* fallback states;
* text readability;
* button/link behavior;
* guest-facing clarity.

For room photos, check:

* image source path;
* local asset usage;
* empty photo arrays;
* `object-cover` versus `object-contain`;
* heavy cropping on detail pages;
* fallback images;
* horizontal photo preference for wide layouts.

## Booking Flow Review Rules

If any booking-related file changed, check:

```text
selectedRoom
roomId
roomName
checkInDate
checkOutDate
nights
guestCount
adults
children
totalPrice
pricePerNight
prepaymentAmount
URL parameters
form defaults
confirmation data
admin booking data
```

Verify that the user can still move through:

```text
Homepage / Rooms
        ↓
SearchResultsPage
        ↓
BookingPage
        ↓
BookingConfirmationPage
```

Check for:

* lost URL parameters;
* invalid date handling;
* off-by-one nights calculation;
* `NaN` prices;
* missing room fallback;
* guest count mismatch;
* inconsistent prepayment;
* confirmation page mismatch.

## Admin Booking Review Rules

If admin booking files changed, check consistency across:

```text
ChessboardPage
BookingsListPage
BookingDetailPage
BookingDetailDrawer
BookingCreateModal
status helpers
```

Check for:

* inconsistent status labels;
* broken status colors;
* broken filters;
* stale drawer data;
* broken date display;
* incorrect chessboard placement;
* missing booking fallbacks;
* booking shape mismatch between create/edit and display;
* public booking data not rendering in admin screens.

## API Review Rules

If API files or types changed, check:

* whether an API client already exists;
* whether a duplicate client was introduced;
* whether base URL is hardcoded;
* whether request types changed;
* whether response types changed;
* whether all consumers were updated;
* whether loading states still work;
* whether error states are handled;
* whether empty responses are handled;
* whether public and admin consumers still agree on shared data.

Do not accept silent API contract changes without checking all consumers.

## React Review Rules

Check for:

* invalid hooks usage;
* missing dependency arrays;
* infinite render or fetch loops;
* stale closures;
* unnecessary duplicated state;
* unsafe optional field access;
* unstable keys;
* incorrect controlled/uncontrolled inputs;
* unnecessary `any`;
* weakened types;
* missing null checks;
* components doing too much unrelated work.

## TypeScript Review Rules

Check for:

* new `any`;
* unsafe casts;
* non-null assertions hiding real issues;
* type definitions not matching actual data;
* duplicated types;
* exported types renamed without updating consumers;
* optional fields treated as required;
* impossible states not handled;
* build-breaking import/export changes.

## Security and Config Review Rules

Check whether changes include:

```text
.env
.env.*
secrets
tokens
API keys
private URLs
deployment credentials
package-lock changes
CI/CD config
Vite config
proxy config
auth-related code
```

Do not expose secrets in the review output. If a secret is found, state that a secret-like value appears in a file and recommend removing/rotating it, but do not repeat the value.

## Documentation Review Rules

Check whether documentation should be updated when changes affect:

* architecture;
* booking flow;
* API contracts;
* admin booking behavior;
* public app structure;
* UI conventions;
* setup or validation commands.

Do not update documentation during review unless explicitly requested. Only report the documentation impact.

## Validation Commands

Inspect `package.json` and identify available checks.

Possible commands:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

Do not invent scripts.

If the user asked for review only, you may recommend validation commands instead of running them. If the user asked to verify, run the smallest relevant available checks.

If validation fails, distinguish:

* failures caused by current changes;
* pre-existing unrelated failures;
* environment/tooling failures.

## Review Output Format

Return the review in this format:

```text
Summary:
- ...

Changed files reviewed:
- ...

Findings:
1. [Severity] Title
   File:
   Problem:
   Impact:
   Recommendation:

2. [Severity] Title
   File:
   Problem:
   Impact:
   Recommendation:

Booking flow impact:
- Selected room: checked / affected / not affected
- Dates: checked / affected / not affected
- Nights: checked / affected / not affected
- Guests: checked / affected / not affected
- Price: checked / affected / not affected
- Prepayment: checked / affected / not affected
- URL parameters: checked / affected / not affected
- Confirmation page: checked / affected / not affected

Admin impact:
- Chessboard: checked / affected / not affected
- Booking list: checked / affected / not affected
- Detail drawer: checked / affected / not affected
- Detail page: checked / affected / not affected
- Create/edit modal: checked / affected / not affected
- Statuses: checked / affected / not affected

API impact:
- API client: checked / affected / not affected
- Request types: checked / affected / not affected
- Response types: checked / affected / not affected
- Consumers: checked / affected / not affected

Validation:
- Available commands:
- Commands run:
- Result:

Documentation impact:
- Needs update: yes / no
- Files likely affected:

Final recommendation:
- Ready to commit / Fix findings first / Needs clarification
```

If there are no findings, say so clearly, but still report what was checked.

## Important Rule

Do not make code changes during the review phase.

If fixes are needed, ask the user whether to apply them or provide a separate patch plan.
