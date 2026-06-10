---

## description: Use this skill for API-layer changes in the Reshka project: API client updates, request and response types, booking endpoints, room endpoints, admin API integration, public booking API integration, error handling, loading states connected to API calls, and frontend/backend contract changes. Do not use this skill for purely visual UI changes or local component-only fixes.

# Reshka API Change Skill

You are working on the API layer of the Reshka project.

This skill is for tasks that affect frontend API integration, request and response contracts, API clients, booking endpoints, room endpoints, admin data loading, public booking submission, error handling, and typed communication between the frontend and backend.

User request:

```text
$ARGUMENTS
```

## Primary Goal

Make API-related changes safely and consistently.

API changes must not be made in isolation. If a request type, response type, endpoint, or API helper changes, all affected consumers must be checked.

Do not create duplicate API clients, do not hardcode backend URLs, and do not silently change data contracts.

## Use This Skill For

Use this skill for tasks such as:

* adding a new API method;
* changing an existing API method;
* fixing API request parameters;
* fixing API response parsing;
* changing booking API integration;
* changing room API integration;
* changing admin booking API integration;
* changing public booking submission;
* updating TypeScript request or response types;
* fixing loading, error, or empty states caused by API data;
* connecting frontend pages to backend endpoints;
* checking frontend/backend contract consistency;
* replacing mock data with API data;
* updating API documentation after real contract changes.

## Do Not Use This Skill For

Do not use this skill for:

* purely visual public UI changes;
* admin layout-only changes;
* local component-only bug fixes;
* release checks;
* documentation-only updates;
* code review without API changes;
* backend implementation unless the backend repository is explicitly part of the current task.

If the task is only about guest-facing visuals, use the public UI skill.

If the task is mainly about booking business logic, use the booking flow skill.

If the task is mainly about admin booking screens, use the admin bookings skill.

## Relevant Project Areas

Start by inspecting the actual project structure.

Commonly relevant areas:

```text
src/api/
src/types/
src/booking.ts
src/roomInventory.ts
src/data.ts
```

Commonly affected public files:

```text
src/pages/SearchResultsPage.tsx
src/pages/BookingPage.tsx
src/pages/BookingConfirmationPage.tsx
src/components/BookingForm.tsx
src/components/Rooms.tsx
```

Commonly affected admin files:

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

For API tasks, these files are usually relevant:

```text
CLAUDE.md
docs/PROJECT_CONTEXT.md
docs/claude/API.md
docs/claude/BOOKING_FLOW.md
docs/claude/PUBLIC_APP.md
docs/claude/ADMIN_APP.md
```

Do not read every documentation file by default for a small API fix.

## Required Initial Assessment

Before editing code, identify:

```text
Task:
API area affected:
Endpoint or helper involved:
Request data involved:
Response data involved:
Consumers to check:
Contract risk:
Minimal change plan:
Validation:
```

Then inspect the relevant API code and consumers.

Do not edit API code before understanding where the method, type, or response data is used.

## API Client Rules

When working with API clients:

* inspect existing API client code first;
* do not create a second API client if one already exists;
* do not hardcode the base URL inside components;
* use existing environment/config patterns;
* preserve existing headers, credentials, and error handling unless they are the source of the bug;
* keep API helpers centralized;
* avoid direct `fetch` or `axios` calls inside components if the project already uses API wrapper functions;
* keep API method names consistent with existing conventions.

## Contract Rules

When changing request or response contracts:

* identify the current request shape;
* identify the current response shape;
* identify all TypeScript types involved;
* identify every consumer of the changed type or method;
* update all affected consumers together;
* do not rename fields casually;
* do not remove fields unless explicitly required;
* do not weaken types to bypass real contract problems;
* do not use `any` unless there is no reasonable local alternative.

Use the actual field names from the codebase. Do not invent new names if the project already has established types.

## Booking API Rules

If the task touches booking API behavior, verify the affected subset of:

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

Check both public and admin consumers when booking data is shared.

Public booking consumers may include:

```text
SearchResultsPage
BookingPage
BookingConfirmationPage
BookingForm
booking helpers
```

Admin booking consumers may include:

