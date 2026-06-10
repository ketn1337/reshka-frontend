---

## description: Use this skill for any task that affects the Reshka booking flow: room selection, check-in and check-out dates, nights calculation, guest count, price calculation, prepayment, URL parameters, search results, booking page, confirmation page, and the connection between public booking UI and booking data. Do not use this skill for purely visual changes that do not affect booking behavior.

# Reshka Booking Flow Skill

You are working on the booking flow of the Reshka project.

This skill is for tasks that affect how a guest searches for a room, selects dates, chooses a room, enters booking data, sees prices, confirms a booking, or transfers booking data between pages.

User request:

```text
$ARGUMENTS
```

## Primary Goal

Preserve booking correctness.

Any change to the booking flow must keep dates, selected room, guest count, nights, price, prepayment, URL parameters, and confirmation data consistent across the public website.

Do not treat booking tasks as isolated UI edits. Booking flow changes usually affect several files.

## Use This Skill For

Use this skill for tasks such as:

* changing date handling;
* fixing check-in or check-out behavior;
* fixing nights calculation;
* changing guest count logic;
* fixing selected room transfer;
* changing room availability logic;
* fixing search results;
* fixing transition from search to booking;
* fixing transition from booking to confirmation;
* changing price display;
* changing price calculation;
* changing prepayment calculation;
* fixing booking URL parameters;
* fixing booking form defaults;
* adding or changing booking fields;
* connecting public booking data with admin booking data;
* validating that booking data is consistent.

## Do Not Use This Skill For

Do not use this skill for:

* purely visual room card changes;
* homepage-only design changes;
* admin-only visual changes;
* API-only refactors;
* documentation-only updates;
* release checks;
* general code review;
* unrelated bug fixes.

If the task is only visual and does not affect booking data, use the public UI or bugfix skill instead.

## Relevant Project Areas

Start by inspecting the actual project structure.

Commonly relevant files and areas:

```text
src/booking.ts
src/roomInventory.ts
src/data.ts
src/api/
src/types/
src/pages/SearchResultsPage.tsx
src/pages/BookingPage.tsx
src/pages/BookingConfirmationPage.tsx
src/components/BookingForm.tsx
src/components/Rooms.tsx
```

Admin-related files may also be relevant if booking data must appear in the admin panel:

```text
src/admin/ChessboardPage.tsx
src/admin/BookingsListPage.tsx
src/admin/BookingDetailPage.tsx
src/admin/BookingDetailDrawer.tsx
src/admin/BookingCreateModal.tsx
src/admin/status.ts
```

If the real project structure differs, adapt to the actual files.

## Project Documentation

Read documentation only when relevant.

For booking tasks, these files are usually important:

```text
CLAUDE.md
docs/PROJECT_CONTEXT.md
docs/claude/BOOKING_FLOW.md
docs/claude/PUBLIC_APP.md
docs/claude/ADMIN_APP.md
docs/claude/API.md
```

Do not read every documentation file by default unless the booking task is broad or unclear.

## Required Initial Assessment

Before editing code, identify:

```text
Task:
Affected booking step:
Data fields involved:
Files to inspect:
Risk areas:
Minimal change plan:
Validation:
```

Then inspect the relevant code.

Do not edit before understanding how booking data moves through the flow.

## Booking Data That Must Stay Consistent

Always verify the affected subset of these fields:

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
bookingStatus
URL parameters
form defaults
confirmation data
admin booking data
```

Use the actual field names from the codebase. Do not invent new names if the project already has established ones.

## Expected Flow

Preserve the intended booking path:

```text
Homepage / Rooms
        ↓
SearchResultsPage
        ↓
BookingPage
        ↓
BookingConfirmationPage
        ↓
