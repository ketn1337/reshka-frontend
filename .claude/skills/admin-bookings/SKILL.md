---

## description: Use this skill for admin-side booking work in the Reshka project: booking chessboard, booking list, booking detail page, booking detail drawer, booking creation/edit modal, booking statuses, filters, admin booking display, and consistency between admin booking screens. Do not use this skill for public UI-only changes, API-only refactors, or general visual homepage work.

# Reshka Admin Bookings Skill

You are working on the admin booking area of the Reshka project.

This skill is for tasks that affect how bookings are displayed, created, edited, filtered, inspected, or managed in the admin interface.

User request:

```text
$ARGUMENTS
```

## Primary Goal

Keep admin booking data consistent across all admin views.

Admin booking changes must not be made in isolation. A booking shown in the chessboard, list, detail page, drawer, and create/edit modal must represent the same data and status rules.

## Use This Skill For

Use this skill for tasks such as:

* fixing the booking chessboard;
* changing booking display in the admin panel;
* fixing booking list behavior;
* changing booking filters;
* fixing booking status labels;
* changing booking status transitions;
* fixing booking detail drawer;
* fixing booking detail page;
* fixing booking create/edit modal;
* adding or changing admin booking fields;
* checking consistency between admin booking screens;
* connecting externally received bookings to the admin view;
* checking how public booking data appears in the admin panel.

## Do Not Use This Skill For

Do not use this skill for:

* homepage-only changes;
* public room card design;
* public room detail page design;
* public booking page visuals only;
* API-only refactors;
* backend-only changes;
* documentation-only updates;
* release checks;
* general code review.

If the task mainly affects guest-facing booking behavior, use the booking flow skill instead.

If the task mainly affects API contracts, use the API change skill instead.

## Relevant Project Areas

Start by inspecting the actual project structure.

Commonly relevant files:

```text
src/admin/ChessboardPage.tsx
src/admin/BookingsListPage.tsx
src/admin/BookingDetailPage.tsx
src/admin/BookingDetailDrawer.tsx
src/admin/BookingCreateModal.tsx
src/admin/status.ts
```

Other potentially relevant areas:

```text
src/api/
src/types/
src/booking.ts
src/roomInventory.ts
src/data.ts
src/pages/BookingPage.tsx
src/pages/BookingConfirmationPage.tsx
```

If the project structure differs, adapt to the actual files instead of assuming these exact paths.

## Project Documentation

Read documentation only when relevant.

For admin booking tasks, these files are usually relevant:

```text
CLAUDE.md
docs/PROJECT_CONTEXT.md
docs/claude/ADMIN_APP.md
docs/claude/BOOKING_FLOW.md
docs/claude/API.md
```

Do not read all documentation files by default for a small local fix.

## Required Initial Assessment

Before editing code, identify:

```text
Task:
Affected admin area:
Booking data involved:
Screens that may be impacted:
Files to inspect:
Minimal change plan:
Validation:
```

Then inspect the relevant files and apply the smallest correct change.

Do not start with a broad admin rewrite.

## Admin Booking Screens That Must Stay Consistent

When changing booking behavior, check the affected subset of these screens:

```text
ChessboardPage
BookingsListPage
BookingDetailPage
BookingDetailDrawer
BookingCreateModal
status helpers
```

A change in one screen must not create inconsistent booking names, dates, prices, statuses, guest data, or room data in another screen.

## Booking Data Fields

Always verify the affected subset of these fields:

```text
bookingId
roomId
roomName
guestName
guestPhone
guestEmail
checkInDate
checkOutDate
nights
guestCount
adults
children
totalPrice
prepaymentAmount
status
source
comment
createdAt
updatedAt
```

Use the actual field names from the codebase. Do not invent new names if the project already has established booking types.

## Chessboard Rules

For chessboard changes:

* preserve date alignment;
* preserve room rows;
* preserve booking placement by date range;
* prevent visual overlap unless overlapping bookings are explicitly supported;
* keep status colors consistent with the rest of the admin panel;
* check long bookings across multiple days;
* check one-night bookings;
* check empty rooms;
* check bookings with missing optional fields;
* do not break horizontal or vertical scrolling;
* do not make cells unreadable on smaller screens.

The chessboard is a business-critical view. Treat layout and data mapping carefully.

## Booking List Rules

For booking list changes:

* preserve sorting behavior unless the task requires changing it;
* preserve filters unless the task requires changing them;
* preserve status display;
* preserve date formatting;
* preserve room and guest display;
* keep row actions clear;
* handle empty lists;
* handle incomplete booking data safely;
* avoid showing technical values directly to admins when a readable label exists.

