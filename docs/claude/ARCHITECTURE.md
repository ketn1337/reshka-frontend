# Architecture

## Что это

`reshka-frontend` — frontend гостиничного сайта «О! Решка» на React + TypeScript + Vite + Tailwind CSS. Состоит из публичного сайта и админки в одном SPA.

## Стек

- React 19, TypeScript 5, Vite 6
- Tailwind CSS 3 (custom-тема в `tailwind.config.js`)
- TanStack Query 5 (запросы, кэш, мутации)
- Zustand (auth-стор с persist)
- React Hook Form + Zod (формы в `BookingCreateModal`)
- date-fns (даты в шахматке, бронях, формах)
- framer-motion (анимации hero/карточек)
- lucide-react (иконки)
- clsx (условные классы)

## Структура `src/`

```
src/
├── App.tsx                  # кастомный роутер, разделяет публичную и admin-зоны
├── main.tsx                 # React entrypoint + QueryClientProvider
├── index.css                # Tailwind + глобальные стили
├── api/                     # API-слой (клиенты, типы)
│   ├── client.ts            # единый fetch wrapper + ApiRequestError
│   ├── auth.ts              # /api/auth/*
│   ├── bookings.ts          # public + admin bookings, chessboard, rooms, guests, rates, users
│   ├── properties.ts        # /api/properties, /api/availability
│   └── types.ts             # зеркало Go-структур
├── components/              # публичная часть (только публичные компоненты)
│   ├── Header.tsx, Footer.tsx
│   ├── Hero.tsx, Rooms.tsx, Benefits.tsx, About.tsx, Reviews.tsx, Contacts.tsx
│   ├── BookingForm.tsx
│   ├── SearchResultsPage.tsx
│   ├── RoomViewPage.tsx
│   ├── BookingPage.tsx
│   └── BookingConfirmationPage.tsx
├── admin/                   # админка (только admin-компоненты)
│   ├── AdminLayout.tsx      # sidebar, AdminPageHeader, AdminButton, AdminForbidden
│   ├── LoginPage.tsx
│   ├── ChessboardPage.tsx
│   ├── BookingsListPage.tsx
│   ├── BookingDetailPage.tsx
│   ├── BookingDetailDrawer.tsx
│   ├── BookingCreateModal.tsx
│   ├── RoomsPage.tsx
│   ├── GuestsPage.tsx
│   ├── RatesPage.tsx
│   ├── UsersPage.tsx
│   ├── status.ts            # statusLabels, statusColors
│   └── components/BookingTooltip.tsx
├── store/auth.ts            # Zustand auth-стор
├── lib/route.ts             # pushPath, replacePath (программная навигация)
├── booking.ts               # parseResultsQuery/parseBookingQuery, getNights, getPrepaymentAmount
├── data.ts                  # статические данные: rooms, benefits, reviews, hotelHighlights
├── roomInventory.ts         # свойства/типы/юниты + фото через import.meta.glob
├── assets/                  # reshka-logo.svg, hero-home.png
└── photos/                  # фото номеров (в .gitignore, подгружаются через import.meta.glob)
```

## Маршрутизация

Кастомный роутер в `src/App.tsx` (без `react-router`).

- Переходы: `window.history.pushState` + диспатч `PopStateEvent('popstate')`. Утилиты: `pushPath`, `replacePath` (`src/lib/route.ts`), `pushAppPath` (`src/booking.ts`).
- `App.tsx` слушает `popstate`, перерендеривает по `pathname`.
- `App.tsx` сам решает, какую зону показать: если путь начинается с `/admin` → `AdminRouter`, иначе публичная часть.
- В публичной части: `Header`/`Footer` скрыты на flow-страницах (`/rooms`, `/search`, `/booking`, `/booking/confirmation`).

### Публичные маршруты

| Путь | Компонент | Назначение |
| --- | --- | --- |
| `/` | `Hero + Rooms + Benefits + About + Reviews + Contacts` | Главная |
| `/room-view`, `/rooms/view` | `RoomViewPage` | Просмотр плана номеров по адресу/типу |
| `/rooms`, `/search` | `SearchResultsPage` | Результаты поиска |
| `/booking` | `BookingPage` | Оформление брони |
| `/booking/confirmation` | `BookingConfirmationPage` | Подтверждение (1 час на оплату) |

### Админские маршруты

| Путь | Компонент | Доступ |
| --- | --- | --- |
| `/admin` | редирект на `/admin/chessboard` | — |
| `/admin/login` | `LoginPage` | — |
| `/admin/chessboard` | `ChessboardPage` | manager+ |
| `/admin/bookings` | `BookingsListPage` | manager+ |
| `/admin/bookings/:id` | `BookingDetailPage` | manager+ |
| `/admin/rooms` | `RoomsPage` | manager+ |
| `/admin/guests` | `GuestsPage` | manager+ |
| `/admin/rates` | `RatesPage` | manager+ |
| `/admin/users` | `UsersPage` | только `admin` (role-проверка в самой странице) |

## Входные точки

- `src/main.tsx`: создаёт `QueryClient` (`staleTime: 30s`, `retry: 1`, `refetchOnWindowFocus: false`) и оборачивает в `<QueryClientProvider>`.
- `src/App.tsx`: единственная точка, где живёт роутер и условия рендера зон.
- `src/index.css`: подключает Inter+Manrope, описывает фон, `.section-shell`, `.eyebrow`, `.glass-panel`, `.hotel-visual`.

## Разделение публичной части и админки

- API-вызовы: у публичной части — `propertiesApi`, `availabilityApi`, `publicBookingsApi.create`. У админки — `authApi`, `bookingsApi`, `adminRoomsApi`, `guestsApi`, `ratesApi`, `usersApi`, `chessboardApi`.
- Auth-стор общий: `useAuthStore` (`src/store/auth.ts`) — публичная часть его не использует; админка использует для `fetchMe`/`login`/`logout`.
- В директории `src/admin/` лежат только admin-компоненты. В `src/components/` — только публичные. Не смешивать.
- `AdminLayout` скрывает меню, пока `user` не загружен, и скрывает пункты с `adminOnly` для не-админов.

## Данные

- Статические: `src/data.ts` (описания номеров для лендинга, преимущества, отзывы), `src/booking.ts` (мок-метаданные `roomMeta` для каталога, типы и хелперы URL), `src/roomInventory.ts` (два объекта: `Аллея Труда 21`, `Пионерская 63`; типы `standard`/`comfort`).
- Динамические: всё через API из `src/api/`.
- Фото номеров: импорт через `import.meta.glob('./photos/**/*.jpg', { eager: true, query: '?url' })`. В проде фото подгружаются с бэкенда (`/photos/...` проксируется Vite).

## Состояние

- Глобальное: только `useAuthStore` (Zustand + persist в `localStorage`, ключ `reshka-auth`).
- Серверное: TanStack Query. Ключи кэша: `['chessboard', windowStart, days]`, `['bookings', status, q]`, `['booking', id]`, `['adminRooms', property]`, `['rooms']`, `['properties']`, `['property', slug]`, `['rates', propertySlug, kindSlug]`, `['guests', q]`, `['users']`.
- Локальное: `useState` в формах и фильтрах; URL-параметры как «store» для шаринга состояния поиска/брони.
