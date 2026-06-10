# API

API-слой в `src/api/`. Не делайте прямые `fetch` в UI-компонентах — используйте клиентов из этого слоя.

## Базовый клиент

`src/api/client.ts`:

- `API_BASE = import.meta.env.VITE_API_BASE ?? ''`. Пустая строка = текущий origin.
- `request<T>(path, opts)` — единая обёртка над `fetch`. Все запросы с `credentials: 'include'` (httpOnly-cookie для auth).
- Поддерживает `method`, `body` (JSON), `formData` (для multipart), `query` (object → URLSearchParams), `signal` (AbortSignal).
- На `204` возвращает `null`. На не-OK — бросает `ApiRequestError(status, { code, message })`.
- Vite dev-прокси (`vite.config.ts`) перенаправляет `/api` и `/photos` на `http://localhost:8080`. В проде — same-origin или reverse-proxy.

`ApiRequestError` имеет `status` и `code` (например, `'http_error'` если нет тела, или `body.code` от бэкенда).

## Аутентификация

`src/api/auth.ts`:

- `authApi.login(email, password) → { token, user }`. `token` сейчас не сохраняется на фронте (cookie-based).
- `authApi.logout() → void` — POST.
- `authApi.me() → User`.

`User` (`src/api/types.ts`): `id`, `email`, `role` (`admin` | `manager` | `receptionist`), `fullName`.

## Публичные endpoints

`src/api/properties.ts`:

- `propertiesApi.list() → { items: Property[] }`
- `propertiesApi.detail(slug) → { property, kinds: RoomKind[] }`
- `propertiesApi.rooms(slug, kind?) → { items: Room[] }`
- `propertiesApi.room(id) → Room`

`src/api/bookings.ts`:

- `publicBookingsApi.create(input: CreateBookingInput) → Booking` — POST `/api/public/bookings`.

## Админские endpoints

`src/api/bookings.ts`:

- `bookingsApi.list(params?) → { items: Booking[] }` — фильтры: `from`, `to`, `property`, `kind`, `status`, `q`.
- `bookingsApi.detail(id) → Booking`
- `bookingsApi.create(input) → Booking` — POST `/api/admin/bookings`.
- `bookingsApi.update(id, patch) → Booking` — PATCH.
- `bookingsApi.changeStatus(id, to, reason?) → Booking` — POST `/api/admin/bookings/:id/status`.
- `bookingsApi.cancel(id) → Booking` — DELETE.
- `chessboardApi.get({ from, days? }) → ChessboardResult` (`{ rooms, days, bookings }`).
- `adminRoomsApi.list({ property?, kind?, floor? })`, `update(id, patch)`, `uploadPhotos(id, files)` (multipart), `deletePhoto(roomId, photoId)`.
- `guestsApi.search(q, limit=20)`, `create(input)`, `update(id, input)`.
- `ratesApi.list({ kindId?, property?, kind? })`, `create(input)`, `update(id, input)`, `remove(id)`.
- `usersApi.list()`, `create(input)`, `update(id, patch)`.

## Типы

`src/api/types.ts` — зеркало Go-структур, отдаваемых бэкендом. Ключевые:

- `BookingStatus` = `'new' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'`
- `BookingSource` = `'direct' | 'site' | 'ota' | 'phone' | 'max'`
- `UserRole` = `'admin' | 'manager' | 'receptionist'`
- `RoomOrientation` = `'inner' | 'street' | 'courtyard'`
- `Booking`: `id`, `code`, `roomId`, `roomLabel?`, `propertyId?`, `propertyTitle?`, `guestId?`, `guest?`, `checkIn`, `checkOut`, `checkInTime?` (HH:MM), `checkOutTime?`, `nights?`, `adults`, `status`, `source`, `totalAmount`, `prepayment`, `notes?`, `createdBy?`, `createdAt`, `updatedAt`, `history?` (`StatusEvent[]`).
- `ChessboardBar`: точечные данные для отрисовки полосы — `bookingId`, `roomId`, `code`, `startISO`, `endISO` (полные ISO с timezone), `nights`, `status`, `guestName`, `adults`, `source`, `totalAmount`.
- `Rate`: `id`, `kindId`, `dateFrom`, `dateTo`, `weekdayRate`, `weekendRate`.
- `AvailabilityRoom`: `{ room, kind, available, total }`.

## Состояние и кэш

Все запросы — через TanStack Query (`@tanstack/react-query`). Глобальный `QueryClient` в `src/main.tsx`:

- `staleTime: 30_000`
- `retry: 1`
- `refetchOnWindowFocus: false`

Ключи кэша (для `invalidateQueries`):

- `['properties']`, `['property', slug]`
- `['adminRooms']`, `['adminRooms', property]`
- `['chessboard', windowStart, days]`
- `['bookings', status, q]`, `['booking', id]`
- `['guests', q]`, `['users']`
- `['rates', propertySlug, kindSlug]`

## Ошибки

`ApiRequestError` пробрасывается из `request`. Обработка в UI:

- `LoginPage`: 401 → «Неверный email или пароль», иначе `err.message`.
- `BookingCreateModal`: 409 → «Этот номер уже забронирован на эти даты», иначе `err.message`.
- `BookingDetailPage` / `BookingDetailDrawer`: показ `err.message` в красном бейдже.

Не глотайте ошибки молча. Не показывайте пользователю сырой `JSON.parse` — у `ApiRequestError` есть `message`.

## Правила изменения API-слоя

- Не создавайте второй общий client. Расширяйте `request` в `client.ts`.
- Не хардкодьте base URL. Используйте `API_BASE` или относительные пути.
- Не делайте прямой `fetch` из компонентов. Если нужен новый endpoint — добавьте функцию в `bookings.ts` / `properties.ts` / новый файл.
- Типы ответа описывайте явно. Не используйте `any` в клиентах.
- При добавлении multipart — следуйте паттерну `adminRoomsApi.uploadPhotos` (FormData + `formData: fd` в opts).
- При изменении контракта `Booking` / `BookingStatus` и т.п. — синхронизируйте `src/api/types.ts` и потребителей (`status.ts`, `ChessboardPage` и др.).
- Не храните токены в `localStorage` руками — auth идёт через httpOnly-cookie, persist Zustand хранит только `user`.
