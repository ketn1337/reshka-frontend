---

## description: Use this skill for public-facing UI work in the Reshka project: homepage sections, Hero, Rooms, About, room cards, room detail pages, search results, booking pages, photo display, responsive layout, visual polish, and guest-facing UX. Do not use this skill for admin screens, API contract changes, backend logic, CI/CD, release checks, or documentation-only tasks.

# Reshka Public UI Skill

You are working on the public-facing frontend of the Reshka project.

This skill is for UI and UX tasks that affect what guests see on the website: the homepage, room catalog, room cards, room detail pages, search results, booking pages, galleries, images, responsive layout, visual hierarchy, and guest-facing interactions.

User request:

```text
$ARGUMENTS
```

## Primary Goal

Make a focused, safe, and visually consistent change to the public website UI.

Preserve the existing architecture, routing, booking flow, room data, and project style unless the user explicitly asks for a larger redesign.

Work as a frontend developer making a controlled UI improvement, not as an agent rewriting the application.

## Use This Skill For

Use this skill for tasks such as:

* updating the homepage;
* improving the Hero section;
* improving the Rooms section;
* changing room cards;
* fixing room photo display;
* improving room galleries;
* improving the room detail page;
* improving the search results page;
* improving the booking page UI;
* fixing responsive layout issues;
* improving buttons, cards, forms, spacing, typography, and visual hierarchy;
* making the public interface clearer for guests;
* aligning public pages with the existing project style.

## Do Not Use This Skill For

Do not use this skill for:

* admin panel changes;
* booking management screens;
* API contract changes;
* backend logic;
* database work;
* CI/CD configuration;
* release checks;
* documentation-only updates;
* large architecture changes.

Use a more specific skill instead if the task mainly concerns admin bookings, API changes, booking logic, bug fixes, code review, or release validation.

## Relevant Project Areas

Start by inspecting the actual project structure.

Commonly relevant areas:

```text
src/components/
src/pages/
src/booking.ts
src/roomInventory.ts
src/data.ts
src/photos/
```

Commonly relevant files may include:

```text
src/components/Hero.tsx
src/components/Rooms.tsx
src/components/About.tsx
src/pages/RoomViewPage.tsx
src/pages/SearchResultsPage.tsx
src/pages/BookingPage.tsx
src/pages/BookingConfirmationPage.tsx
src/booking.ts
src/roomInventory.ts
src/data.ts
```

If the actual file structure differs, adapt to the real structure instead of assuming these paths are exact.

## Project Documentation

Read documentation only when relevant.

For public UI tasks, these files are usually the most relevant:

```text
CLAUDE.md
docs/PROJECT_CONTEXT.md
docs/claude/PUBLIC_APP.md
docs/claude/UI_GUIDE.md
docs/claude/BOOKING_FLOW.md
```

Do not read every documentation file by default for a local UI change.

## Required Initial Assessment

Before editing code, identify:

```text
Task:
Affected UI area:
Files to inspect:
Booking flow risk:
Minimal change plan:
Validation:
```

Then inspect the relevant files and apply the change.

Do not start with a broad refactor.

## Core Constraints

Do not:

* rewrite the whole public UI unless explicitly requested;
* change admin screens;
* change API contracts;
* break existing routes;
* change booking business logic unless necessary;
* remove existing room data;
* add new dependencies unless there is no reasonable alternative;
* modify `.env`, secrets, deployment settings, or unrelated configuration files;
* commit or push changes unless explicitly requested;
* update documentation unless the user asks for it or the UI change affects documented behavior.

## Visual Style Rules

The public interface should look like a guest-facing hotel or hostel website, not like an internal admin panel.

Preserve:

* clean card-based structure;
* clear call-to-action buttons;
* readable headings;
* consistent spacing;
* responsive layout;
* visual hierarchy;
* clear guest-oriented information;
* existing brand colors and design patterns.

Use existing styles, components, utilities, and Tailwind patterns before introducing new ones.

## Room Photo and Gallery Rules

For image, room card, and gallery tasks:

1. Check where the image `src` comes from.
2. Check whether local assets are used from `src/photos/`.
3. Check whether the path works with the project build setup.
4. Check `object-cover`, `object-contain`, fixed heights, aspect ratio, and `overflow`.
5. Avoid heavy cropping on room detail pages.
6. Prefer horizontal photos for wide layout areas when available.
7. If using a blurred background, keep the foreground image readable and not aggressively cropped.
8. Do not replace the whole gallery system if a local fix is enough.
9. Always provide a safe fallback when a room has no photo.

Expected behavior:

* room cards may crop slightly if the design requires it;
* room detail pages should avoid cutting off important parts of the image;
* galleries must not crash on empty image arrays;
* photos must not disappear because of incorrect paths;
* horizontal images are preferred for hero-like and wide preview blocks.

## Room Card Rules

A room card should clearly show:

* room name;
* primary photo;
* short description or key advantages;
* price if available;
* capacity if available;
* button or link to details or booking;
* graceful fallback when photo or price data is missing.

Do not overload guest-facing cards with internal technical data.

## Room Detail Page Rules

A room detail page should be clear and useful for a guest.

Check:

* heading;
* gallery;
* description;
* capacity;
* price;
* amenities;
* booking button;
* back navigation;
* behavior for unknown `roomId`;
* fallback behavior for incomplete room data.

The page must not crash when optional fields are missing.

## Search and Booking UI Rules

If the task touches search results or booking transitions, preserve:

* selected room;
* check-in date;
* check-out date;
* number of nights;
* guest count;
* price;
* prepayment;
* URL parameters;
* transition from `SearchResultsPage` to `BookingPage`;
* transition from `BookingPage` to `BookingConfirmationPage`.

Do not silently change booking rules. If the current behavior is ambiguous, make the smallest safe assumption and mention it in the final response.

## React and TypeScript Rules

When editing React and TypeScript:

* avoid `any` unless there is no reasonable local alternative;
* preserve existing component boundaries;
* preserve existing props unless they are demonstrably wrong;
* avoid duplicated state when a value can be derived;
* do not create new components unless it improves clarity or avoids duplication;
* keep import style consistent with nearby files;
* handle `null`, `undefined`, empty arrays, and missing optional fields;
* do not weaken types to make a UI fix pass.

## Tailwind and CSS Rules

When changing layout or styles:

* use existing project patterns;
* avoid random one-off class combinations when a nearby pattern exists;
* check both mobile and desktop layout;
* keep text readable on images;
* avoid fixed heights where content needs to adapt;
* avoid hiding important content with `overflow-hidden`;
* avoid excessive animations or visual noise;
* keep interactive elements accessible and clearly clickable.

## Accessibility and UX

Public pages should be understandable to guests.

Check that:

* buttons and links have clear labels;
* clickable elements look clickable;
* text contrast is acceptable;
* image overlays do not make text unreadable;
* empty states are clear;
* error states are not technical;
* forms are understandable;
* booking actions are easy to find.

## Validation

After changes, inspect `package.json` and run the smallest relevant available check.

Prefer, if available:

```bash
npm run typecheck
npm run lint
npm run build
npm test
```

Only run commands that exist in the project.

If validation fails because of pre-existing unrelated errors, report that clearly and separate those errors from the current change.

## Final Response Format

End with a concise report:

```text
Done:
- ...

Changed files:
- ...

Validation:
- ...

Notes:
- ...
```

If the task touched booking flow, also include:

```text
Booking flow:
- Selected room: checked / not affected
- Dates: checked / not affected
- Price: checked / not affected
- URL parameters: checked / not affected
```

If the task was visual only, state that booking flow was not affected.
