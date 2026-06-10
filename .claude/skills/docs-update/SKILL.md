---

## description: Use this skill to update Reshka project documentation after meaningful code or architecture changes. It is intended for maintaining docs/PROJECT_CONTEXT.md and docs/claude/*.md without changing application code. Use it after feature work, API changes, booking flow changes, admin changes, architecture changes, or when project documentation is stale. Do not use it for small local bug fixes unless documentation is affected.

# Reshka Docs Update Skill

You are updating project documentation for the Reshka project.

This skill is for maintaining concise, useful, agent-oriented documentation. The goal is to keep future Claude Code sessions efficient by documenting project structure, architecture, business rules, API contracts, booking flow, admin behavior, and important implementation decisions.

User request:

```text id="wct5pj"
$ARGUMENTS
```

## Primary Goal

Update only the documentation that is actually affected by the recent changes.

Do not modify application code.

Do not rewrite all documentation unless the user explicitly asks for a full documentation refresh.

Keep documentation compact, accurate, and useful for future agents.

## Use This Skill For

Use this skill after:

* meaningful feature changes;
* booking flow changes;
* admin booking changes;
* API contract changes;
* route changes;
* data model changes;
* architecture changes;
* major UI structure changes;
* new important components or modules;
* removal of obsolete files or flows;
* changes that future Claude Code sessions must know about.

Use this skill when the user says things like:

* update docs;
* refresh project context;
* update Claude docs;
* document recent changes;
* sync documentation with code;
* update `docs/PROJECT_CONTEXT.md`;
* update `docs/claude/*.md`.

## Do Not Use This Skill For

Do not use this skill for:

* writing application code;
* fixing bugs;
* changing UI;
* changing API clients;
* refactoring components;
* running release checks;
* updating README unless explicitly requested;
* documenting tiny visual tweaks that do not affect project understanding.

If the user asks for both code changes and docs, complete the code task first with the correct skill, then use this skill only for the documentation update.

## Documentation Scope

Main documentation files may include:

```text id="3d6nfo"
docs/PROJECT_CONTEXT.md
docs/claude/ARCHITECTURE.md
docs/claude/PUBLIC_APP.md
docs/claude/ADMIN_APP.md
docs/claude/BOOKING_FLOW.md
docs/claude/API.md
docs/claude/UI_GUIDE.md
```

If the project has additional documentation files, inspect them only when relevant.

Do not assume every file must be edited.

## Required Initial Assessment

Before editing documentation, identify:

```text id="nz454k"
Change summary:
Affected documentation files:
Files to inspect:
Documentation sections to update:
Obsolete information to remove:
Information that should not be documented:
Validation:
```

Then inspect only the relevant source code and documentation.

## Source of Truth

Code is the source of truth.

Before updating documentation:

1. Inspect relevant code files.
2. Inspect current documentation.
3. Compare documentation against the actual implementation.
4. Update only stale or missing information.
5. Remove outdated statements when necessary.

Do not document assumptions as facts.

If something is unclear, write it as a known limitation or omit it.

## Documentation Style

Documentation must be:

* concise;
* factual;
* implementation-oriented;
* useful for future agents;
* easy to scan;
* free of marketing language;
* free of long generic explanations;
* specific to the Reshka project.

Prefer:

```text id="pmmehy"
What exists
Where it is implemented
How data flows
What must not be broken
What files are important
What assumptions are currently true
```

Avoid:

```text id="1bpb9t"
Generic React explanations
Generic TypeScript explanations
Long tutorials
Speculative plans
Duplicate descriptions
Outdated TODOs
Unverified architecture claims
```

## Documentation Size Rules

Do not let documentation grow without control.

When adding information:

* remove outdated content;
* merge duplicate sections;
* prefer short bullet points;
* avoid repeating the same rule in multiple files;
* put details in the most specific document;
* keep `PROJECT_CONTEXT.md` as a high-level index and orientation file.

Do not turn documentation into a full code dump.

## File Responsibility

Use this split unless the existing documentation structure says otherwise.

### `docs/PROJECT_CONTEXT.md`

Use for high-level project orientation:

* project purpose;
* main app areas;
* key directories;
* current architecture summary;
* important workflows;
* where to look for details;
* current known constraints.

Do not overload it with detailed API or component documentation.

### `docs/claude/ARCHITECTURE.md`

Use for:

* frontend architecture;
* routing structure;
* state/data flow;
* module boundaries;
* major design decisions;
* integration between public app, admin app, and API layer.

### `docs/claude/PUBLIC_APP.md`

Use for:

* public website pages;
* guest-facing user flow;
* room catalog;
* room detail pages;
* search results;
* booking entry points;
* public UI behavior.

