# Project Context: reshka-frontend

`reshka-frontend` — frontend гостиничного сайта «О! Решка». SPA на React + TypeScript + Vite + Tailwind CSS. Содержит публичную часть и админку.

## Зоны

1. **Публичная часть** (`src/components/`) — лендинг, поиск, бронирование, подтверждение, контакты.
2. **Админка** (`src/admin/`) — шахматка, бронирования, гости, тарифы, номера, пользователи, вход.

Маршрутизация — кастомный роутер в `src/App.tsx` (без `react-router`).

## Документация для Claude Code

- `docs/claude/ARCHITECTURE.md` — архитектура, структура `src/`, маршруты, входные точки.
- `docs/claude/PUBLIC_APP.md` — публичная часть: страницы, URL-параметры, поиск, бронирование.
- `docs/claude/ADMIN_APP.md` — админка: страницы, авторизация, шахматка, бронирования, статусы.
- `docs/claude/API.md` — API-клиенты, типы, auth, правила изменения API-слоя.
- `docs/claude/BOOKING_FLOW.md` — поток бронирования, URL-параметры, расчёты, связь с админкой.
- `docs/claude/UI_GUIDE.md` — Tailwind-тема, паттерны, изображения (`object-cover` vs `object-contain`).
- `docs/claude/CHECKS.md` — scripts в `package.json`, что запускать после изменений.

## Главные файлы

- `src/App.tsx` — корневой компонент и роутер.
- `src/main.tsx` — React entrypoint + `QueryClientProvider`.
- `src/index.css` — Tailwind + глобальные стили.
- `src/api/` — API-слой (см. `API.md`).
- `src/components/` — публичная часть (см. `PUBLIC_APP.md`).
- `src/admin/` — админка (см. `ADMIN_APP.md`).
- `src/store/auth.ts` — Zustand auth-стор.
- `src/lib/route.ts` — `pushPath`/`replacePath`.
- `src/booking.ts` — URL-парсинг, расчёт ночей/стоимости, форматирование.
- `src/data.ts` — статические данные лендинга.
- `src/roomInventory.ts` — объекты/типы/юниты/фото.

## Правило актуализации

Если изменились структура проекта, маршруты, API, бронирование, админка или важные UI-паттерны, обновить соответствующий файл из `docs/claude/` и при необходимости этот `PROJECT_CONTEXT.md`.
