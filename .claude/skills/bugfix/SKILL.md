---

## description: Use for small, localized bug fixes in the Reshka frontend. Apply when the user reports a broken UI element, incorrect rendering, runtime crash, bad image display, wrong click behavior, empty-state error, or other concrete defect that should be fixed with minimal changes.

# Reshka Bugfix Skill

You are fixing a concrete bug in the Reshka project.

This skill is for small and medium defects only. It is not for redesigns, large refactors, architecture changes, new features, API redesigns, or documentation updates.

User request:

```text
$ARGUMENTS
```

## Main Objective

Find the smallest correct fix for the reported problem, apply it safely, and verify that the change does not break related behavior.

Prefer a targeted patch over rewriting entire components.

## Required Behavior

Follow this workflow:

1. Understand the reported bug.
2. Identify the smallest relevant file set.
3. Read project context only when needed.
4. Inspect the affected component, helper, type, or style.
5. Find the likely root cause.
6. Apply the minimal fix.
7. Run the smallest relevant validation command.
8. Summarize what was changed and why.

Do not make broad unrelated improvements.

## Project Context Files

Use these files only when they are relevant to the bug:

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

Do not read all documentation by default. Start from the user’s bug report and the affected code.

## Typical Bug Areas

For public UI bugs, inspect files such as:

```text
src/components/
src/pages/
src/booking.ts
src/roomInventory.ts
src/data.ts
```

For room/photo/card issues, inspect likely files such as:

```text
src/components/Rooms.tsx
src/pages/RoomViewPage.tsx
src/pages/SearchResultsPage.tsx
src/pages/BookingPage.tsx
src/photos/
src/data.ts
src/roomInventory.ts
```

For admin booking bugs, inspect likely files such as:

```text
src/admin/ChessboardPage.tsx
src/admin/BookingsListPage.tsx
src/admin/BookingDetailPage.tsx
src/admin/BookingDetailDrawer.tsx
src/admin/BookingCreateModal.tsx
src/admin/status.ts
```

For API-related bugs, inspect likely files such as:

```text
src/api/
src/types/
```

Adjust the file set based on the actual project structure.

## Constraints

Do not:

* rewrite a whole component when a small patch is enough;
* introduce a new architecture;
* rename public types or exported functions unless necessary;
* change booking rules unless the bug is specifically in booking logic;
* change API contracts unless the bug is specifically caused by the contract;
* add new dependencies unless there is no reasonable alternative;
* edit documentation for a local bugfix;
* change formatting across unrelated files;
* modify `.env`, secrets, credentials, deployment config, or unrelated settings;
* run destructive commands;
* commit or push changes unless the user explicitly asks.

## Image and Gallery Bug Rules

If the bug is about room photos, cards, gallery, or image cropping:

1. Check how the image source is built.
2. Check whether the path should use local assets such as `src/photos/...`.
3. Check whether the component uses `object-cover`, `object-contain`, fixed height, overflow, or background blur.
4. Prefer preserving the full room image over aggressive cropping.
5. For main room images, prefer horizontal images when available.
6. If a blurred background is used, keep the foreground image readable and not overly cropped.
7. Do not replace the full gallery system unless the existing approach is clearly broken.

Expected visual behavior:

* preview cards may crop slightly if the design requires it;
* detailed room pages should avoid cutting off important parts of the image;
* horizontal photos should be preferred for wide display areas;
* fallback images must not crash the page.

## React and TypeScript Rules

When fixing React/TypeScript code:

* preserve existing component boundaries;
* preserve existing props unless a prop is demonstrably wrong;
* keep types explicit where the surrounding code already uses explicit types;
* avoid `any` unless the surrounding code already uses it and there is no better local option;
* handle `null`, `undefined`, and empty arrays where the bug indicates missing data;
* avoid duplicated state if derived state is enough;
* avoid changing route names unless the bug is routing-specific.

## Booking Bug Rules

If the bug touches booking behavior, verify these data points:

* selected room;
* check-in date;
* check-out date;
* number of nights;
* guest count;
* price;
* prepayment;
* URL parameters;
* transition between search results, booking page, and confirmation page.

Do not change business rules silently. If the current behavior is ambiguous, make the smallest safe fix and clearly mention the assumption.

## Admin Booking Bug Rules

If the bug touches admin booking screens, check related views together:

* chessboard;
* booking list;
* booking detail page;
* booking detail drawer;
* booking create/edit modal;
* status labels and status transitions.

Do not fix one admin screen in a way that creates inconsistent display in another admin screen.

## Investigation Discipline

Before editing code, identify:

```text
Bug:
Likely affected files:
Likely cause:
Minimal fix:
Validation:
```

If the cause is not obvious, inspect one layer outward:

* caller component;
* shared helper;
* shared data/type;
* CSS/Tailwind classes;
* API response shape;
* route/query parameter builder.

Do not keep expanding the investigation without evidence.

## Validation

After the fix, run the smallest relevant check available in the project.

Prefer, in this order:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

Only run commands that exist in `package.json`.

If no validation script exists, at least explain what was manually checked in the code.

If a command fails because of pre-existing unrelated errors, report that clearly and separate it from the bugfix.

## Output Format

At the end, respond with:

```text
Fixed:
- ...

Changed files:
- ...

Validation:
- ...

Notes:
- ...
```

Keep the summary short and specific.

If no code change was made, explain why and state the exact file or condition that blocked the fix.