### `docs/claude/ADMIN_APP.md`

Use for:

* admin panel structure;
* booking chessboard;
* booking list;
* booking detail page;
* booking detail drawer;
* booking create/edit modal;
* statuses;
* admin-only workflows.

### `docs/claude/BOOKING_FLOW.md`

Use for:

* booking lifecycle;
* selected room transfer;
* dates;
* nights;
* guests;
* price;
* prepayment;
* URL parameters;
* public-to-admin booking consistency;
* booking-related helpers.

### `docs/claude/API.md`

Use for:

* API client structure;
* endpoints used by frontend;
* request and response types;
* frontend/backend contracts;
* error handling patterns;
* loading and empty states;
* environment configuration relevant to API access.

### `docs/claude/UI_GUIDE.md`

Use for:

* visual rules;
* shared UI patterns;
* room cards;
* image behavior;
* gallery behavior;
* responsive layout expectations;
* guest-facing UI conventions;
* admin UI conventions only if no separate UI doc exists.

## Code Inspection Rules

Inspect code only where needed.

Possible relevant areas:

```text id="7wijxy"
src/components/
src/pages/
src/admin/
src/api/
src/types/
src/booking.ts
src/roomInventory.ts
src/data.ts
src/photos/
package.json
```

Do not scan the entire repository unless the user asks for a full documentation audit.

## What to Document

Document information that future agents need to avoid mistakes:

* important file locations;
* current data flow;
* booking parameter names;
* API contract assumptions;
* room data source;
* status values;
* route structure;
* shared helpers;
* known fallbacks;
* important UI behavior;
* validation commands;
* project-specific constraints.

## What Not to Document

Do not document:

* temporary implementation details;
* obvious code syntax;
* every component prop;
* every CSS class;
* every small visual tweak;
* speculative future ideas unless explicitly marked;
* secrets or credentials;
* local machine-only paths unless they are required project setup;
* copied code blocks unless necessary.

## Booking Documentation Rules

If booking behavior changed, verify and document the affected subset of:

```text id="dd3exi"
selected room
room ID
check-in date
check-out date
number of nights
guest count
price
prepayment
URL parameters
form defaults
confirmation page
admin booking display
```

Do not document booking rules that are not implemented.

## API Documentation Rules

If API behavior changed, verify and document:

```text id="zsqw61"
API client location
endpoint
method
request shape
response shape
types
consumers
error handling
loading state
empty state
environment variable usage
```

Do not document backend behavior unless it is visible in the current repository or explicitly provided by the user.

## Admin Documentation Rules

If admin behavior changed, verify and document:

```text id="jd6sdy"
booking chessboard
booking list
booking detail page
booking detail drawer
booking create/edit modal
status helpers
filters
date display
booking data shape
```

Keep admin documentation consistent with actual admin screens.

## Public UI Documentation Rules

If public UI behavior changed, verify and document:

```text id="4dhyy7"
homepage sections
room cards
room detail page
photo/gallery behavior
search results
booking page entry points
responsive behavior
fallback states
```

Do not document purely aesthetic changes unless they establish a reusable UI rule.

## Accuracy Rules

Never write documentation that sounds certain if it was not verified.

Use precise wording:

```text id="si3xpk"
Currently implemented:
The current flow is:
The relevant files are:
This helper is used for:
This screen reads data from:
```

Avoid vague wording:

```text id="2xevsv"
Probably
Maybe
Should eventually
Might be intended
Seems like
```

If uncertainty remains, either inspect more code or write a clearly labeled note.

## Documentation Update Strategy

Prefer surgical edits:

1. Update stale section.
2. Add missing compact section.
3. Remove obsolete statement.
4. Merge duplicate notes.
5. Keep headings stable when possible.

Do not rewrite a document from scratch unless:

* the file is empty;
* the current document is mostly obsolete;
* the user explicitly asks for a full rewrite.

## Validation

After documentation edits:

* check that markdown headings are coherent;
* check that links or file paths are valid where practical;
* check that no outdated contradiction remains nearby;
* check that no application code was changed;
* optionally run a grep/search for old terms if replacing concepts.

If the repository has documentation validation scripts, run them only if relevant and available.

Do not run full application build just for documentation unless the project requires it.

## Final Response Format

End with a concise report:

```text id="rtcv8r"
Done:
- ...

Changed documentation:
- ...

Source files inspected:
- ...

Not changed:
- ...

Validation:
- ...

Notes:
- ...
```

If no documentation was changed, explain exactly why.

If documentation could not be updated because the implementation was unclear, state what was inspected and what information was missing.
