---

## description: Use this skill for final pre-release or pre-push validation in the Reshka project. It should inspect project scripts, run available checks such as typecheck, lint, build, and tests, review git status, detect risky uncommitted changes, and report whether the project is ready to push or deploy. Do not use this skill for implementing features or fixing code directly.

# Reshka Release Check Skill

You are performing a final release, push, or deployment readiness check for the Reshka project.

This skill is for validating the current repository state before the user pushes, deploys, merges, or considers the work complete.

User request:

```text id="rtz5si"
$ARGUMENTS
```

## Primary Goal

Determine whether the project is ready for push, merge, or deployment.

Do not implement new features.

Do not refactor code.

Do not commit, push, deploy, or publish anything unless the user explicitly asks for that specific action after the check.

## Use This Skill For

Use this skill for tasks such as:

* final check before push;
* final check before deploy;
* validating the project after changes;
* checking whether the build passes;
* checking whether TypeScript passes;
* checking whether lint passes;
* checking whether tests pass;
* checking git status before commit;
* checking risky changed files;
* checking whether documentation is stale;
* checking whether secrets or environment files were accidentally changed;
* summarizing release readiness.

## Do Not Use This Skill For

Do not use this skill for:

* implementing new features;
* fixing bugs directly;
* redesigning UI;
* changing API contracts;
* updating documentation as the main task;
* reviewing code without running validation;
* committing or pushing changes automatically.

If problems are found, report them first. Only fix them if the user explicitly asks.

## Required First Steps

Start by inspecting the repository state:

```bash id="3ohano"
git status --short
git diff --stat
```

If staged changes exist, also inspect:

```bash id="rlqaou"
git diff --cached --stat
```

Then inspect `package.json` to identify available scripts.

Do not assume scripts exist.

## Script Detection Rules

Read `package.json` and identify available validation commands.

Common scripts may include:

```bash id="64g4no"
npm run typecheck
npm run lint
npm run build
npm test
```

Only run scripts that actually exist.

If the project uses another package manager, follow the existing project files:

```text id="quvl94"
package-lock.json -> npm
pnpm-lock.yaml -> pnpm
yarn.lock -> yarn
bun.lockb or bun.lock -> bun
```

Do not switch package managers.

## Required Initial Assessment

Before running validation, identify:

```text id="jcytm7"
Repository state:
Package manager:
Available scripts:
Changed files:
High-risk changed files:
Validation plan:
```

Then run the smallest reasonable validation set for release readiness.

## Recommended Validation Order

Run checks in this order when available:

1. Type checking.
2. Linting.
3. Tests.
4. Production build.

Example:

```bash id="mhfbw4"
npm run typecheck
npm run lint
npm test
npm run build
```

If one check fails, decide whether continuing is useful:

* Continue if later checks can provide additional independent signal.
* Stop if the failure prevents later checks from running meaningfully.
* Report clearly what was skipped and why.

## Git State Rules

Check for:

* uncommitted changes;
* staged changes;
* untracked files;
* generated files;
* accidental build artifacts;
* accidental lockfile changes;
* accidental `.env` changes;
* deleted files;
* large unexpected file additions;
* changes outside the expected task scope.

Do not discard, reset, stash, commit, or push changes unless explicitly requested.

## High-Risk Files

Pay special attention to changes in:

```text id="zmrxi4"
.env
.env.*
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
vite.config.*
tsconfig*.json
eslint.config.*
.github/
Dockerfile
docker-compose*
src/api/
src/types/
src/booking.ts
src/roomInventory.ts
src/admin/
docs/claude/
docs/PROJECT_CONTEXT.md
```

If any of these changed, mention them in the final report.

## Secret and Config Safety

Check whether changed files include:

* secrets;
* tokens;
* API keys;
* private backend URLs;
* credentials;
* local-only paths;
* machine-specific config;
* accidental `.env` commits.

Do not print secret values in the final response.

If a secret-like value is found, say that a secret-like value appears in a specific file and recommend removing it and rotating the credential.

## Booking Flow Release Checks

If booking-related files changed, verify the affected subset of:

```text id="cv0pej"
selected room
room ID
check-in date
check-out date
number of nights
guest count
price
prepayment
URL parameters
booking form
confirmation page
admin booking display
```

Relevant files may include:

```text id="nynjoe"
src/booking.ts
src/roomInventory.ts
src/data.ts
src/pages/SearchResultsPage.tsx
src/pages/BookingPage.tsx
src/pages/BookingConfirmationPage.tsx
src/components/BookingForm.tsx
```

Do not manually test in the browser unless the environment supports it. If browser testing was not performed, state that clearly.

## Public UI Release Checks

If public UI files changed, check for:

* broken imports;
* missing assets;
* incorrect image paths;
* room photo fallback;
* empty array handling;
* responsive layout risks;
* unreadable text on images;
* broken navigation;
* broken booking CTA behavior.

Relevant areas may include:

```text id="m1vcag"
src/components/
src/pages/
src/photos/
```

## Admin Release Checks

If admin files changed, check consistency across:

```text id="5nz2ga"
ChessboardPage
BookingsListPage
BookingDetailPage
BookingDetailDrawer
BookingCreateModal
status helpers
```

Verify that changed admin booking data still has consistent display, statuses, filters, and fallbacks.

## API Release Checks

If API-related files changed, check:

* no duplicate API client was introduced;
* no base URL was hardcoded;
* request types still match consumers;
* response types still match consumers;
* error states are handled;
* loading states are handled;
* empty states are handled;
* public and admin consumers still compile.

Relevant areas may include:

```text id="cuf5gy"
src/api/
src/types/
src/booking.ts
src/admin/
src/pages/
```

## Documentation Release Checks

Check whether documentation should be updated.

Documentation may need updates if the changes affect:

* architecture;
* API contracts;
* booking flow;
* admin booking behavior;
* public app structure;
* reusable UI rules;
* setup commands;
* validation scripts.

Do not update documentation during release check unless the user explicitly asks.

Only report whether documentation appears stale.

## Build Artifact Rules

Check for accidental generated output in git status.

Examples:

```text id="18krpg"
dist/
build/
coverage/
node_modules/
.vite/
.cache/
.DS_Store
*.log
```

Do not delete files automatically. Report suspicious artifacts.

## Dependency Rules

If dependencies changed:

* inspect `package.json`;
* inspect the lockfile;
* check whether the dependency is necessary;
* check whether package manager usage is consistent;
* mention dependency changes in the final report.

Do not install new packages unless required for validation and consistent with the project setup.

## Validation Failure Rules

When a command fails:

1. Capture the command.
2. Capture the relevant error summary.
3. Identify whether it appears related to current changes.
4. Identify the files involved if possible.
5. Recommend the next action.

Do not paste huge logs. Summarize the useful part.

If the failure is caused by missing dependencies or environment setup, state that separately.

## Release Decision Rules

Use one of these final decisions:

```text id="jmlo5x"
Ready to push
Ready with warnings
Not ready
Blocked by environment
```

Meanings:

* `Ready to push`: validation passed and no serious risks found.
* `Ready with warnings`: validation passed or mostly passed, but there are non-blocking concerns.
* `Not ready`: validation failed or serious risks were found.
* `Blocked by environment`: validation could not run because of missing dependencies, unavailable tooling, or local environment problems.

Do not say the project is ready if build/typecheck/lint failed due to likely code issues.

## Final Response Format

End with this report:

```text id="p3zsz6"
Release check:
- Decision: Ready to push / Ready with warnings / Not ready / Blocked by environment

Repository state:
- Branch:
- Changed files:
- Staged changes:
- Untracked files:
- High-risk files:

Validation:
- Package manager:
- Available scripts:
- Commands run:
- Result:

Checks:
- TypeScript: passed / failed / not available / not run
- Lint: passed / failed / not available / not run
- Tests: passed / failed / not available / not run
- Build: passed / failed / not available / not run

Impact review:
- Public UI: checked / affected / not affected
- Booking flow: checked / affected / not affected
- Admin bookings: checked / affected / not affected
- API layer: checked / affected / not affected
- Documentation: up to date / update recommended / not checked
- Secrets/config: clear / warning / not checked

Issues:
1. [Severity] Title
   Problem:
   Evidence:
   Recommendation:

Final recommendation:
- ...
```

If there are no issues, write:

```text id="a1b796"
Issues:
- No blocking issues found.
```

## Important Rule

Do not commit, push, deploy, reset, clean, stash, or delete files during this skill unless the user explicitly requests that exact action.