```text
ChessboardPage
BookingsListPage
BookingDetailPage
BookingDetailDrawer
BookingCreateModal
status helpers
```

A booking created publicly must still be renderable in the admin interface if the project supports that flow.

## Room API Rules

If the task touches room API behavior, verify the affected subset of:

```text
roomId
roomName
title
description
price
capacity
amenities
photos
mainPhoto
availability
status
```

Check that room API changes do not break:

* public room cards;
* room detail pages;
* search results;
* booking page room lookup;
* admin booking room selection;
* price calculation;
* photo display.

Do not introduce a second independent room data source unless the task is explicitly about migration or reconciliation.

## Error Handling Rules

API errors must be handled in a user-appropriate way.

For public pages:

* show guest-friendly error messages;
* avoid exposing technical backend details;
* provide safe fallbacks when possible;
* do not crash pages on missing data.

For admin pages:

* show actionable admin-facing errors;
* preserve enough context to understand what failed;
* avoid hiding critical data-loading failures;
* do not show raw stack traces in the UI.

For code:

* handle network errors;
* handle non-2xx responses;
* handle malformed or partial response data;
* handle empty arrays;
* handle `null` and `undefined`;
* avoid displaying `NaN`, `undefined`, or raw `[object Object]`.

## Loading and Empty State Rules

If the task touches data loading:

* preserve loading indicators if they exist;
* add loading states only where needed;
* add empty states for valid empty responses;
* distinguish empty data from failed requests;
* avoid flickering states caused by duplicate requests;
* avoid unnecessary re-fetching;
* avoid infinite loops in `useEffect`.

## React and TypeScript Rules

When editing React and TypeScript API consumers:

* keep types strict;
* avoid `any`;
* keep API calls out of components if existing architecture already uses service functions;
* preserve component boundaries;
* avoid duplicating response transformation logic in multiple components;
* use shared mapping helpers if available;
* memoize only when there is a real reason;
* keep effects dependency-safe;
* handle loading, error, and empty states explicitly.

## URL and Environment Rules

Do not:

* hardcode production, staging, or local backend URLs inside components;
* commit real secrets;
* modify `.env` files unless explicitly requested;
* expose API keys in frontend code;
* change deployment configuration unless the task requires it;
* assume a backend URL without checking existing project conventions.

Use existing environment variable patterns.

## Backend Repository Rule

If the user provides both frontend and backend repositories, inspect both only when required by the task.

For frontend-only tasks:

* update frontend API integration;
* do not modify backend code unless explicitly requested.

For contract-changing tasks:

* verify backend endpoint behavior if the backend repository is available;
* update frontend types and consumers;
* update documentation only if requested or if the project requires docs to stay synchronized.

## Documentation Updates

Do not update documentation by default.

Update API documentation only if:

* the user explicitly asks for documentation updates;
* an API contract changed intentionally;
* a new endpoint was added;
* a request or response type changed;
* API behavior changed in a way future agents must know.

Relevant documentation may include:

```text
docs/claude/API.md
docs/claude/BOOKING_FLOW.md
docs/claude/ADMIN_APP.md
docs/claude/PUBLIC_APP.md
docs/PROJECT_CONTEXT.md
```

## Required Consistency Checks

Before finalizing, check the affected API path manually in code:

```text
Is there already an API client?
Is the base URL handled through existing config?
Are request types correct?
Are response types correct?
Are all consumers updated?
Are loading states handled?
Are error states handled?
Are empty states handled?
Does public booking still work if affected?
Does admin booking still work if affected?
Does room display still work if affected?
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

## Final Response Format

End with a concise report:

```text
Done:
- ...

Changed files:
- ...

API impact:
- API client: checked / changed / not affected
- Request types: checked / changed / not affected
- Response types: checked / changed / not affected
- Public consumers: checked / changed / not affected
- Admin consumers: checked / changed / not affected
- Error handling: checked / changed / not affected
- Loading/empty states: checked / changed / not affected

Validation:
- ...

Notes:
- ...
```

If the API contract changed, also include:

```text
Contract changes:
- Endpoint:
- Request:
- Response:
- Affected consumers:
```

If no code change was made, explain exactly why.
