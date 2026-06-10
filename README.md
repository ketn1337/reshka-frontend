# О! Решка — Frontend

SPA-frontend гостиничного сайта «О! Решка». React + TypeScript + Vite + Tailwind CSS.

## Стек

- React 19, TypeScript 5, Vite 6
- TanStack Query 5 (запросы и кэш)
- Zustand (auth-стор)
- Tailwind CSS 3 (кастомная тема)
- date-fns, framer-motion, lucide-react

## Скрипты

```bash
npm run dev        # dev-сервер на http://localhost:5173
npm run build      # typecheck + production-сборка
npm run preview    # просмотр production-сборки
npm run typecheck  # только tsc (без сборки)
```

## Структура

```
src/
├── components/     # публичная часть (лендинг, поиск, бронирование)
├── admin/          # админка (шахматка, бронирования, гости, тарифы, номера, сотрудники)
├── api/            # API-клиенты и типы
├── store/          # Zustand-сторы
├── booking.ts      # URL-парсинг, расчёты ночей/стоимости
├── data.ts         # статические данные лендинга
└── roomInventory.ts # инвентарь номеров
docs/claude/        # подробная документация для разработчиков
```

Подробнее о структуре — `docs/claude/ARCHITECTURE.md`.

## Git workflow

```
main   ← стабильная продакшен-ветка
dev    ← основная ветка разработки (PR сюда)
        ↑ создаём feature/... или fix/... от dev
```

### Коммиты

Проект использует [Conventional Commits](https://www.conventionalcommits.org/ru/v1.0.0/). Формат:

```
<тип>(<область>): <описание>

feat(chessboard): добавить тултип при наведении на полосу брони
fix(booking): исправить расчёт предоплаты
chore: обновить зависимости
docs(api): уточнить описание /admin/bookings
```

**Типы:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`

### Pre-commit хуки

При каждом коммите автоматически:

1. `lint-staged` → `tsc -b --noEmit` по изменённым `.ts/.tsx` файлам
2. `commitlint` → проверка формата сообщения

Хуки устанавливаются через `husky` (`prepare` script в `package.json`).

### Pull Requests

- Ветка **от dev**, не от main
- PR должен пройти CI (`npm run build` зелёный)
- Описание по шаблону `.github/PULL_REQUEST_TEMPLATE.md`

### Branch protection (рекомендация)

В настройках GitHub репозитория:

- `main`: require PR reviews, require status checks passing
- `dev`: то же (или менее строго — на усмотрение команды)

## Документация

- `docs/PROJECT_CONTEXT.md` — общий контекст проекта
- `docs/claude/ARCHITECTURE.md` — архитектура и маршруты
- `docs/claude/API.md` — API-слой
- `docs/claude/BOOKING_FLOW.md` — поток бронирования
- `docs/claude/PUBLIC_APP.md` — публичная часть
- `docs/claude/ADMIN_APP.md` — админка
- `docs/claude/UI_GUIDE.md` — UI-паттерны и стиль
- `docs/claude/CHECKS.md` — что запускать после изменений