# UI Guide

## Tailwind

- Tailwind 3, кастомная тема в `tailwind.config.js`.
- Без CSS-фреймворков кроме Tailwind. Не добавляйте новые UI-библиотеки.
- Кастомные цвета: `reshka-yellow` (`#f6c90e`), `reshka-yellowSoft` (`#ffe17a`), `reshka-black` (`#090909`), `reshka-graphite` (`#171717`), `reshka-ash` (`#2a2a2a`).
- Тени: `shadow-glow` (24px 80px, 24% yellow) и `shadow-card` (20px 60px, 12% black).
- Шрифты: `font-sans` (Inter), `font-display` (Manrope). Подключены в `index.css` через Google Fonts.
- Базовый фон страницы: радиальный градиент + линейный градиент в `body` (`index.css`).

## Глобальные классы (`index.css`)

- `.section-shell` — контейнер `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`.
- `.eyebrow` — мелкий жёлтый лейбл-надзаголовок `text-xs font-extrabold uppercase tracking-[0.28em] text-reshka-yellow`.
- `.glass-panel` — белый полупрозрачный фон с blur для боковых панелей.
- `.hotel-visual` — декоративный фон-карточка (комбинация градиентов) с blur-кругами. Используется в `Hero` и `About`.
- Глобальный `::selection` окрашен в жёлтый.

## Иконография

- Только `lucide-react`. Размеры — `h-4 w-4`, `h-5 w-5`, `h-6 w-6`, реже `h-3.5 w-3.5`. В кнопках с лейблом иконка идёт перед текстом, обычно с `text-reshka-yellow` для акцента.

## Компонентные паттерны

- Кнопка-CTA: `rounded-full bg-reshka-yellow px-5 py-3 text-sm font-extrabold text-reshka-black shadow-glow` + `hover:-translate-y-0.5 hover:bg-reshka-yellowSoft`. Вариант «секондари» — `border border-black/10 bg-white`.
- Карточка: `rounded-[24-30px] border border-black/10 bg-white shadow-card`, иногда `p-5/sm:p-6`.
- Поле ввода: `rounded-2xl border border-black/10 bg-[#fbfaf6] px-3 py-2`, фокус `focus:border-reshka-yellow focus:bg-white`.
- Бейдж статуса: `rounded-full px-3 py-1 text-xs font-extrabold` + цвет из `src/admin/status.ts`.
- Лейбл-надпись: `text-[10px] / text-xs font-extrabold uppercase tracking-[0.18em] text-black/40-50`.
- Анимации: `framer-motion` `motion.section / motion.article` с `initial / animate / whileInView`, обычно `opacity 0→1`, `y 18–28→0`, длительность 0.35–0.75.

## Адаптив

- Брейкпоинты Tailwind: `sm`, `lg`, `xl`. Мобильное меню `Header` появляется ниже `md`.
- Гриды: `grid gap-3 lg:grid-cols-[…]` — на мобилке одна колонка, на десктопе 2–3.
- Тексты: `text-sm sm:text-base sm:text-lg` для плавного роста.

## Изображения номеров

Источники:

- `src/assets/hero-home.png` — глобальный фолбэк.
- `src/data.ts` — пара обложек с Unsplash для лендинга (`Rooms.tsx`).
- `src/photos/<Адрес> (<n>)/*.jpg` — реальные фото юнитов, импорт через `import.meta.glob('./photos/**/*.jpg', { eager: true, query: '?url' })` в `roomInventory.ts`. Папка `src/photos/` в `.gitignore` — фото подгружаются с бэкенда (`/photos/...`) в проде.
- API: `r.photos[].url` (поле `Photo.url` в типах) — приходит с бэкенда, используется в админке (`RoomsPage`, шахматка не использует фото).

### Когда `object-cover`, когда `object-contain`

- `object-cover` — для обложек, где важен «узнаваемый кадр» с кропом: `Hero` фон, `Rooms` карточки, `RoomViewPage` thumbnails в галерее, обложка номера в `RoomsPage` (админка).
- `object-contain` + размытый фон `object-cover blur-2xl opacity-55 scale-110` — для крупных показов фото номера без обрезки (`BookingPage`, `SearchResultsPage.RoomImageCarousel`). Это гарантирует, что интерьер виден целиком при любых пропорциях.
- Для горизонтальной галереи в `RoomViewPage` основная фотография справа — `object-cover` внутри округлённого контейнера (там размеры зафиксированы и кроп допустим).
- Не использовать «грубый кроп» (`object-cover` без фона) там, где показываем конкретный интерьер, — он не влезет в нестандартные пропорции.

## Цветовая семантика

- Жёлтый — основной акцент (CTA, акценты, активные состояния).
- Чёрный — фон тёмных секций, текст заголовков, основные кнопки.
- `text-black/60`, `text-black/45` — вторичный текст, лейблы.
- `bg-[#fbfaf6]` — светлый «бумажный» фон для карточек и панелей (вместо чистого `bg-white`).
- `bg-emerald-50/40` / `bg-rose-50/50` — пастельные подсветки (свободно/выходной) в шахматке.

## Анимации и взаимодействия

- `hover:-translate-y-0.5` или `hover:-translate-y-1` на CTA/карточках — единый «приподнимающийся» hover.
- `transition`/`duration-300`/`duration-700` — общие тайминги.
- `motion` с `viewport={{ once: true, margin: '-90px' }}` для секций — анимация один раз при появлении.
- `scroll-mt-28` на якорных секциях — компенсация высоты фиксированного `Header`.

## Стиль кода (TS/React)

- Функциональные компоненты, экспорт по умолчанию.
- Типы импортируются из `src/api/types.ts`, не дублируются.
- Состояние форм — `useState` или `react-hook-form` (только в `BookingCreateModal`).
- Для derived values `useMemo` оставлен только там, где это реально экономит работу (`useMemo` в `RoomViewPage` для фильтрации юнитов, `useMemo` для `searchOffers` не нужен — он константа).
- Кастомные inline-стили в виде `<style>{...}</style>` внутри `BookingDetailDrawer`, `BookingCreateModal`, `RoomEditDrawer`, `CreateGuestModal`, `RatesPage`, `UsersPage` — повторяющиеся `.input`. Это устаревший паттерн; при рефакторинге выносите в общий компонент.
- `clsx` для условных классов (`AdminLayout`, `ChessboardPage`).
- `pushPath` (`src/lib/route.ts`) — программная навигация; `pushAppPath` (`src/booking.ts`) — то же + `scrollTo top`.
