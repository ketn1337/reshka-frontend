# Booking Flow

Полный поток бронирования в публичной части. Документ описывает URL, расчёты и связь с админкой.

## Шаги

1. `Hero` → `BookingForm` (даты, гости, тип номера) → submit → `pushState('/rooms?…')`.
2. `SearchResultsPage` фильтрует офферы локально (по `roomInventory.ts`) и сортирует.
3. Клик «Забронировать» на оффере → `pushAppPath('/booking?room=&checkIn=&checkOut=&guests=')`.
4. `BookingPage` показывает сводку. Клик «Забронировать» → `pushAppPath('/booking/confirmation?…&createdAt=' + Date.now())`.
5. `BookingConfirmationPage` показывает дедлайн (через час) и реквизиты для предоплаты. Кнопка «Написать в Max» ведёт на `https://max.ru/`.

Бэкенд на шагах 3–5 сейчас не дёргается. В проде предполагается вызвать `publicBookingsApi.create` (см. `src/api/bookings.ts`).

## URL-параметры

| Поле | Где задаётся | Где читается | Заметки |
| --- | --- | --- | --- |
| `checkIn` | `BookingForm`, `SearchResultsPage` (форма) | `parseResultsQuery`, `parseBookingQuery` | `YYYY-MM-DD` |
| `checkOut` | то же | то же | `YYYY-MM-DD` |
| `guests` | то же | `parseResultsQuery` (clamp 1..6, дефолт 2) | int |
| `roomType` | `BookingForm` | `parseResultsQuery` | `'Стандарт'` / `'Комфорт'` (пусто = «Любой номер») |
| `room` (booking) | `SearchResultsPage` (`offer.room.title`) → `buildBookingParams` | `parseBookingQuery` | название типа |
| `createdAt` | `BookingPage.handleReserve` (`Date.now()`) | `BookingConfirmationPage` для дедлайна | timestamp ms |
| `address` | `RoomViewPage` (`alley` / `pioneer`) | `parseRoomViewQuery` | id корпуса |
| `roomType` (room-view) | `RoomViewPage` | `parseRoomViewQuery` | `'standard'` / `'comfort'` |
| `room` (room-view) | `RoomViewPage` | `parseRoomViewQuery` | id юнита (`<property>-<n>`) |

## Расчёты (`src/booking.ts`)

- `nights = getNights(checkIn, checkOut)`: разница дат в днях, clamp 1..30, минимум 1.
- `total = room.rate * nights` (rate — из `roomMeta` в `src/booking.ts`).
- `prepayment = ceil(total * 0.3 / 100) * 100` — округление вверх до 100 ₽.
- `deadline = createdAt + 3_600_000` (1 час). Текст: `formatDeadline(timestamp)` → «до HH:MM сегодня/завтра/длинная дата».
- `paymentPurpose = "Предоплата: <roomTitle>, <dateRange>"`.
- Лейблы: `getNightLabel(n)`, `getGuestLabel(n)` — корректные русские склонения.

## Картинки номера

- `BookingPage` берёт `roomImages = getBookingRoomImages(room.title)`:
  1. Находит подходящий `kind` по title → берёт первое изображение из юнитов этого типа на любом объекте.
  2. Иначе — ищет юнит с подходящим `label`/`shortLabel`.
  3. Фолбэк — `heroHome`.
- `roomCover = roomImages[2] || heroHome` (третья картинка или заглушка).
- Визуальная техника: размытый фон (`object-cover opacity-55 blur-2xl scale-110`) под основной картинкой (`object-contain`).

## Связь с админкой

- Когда бэкенд подключён, `publicBookingsApi.create` пишет бронь в БД. Админ видит её в `ChessboardPage` (`queryKey ['chessboard']`) и в `BookingsListPage` (`['bookings']`).
- Источник (`BookingSource`) для онлайн-брони — `'site'` или `'max'`. В админке `BookingCreateModal` источник `'phone' / 'direct' / 'site' / 'ota' / 'max'` выбирается вручную.
- Статусы: новая онлайн-бронь приходит в `new`. Дальше админ переводит через `changeStatus` (`new → confirmed → checked_in → checked_out`, либо `cancelled`/`no_show`).
- Сумма и предоплата из публичной формы сейчас не передаются в БД. В админке `BookingCreateModal` сумма/предоплата вводятся вручную. Если нужна автопередача из публичной части — вызывайте `publicBookingsApi.create({ roomId, checkIn, checkOut, adults, totalAmount, prepayment, guest: { fullName, phone, email }, source: 'site' })`.

## Что важно не ломать

- Не переименовывайте параметры URL без миграции: от них зависят `parseResultsQuery`, `parseBookingQuery`, `parseRoomViewQuery` и `buildBookingParams`/`buildRoomViewPath`.
- Не меняйте сигнатуру `getNights` / `getPrepaymentAmount` / `getNightLabel` / `getGuestLabel` / `formatDeadline` / `formatCurrency` / `formatDate` / `formatDateRange` — они используются в `BookingPage`, `BookingConfirmationPage`, `SearchResultsPage`.
- `pushAppPath` (`src/booking.ts`) отличается от `pushPath` (`src/lib/route.ts`): первый ещё делает `scrollTo({ top: 0, behavior: 'smooth' })`. Для flow-страниц используйте `pushAppPath` или `pushAppPath` (см. `BookingPage.handleBack`/`handleReserve`).
- Сохраняйте `key={location.search}` в `App.tsx` для `SearchResultsPage` / `RoomViewPage` / `BookingPage` / `BookingConfirmationPage` — иначе при смене query не будет перерендера.
- Не удаляйте технику `размытый фон + object-contain` для картинок номеров — иначе при нестандартных пропорциях появятся чёрные полосы.