Admin booking data, if connected
```

A guest should not lose selected room, dates, guest count, price, or prepayment when moving between pages.

## URL Parameter Rules

If the booking flow uses URL parameters:

* preserve existing parameter names unless a change is explicitly required;
* update all builders and parsers together;
* handle missing parameters safely;
* handle invalid dates safely;
* handle unknown room IDs safely;
* do not allow `NaN`, `undefined`, or broken text to appear in the UI;
* keep generated URLs shareable when that is part of current behavior.

Commonly relevant helpers may include:

```text
buildBookingParams
parseBookingQuery
pushAppPath
formatDateRange
getNights
getGuestLabel
getNightLabel
getPrepaymentAmount
findCatalogRoom
```

Use actual helper names from the codebase.

## Date Handling Rules

For date logic:

* check check-in and check-out order;
* check that check-out is after check-in;
* check nights calculation;
* avoid off-by-one errors;
* avoid timezone-related date shifts where possible;
* preserve display formatting;
* handle empty dates;
* handle invalid dates;
* avoid calculating a negative number of nights.

If changing date parsing or formatting, verify every page that consumes that date.

## Nights Calculation Rules

Nights must be derived from the date range, not manually duplicated in multiple places unless the project already requires it.

Check:

* same-day date range;
* missing check-in;
* missing check-out;
* invalid date;
* check-out before check-in;
* multi-night booking;
* display labels for 1 night, 2-4 nights, and 5+ nights if the project supports Russian labels.

Do not silently change label rules unless the user requested it.

## Guest Count Rules

When changing guest logic:

* preserve adult and child values if they exist separately;
* preserve total guest count if that is the current model;
* check capacity constraints if the project has them;
* prevent negative guest values;
* handle empty or invalid values;
* keep labels readable for guests.

Do not add new capacity rules unless requested.

## Price and Prepayment Rules

When changing pricing:

* identify the source of price data;
* check whether price is per night or total;
* check how nights affect total price;
* check how prepayment is calculated;
* check formatting through `formatCurrency` or the existing equivalent;
* avoid floating-point display artifacts;
* avoid showing `NaN`, `undefined`, or `0` unless it is intentional;
* keep price logic centralized where possible.

Do not change business pricing rules silently. If a rule is ambiguous, preserve the current rule and make only the requested fix.

## Room Selection Rules

When changing selected room logic:

* verify room ID;
* verify room lookup;
* verify fallback for unknown room;
* verify displayed room name;
* verify room photo if displayed;
* verify price and capacity from the same room record;
* verify transition from room details or search results to booking page.

Do not create duplicate room sources unless the project already has them and the task is to reconcile them.

## Booking Form Rules

When editing booking forms:

* preserve controlled input behavior;
* preserve existing validation;
* avoid clearing user-entered data unexpectedly;
* provide safe defaults;
* show user-friendly errors;
* do not expose internal technical errors;
* avoid adding fields that are not consumed anywhere;
* keep form submission consistent with existing data contracts.

## Confirmation Page Rules

The confirmation page must show the same booking data the user selected.

Check:

* room;
* dates;
* nights;
* guests;
* price;
* prepayment;
* guest contact data if present;
* booking status if present.

If data is missing, show a safe fallback or redirect according to current project behavior.

## Public and Admin Consistency

If booking data is used by the admin panel, verify that public-side changes do not break:

* booking list display;
* chessboard display;
* booking detail drawer;
* booking detail page;
* booking creation/edit modal;
* booking statuses.

Do not change public booking data shape without checking admin consumers.

## API Rules

If the task touches API calls:

* inspect `src/api/` first;
* do not create a second API client;
* do not hardcode base URLs;
* preserve existing request and response types;
* update all consumers if a type changes;
* do not change backend-facing contracts unless explicitly required;
* update API documentation only if the contract actually changes and the user asked for docs to stay current.

## React and TypeScript Rules

When editing React and TypeScript:

* keep types strict;
* avoid `any`;
* preserve existing helper functions when possible;
* avoid duplicating booking calculations in components;
* prefer reusable booking helpers for shared logic;
* handle `null`, `undefined`, empty strings, empty arrays, and invalid parsed values;
* do not weaken types to bypass real booking errors.

## Required Safety Checks

Before finalizing, check the affected booking path manually in code:

```text
Can a guest reach the booking page with a selected room?
Are check-in and check-out preserved?
Is the number of nights correct?
Is the guest count preserved?
Is the price correct?
Is the prepayment correct?
Does the confirmation page display the same data?
Do invalid or missing parameters fail safely?
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

Update booking documentation only if:

* the user explicitly asks for documentation updates;
* the booking behavior changed intentionally;
* the data contract changed;
* a new booking rule was added.

Relevant documentation may include:

```text
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

Booking flow:
- Selected room: checked / changed / not affected
- Dates: checked / changed / not affected
- Nights: checked / changed / not affected
- Guests: checked / changed / not affected
- Price: checked / changed / not affected
- Prepayment: checked / changed / not affected
- URL parameters: checked / changed / not affected
- Confirmation page: checked / changed / not affected
- Admin impact: checked / not affected

Validation:
- ...

Notes:
- ...
```

If no code change was made, explain exactly why.