If filters are changed, verify that filter logic matches the displayed status and date fields.

## Booking Detail Drawer Rules

For drawer changes:

* preserve the selected booking;
* avoid stale booking data when switching between bookings;
* close behavior must remain predictable;
* displayed fields must match the list and detail page;
* status labels must match shared status helpers;
* missing optional data must not crash the drawer;
* actions must not mutate booking data unexpectedly.

Do not duplicate complex booking formatting logic in the drawer if shared helpers already exist.

## Booking Detail Page Rules

For detail page changes:

* verify loading by booking ID;
* handle unknown booking ID safely;
* show room, guest, dates, nights, price, prepayment, status, and comments if present;
* keep status display consistent with the list, drawer, and chessboard;
* avoid exposing raw internal identifiers unless useful for admin operations;
* preserve navigation back to admin booking list or chessboard.

## Booking Create/Edit Modal Rules

For create/edit modal changes:

* preserve controlled input behavior;
* avoid clearing user-entered data unexpectedly;
* validate required fields;
* preserve existing date constraints;
* preserve room selection;
* preserve guest fields;
* preserve status selection;
* handle default values safely;
* do not submit invalid booking data;
* do not create a booking shape that other admin screens cannot render.

If the modal creates or edits bookings used by the chessboard, verify the chessboard can render the resulting data.

## Status Rules

For booking status changes:

* inspect shared status definitions first;
* do not duplicate status labels in multiple files if a shared helper exists;
* keep status colors consistent;
* keep status labels readable;
* verify all screens that display statuses;
* check filters that depend on statuses;
* avoid breaking existing stored status values.

Common status-related file:

```text
src/admin/status.ts
```

Use the actual status model from the codebase.

## Public Booking Impact

If admin data is connected to public booking data, verify that changes do not break:

* public booking submission;
* confirmation page data;
* room selection;
* date range;
* price;
* prepayment;
* guest data;
* admin display of newly created public bookings.

Do not change public booking data shape without checking public booking consumers.

## API Rules

If the task touches API calls:

* inspect `src/api/` first;
* do not create a second API client;
* do not hardcode base URLs;
* preserve existing request and response types;
* update all consumers if a type changes;
* do not change backend-facing contracts unless explicitly required;
* if an API contract changes, check admin screens and public booking screens that consume it.

If the task is purely admin UI and does not require API changes, do not modify API code.

## React and TypeScript Rules

When editing React and TypeScript:

* keep types strict;
* avoid `any`;
* preserve existing component boundaries;
* avoid duplicating booking calculations in multiple admin components;
* prefer shared helpers for formatting dates, prices, statuses, and labels;
* handle `null`, `undefined`, empty strings, empty arrays, and missing optional fields;
* do not weaken types to bypass real admin data issues.

## UI and UX Rules for Admin

The admin interface should be functional, dense enough for operations, and clear.

Prioritize:

* data readability;
* predictable controls;
* clear status labels;
* clear filters;
* useful empty states;
* stable layout;
* minimal visual noise;
* consistency between screens.

Do not make admin screens look like the public marketing site unless the existing project style already does so.

## Required Consistency Checks

Before finalizing, check the affected path manually in code:

```text
Can the booking be displayed in the chessboard?
Can the booking be displayed in the list?
Can the booking be opened in the drawer?
Can the booking be opened on the detail page?
If edited or created, can the resulting booking still render everywhere?
Are statuses displayed consistently?
Are dates displayed consistently?
Are missing optional fields handled safely?
```

## Validation

After changes, inspect `package.json` and run the smallest relevant available check.

Prefer, if available:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

Only run commands that exist.

If validation fails because of pre-existing unrelated errors, report that clearly and separate those errors from the current change.

## Documentation Updates

Do not update documentation by default.

Update documentation only if:

* the user explicitly asks for documentation updates;
* admin booking behavior changed intentionally;
* a booking data contract changed;
* a new admin booking rule was added.

Relevant documentation may include:

```text
docs/claude/ADMIN_APP.md
docs/claude/BOOKING_FLOW.md
docs/claude/API.md
docs/PROJECT_CONTEXT.md
```

## Final Response Format

End with a concise report:

```text
Done:
- ...

Changed files:
- ...

Admin booking consistency:
- Chessboard: checked / changed / not affected
- Booking list: checked / changed / not affected
- Detail drawer: checked / changed / not affected
- Detail page: checked / changed / not affected
- Create/edit modal: checked / changed / not affected
- Statuses: checked / changed / not affected
- Public booking impact: checked / not affected

Validation:
- ...

Notes:
- ...
```

If no code change was made, explain exactly why.
