# Public App

Публичная часть сайта — в `src/components/`. Не должна содержать admin-логику и admin-API.

## Маршруты

| Путь | Файл | Назначение |
| --- | --- | --- |
| `/` | `App.tsx` собирает из Hero + Rooms + Benefits + About + Reviews + Contacts | Лендинг |
| `/room-view`, `/rooms/view` | `RoomViewPage.tsx` | Просмотр плана номеров |
| `/rooms`, `/search` | `SearchResultsPage.tsx` | Результаты поиска |
| `/booking` | `BookingPage.tsx` | Оформление |
| `/booking/confirmation` | `BookingConfirmationPage.tsx` | Подтверждение |

`App.tsx` сам выбирает публичный экран по `pathname`. На flow-страницах не рендерит `Header` и `Footer`.

## Главная

Состав: `Hero` → `Rooms` → `Benefits` → `About` → `Reviews` → `Contacts`.

- `Hero` — fullscreen с фоновой картинкой `hero-home.png`. Содержит `BookingForm` поверх (поиск дат/гостей/типа номера). Имеет «карточку-панель» (`.glass-panel` + `.hotel-visual`) справа.
- `Rooms` — два типа номеров из `src/data.ts` (`Стандарт`, `Комфорт`) с ценами «от X ₽».
- `Benefits` — 6 карточек преимуществ с иконками lucide.
- `About` — описание хостела, факты о розетках, фичи номера.
- `Reviews` — три отзыва (2ГИС/Островок/Tripadvisor).
- `Contacts` — адрес/телефон/email + декоративная «карта».

## Поиск номеров

- `Header` (пункт «Найти номер») и `Hero.BookingForm` оба ведут на `/rooms?checkIn=&checkOut=&guests=&roomType=`.
- `SearchResultsPage` берёт параметры через `parseResultsQuery` (`src/booking.ts`), фильтрует локально по типу/вместимости/цене/feature-чекбоксам, сортирует (`recommended` / `priceAsc` / `priceDesc`).
- Карточка предложения показывает `RoomImageCarousel` (блюр-фон + `object-contain` основной картинки). Источник фото: `getOfferImages` собирает уникальные фото всех юнитов этого типа на этом объекте плюс заглушку из `data.ts`.
- Действия: «Забронировать» (на `/booking`) и клик по заголовку (на `/room-view`).

## Просмотр плана номеров

`RoomViewPage` (`/room-view?address=&roomType=&room=`) — статический обход инвентаря из `roomInventory.ts`.

- Верх: табы корпусов (`alley` / `pioneer`) и типов (`standard` / `comfort`). У `pioneer` тип `comfort` отключён.
- Слева: «план этажа» — сетка кнопок-номеров с активной подсветкой. По клику — `selectRoom` (заменяет URL через `replaceRoomViewUrl`).
- Справа: фото выбранного номера с каруселью. Фото подгружаются из `src/photos/<Адрес> (<n>)/*.jpg` через `import.meta.glob`.
- Под фото: сведения о номере (площадь, тип, сторона, кровать).

## Оформление брони

`BookingPage` (`/booking?room=&checkIn=&checkOut=&guests=&createdAt=`):

- Берёт параметры через `parseBookingQuery`. `roomTitle` — название типа (`Стандарт` / `Комфорт`).
- Считает `nights = getNights(checkIn, checkOut)`, `total = room.rate * nights`, `prepayment = ceil(total * 0.3 / 100) * 100`.
- Показывает обложку (`roomCover` — `roomImages[2]` или `heroHome`). Использует технику «размытый фон + contain»: `object-cover opacity-55 blur-2xl` под основной `object-contain`.
- Кнопка «Забронировать» → `pushAppPath('/booking/confirmation?…&createdAt=' + Date.now())`.

## Подтверждение брони

`BookingConfirmationPage` (`/booking/confirmation?…&createdAt=…`):

- `deadline = formatDeadline(createdAt + 3_600_000)` (через час).
- Показывает «Бронь предварительно создана», `paymentPurpose = "Предоплата: <roomTitle>, <даты>"`, реквизиты СБП, ссылку «Написать в Max».
- Бэкенд сейчас не дёргается (демо). В проде предполагается вызвать `publicBookingsApi.create` (см. `BOOKING_FLOW.md`).

## URL-параметры публичной части

| Параметр | Где задаётся | Где читается |
| --- | --- | --- |
| `checkIn`, `checkOut` | `BookingForm`, `SearchResultsPage` | `parseResultsQuery`, `parseBookingQuery` |
| `guests` | там же | `parseResultsQuery` (clamp 1..6, дефолт 2) |
| `roomType` | `BookingForm` (`roomTypes = ['Любой номер', 'Стандарт', 'Комфорт']`) | `parseResultsQuery` |
| `room` | `BookingPage.handleReserve` | `parseBookingQuery`, `SearchResultsPage` (через `buildBookingParams`) |
| `createdAt` | `BookingPage.handleReserve` (Date.now()) | `BookingConfirmationPage` для дедлайна |
| `address` | `RoomViewPage` (`alley` / `pioneer`) | `parseRoomViewQuery` (`roomInventory.ts`) |
| `roomType` (room-view) | `RoomViewPage` (`standard` / `comfort`) | `parseRoomViewQuery` |
| `room` (room-view) | `RoomViewPage` (id юнита) | `parseRoomViewQuery` |

## Что важно не ломать

- `Header.scrollToSection` и `Footer.navigateFooter` дублируют поведение для якорей и путей — если меняете навигацию, синхронизируйте оба.
- `Hero` всегда рендерит `BookingForm` поверх фона. Не отделяйте форму от Hero без согласования.
- `SearchResultsPage` собирает офферы из `roomProperties` локально — `available` равен количеству юнитов, реальная доступность по датам пока не проверяется бэкендом.
- `RoomViewPage` хранит выбор в `useState` и синхронизирует URL через `replaceState` (без push), чтобы не плодить историю при кликах по номерам.
