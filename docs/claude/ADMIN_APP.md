# Admin App

Админка в `src/admin/`. Не должна импортировать публичные компоненты и публичные API.

## Маршруты

Решает `App.tsx` (если путь начинается с `/admin` → `AdminRouter`):

| Путь | Компонент |
| --- | --- |
| `/admin` | редирект на `/admin/chessboard` |
| `/admin/login` | `LoginPage` |
| `/admin/chessboard` | `ChessboardPage` |
| `/admin/bookings` | `BookingsListPage` |
| `/admin/bookings/:id` | `BookingDetailPage` |
| `/admin/rooms` | `RoomsPage` |
| `/admin/guests` | `GuestsPage` |
| `/admin/rates` | `RatesPage` |
| `/admin/users` | `UsersPage` (role=admin) |

Любой незнакомый путь → `AdminForbidden` (бренд «Недостаточно прав»).

## Авторизация

- Стор: `useAuthStore` (`src/store/auth.ts`, Zustand + persist, ключ `reshka-auth`).
- `LoginPage` вызывает `useAuthStore.login(email, password)`. На 401 показывает «Неверный email или пароль».
- `AdminLayout` при монтировании вызывает `useAuthStore.getState().fetchMe()` (если `user` ещё нет и `initialized === false`). Пока `user` пустой, показывает «Загрузка…».
- После успешного `login` или `fetchMe` — `user` сохраняется в `localStorage`, браузер его использует при перезагрузке.
- `logout` дёргает `/api/auth/logout`, очищает `user`, редиректит на `/admin/login`. Сетевые ошибки при logout игнорируются.
- `usersApi` и `/admin/users` дополнительно проверяют `user.role === 'admin'` в `UsersPage` (рендерит `AdminForbidden` иначе). В `AdminLayout` пункт «Сотрудники» помечен `adminOnly: true` и фильтруется тем же условием.

## `AdminLayout.tsx`

- `AdminPageHeader({ title, subtitle?, actions? })` — общий заголовок страниц.
- `AdminButton({ children, onClick?, variant?, type? })` — кнопка в трёх вариантах (`primary` / `secondary` / `ghost`).
- `AdminForbidden` — экран «недостаточно прав».
- Sidebar: `NAV` со списком и иконками. `collapse` переключается кнопкой. `pushPath` из `src/lib/route.ts` для переходов.

## Шахматка бронирований

`ChessboardPage`:

- Окно: `DAYS_WINDOW = 40`, `START_OFFSET_DAYS = 3` (старт = `today − 3 дня`). Шаг стрелок: 30 дней.
- Запрос: `chessboardApi.get({ from: windowStart, days: 40 })`. Кэш-ключ `['chessboard', windowStart, DAYS_WINDOW]`.
- Клик по пустой ячейке → `setModal({ roomId, date })` (открывает `BookingCreateModal`).
- Клик по полосе брони → `setOpenBookingId(bookingId)` (открывает `BookingDetailDrawer`).
- Hover по полосе → `BookingTooltip` (задержка 200 мс, фиксированное позиционирование, не мерцает).
- Цвета баров: `new` — emerald, `confirmed` — amber, `checked_in` — sky, `checked_out` — zinc. `cancelled`/`no_show` остаются в списке, но не учитываются в `occupiedDates`.
- `NowMarker` — красная вертикаль «сейчас», двигается через `requestAnimationFrame`.

`src/admin/components/BookingTooltip.tsx` — отдельный тултип с задержкой 200 мс и проверкой границ экрана.

## Список и карточка бронирования

- `BookingsListPage`: таблица с поиском (`q`) и фильтром по статусу. Кнопка «Открыть» → `/admin/bookings/:id`.
- `BookingDetailPage`: подробный вид. Действия по статусу: `new → confirmed`, `confirmed → checked_in`, `checked_in → checked_out`, любой из них → `cancelled`. Из `confirmed` можно поставить `no_show` с указанием причины. После изменения — `invalidateQueries(['booking', id])`, `['bookings']`, `['chessboard']`.
- `BookingDetailDrawer`: то же самое, что `BookingDetailPage`, но в боковой панели (открывается из шахматки). Закрывается по `Esc` или клику в подложку. Содержит `EditForm` (даты, гости, сумма, предоплата, заметки) — мутация `bookingsApi.update`.

## Создание брони

`BookingCreateModal` (вызывается из шахматки):

- `react-hook-form` + Zod-схема (`schema`).
- Поля: номер, источник, даты + время (`HH:MM`, дефолт 14:00 / 12:00), гости, сумма, предоплата, ночи (считаются), заметки.
- Гость: «Новый» (ФИО + телефон + email) или «Из базы» (поиск от 2 символов, `guestsApi.search`).
- При успехе: `bookingsApi.create(...)` + `invalidateQueries(['chessboard'])` + `['bookings']`.
- На `409` показывает «Этот номер уже забронирован на эти даты».
- После сохранения — `alert(created.code)` (демо) и `onSaved()`.

## Номера

`RoomsPage` + `RoomEditDrawer` (боковая панель):

- Список: фильтр по объекту (`property`), карточки с обложкой из `r.photos[0]`.
- Drawer: редактирование `label`/`shortLabel`/`floor`, чекбокс «Активен» (только UI, в мутацию не уходит), загрузка фото (`adminRoomsApi.uploadPhotos`, multipart), удаление фото.
- Стилизация inline в `<style>` внутри drawer (`.input`).

## Гости

`GuestsPage` + `CreateGuestModal`:

- Поиск через `guestsApi.search(q, 50)`.
- Создание: ФИО (обязательно), телефон, email.

## Тарифы

`RatesPage`:

- Выбор объекта → типов (`propDetail.kinds`).
- Список периодов `Rate` (`dateFrom`–`dateTo`, `weekdayRate`, `weekendRate`).
- `CreateRateModal`: создание периода.

## Сотрудники

`UsersPage`:

- Доступен только `user.role === 'admin'`, иначе `AdminForbidden`.
- `CreateUserModal`: ФИО, email, пароль (≥6 символов), роль (`admin` / `manager` / `receptionist`).

## Статусы брони

`src/admin/status.ts` — два маппинга:

- `statusLabels`: `new → Новая`, `confirmed → Подтверждена`, `checked_in → Заселена`, `checked_out → Выселена`, `cancelled → Отменена`, `no_show → Неявка`.
- `statusColors`: tailwind-классы для бейджей (например, `new → bg-amber-100 text-amber-900`, `cancelled/no_show → line-through`).

Используются в `BookingsListPage`, `BookingDetailPage`, `BookingDetailDrawer`. Не дублируйте — берите из `status.ts`.

## Важные связи

- `ChessboardPage` ↔ `BookingDetailDrawer` / `BookingCreateModal` — единый источник правды: после `refetch()` шахматка перерисовывается.
- `BookingDetailPage` (URL) и `BookingDetailDrawer` (модалка из шахматки) делают одно и то же, но имеют разный layout. При добавлении нового поля брони — синхронизируйте обе.
- `BookingCreateModal` использует `useQuery(['adminRooms'])` — этот ключ инвалидируется в `RoomsPage` после апдейта/загрузки фото.
- `useAuthStore.fetchMe` срабатывает в `AdminLayout` лениво: при первом монтиже после перезагрузки.
