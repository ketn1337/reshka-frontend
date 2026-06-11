# Вклад в проект

## Ветвление

```
main   ← стабильная продакшен-ветка (только через PR из dev)
dev    ← основная ветка разработки
        ↑
        ├── feature/<имя-фичи>   ← новая функциональность
        └── fix/<что-исправляем> ← исправления
```

**Золотое правило:** все изменения ведут в `dev` через PR. `main` обновляется только через merge из `dev`.

### Когда создавать ветку

- `feature/<name>` — новая функциональность, улучшения, рефакторинг
- `fix/<name>` — исправление багов
- `chore/<name>` — технические задачи (зависимости, конфиги, CI)

Примеры:

```bash
git checkout -b dev                    # если ещё нет dev
git checkout -b dev --track origin/dev
git checkout -b feature/room-photos
git checkout -b fix/chessboard-tooltip
```

## Коммиты — Conventional Commits

Формат: `<тип>(<область>): <описание>`

Примеры:

```bash
git commit -m "feat(chessboard): добавить тултип при наведении"
git commit -m "fix(booking): исправить расчёт предоплаты для 1 ночи"
git commit -m "chore: добавить husky и commitlint"
git commit -m "docs(api): уточнить описание /admin/bookings"
git commit -m "refactor(booking): вынести getNights в отдельную утилиту"
git commit -m "perf(search): мемоизировать фильтрацию офферов"
```

**Разрешённые типы:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`

Поле `<область>` опционально, но рекомендуется (особенно для `feat`/`fix`). Указывает на часть проекта: `chessboard`, `booking`, `api`, `admin` и т.д.

### Почему это важно

- Автоматическая генерация CHANGELOG
- Понятная история коммитов
- CI проверяет формат через `commitlint`

## Pre-commit хуки

При каждом `git commit`:

1. **`lint-staged`** — запускает `tsc -b --noEmit` по всем staged `.ts/.tsx` файлам. Если typecheck падает — коммит отклоняется.
2. **`commitlint`** — проверяет, что сообщение коммита соответствует Conventional Commits. Если формат неправильный — коммит отклоняется.

Хуки устанавливаются автоматически при `npm install` (через `prepare` script) + git config core.hooksPath .husky.

### Если хуки мешают

```bash
# временно отключить все husky-хуки
git commit -m "chore: ..." --no-verify
```

Используйте `--no-verify` только в исключительных случаях.

## Перед созданием PR

1. `npm run build` проходит без ошибок
2. Коммиты соответствуют Conventional Commits
3. Ветка отходит от `dev`, не от `main`
4. Документация обновлена, если меняли API или архитектуру

## Структура кода

- Публичная часть → `src/components/`, админка → `src/admin/`. Не смешивать.
- API-вызовы только через `src/api/` — никаких прямых `fetch` в компонентах.
- Типы — из `src/api/types.ts`, не дублировать локально.
- Подробнее: `docs/claude/ARCHITECTURE.md`

## Проверки после изменений

См. `docs/claude/CHECKS.md`. Кратко:

```bash
npm run build   # полный typecheck + сборка
```

Это единственная комплексная проверка в проекте. Тестов и линтера нет.

## Вопросы

Если что-то неясно — откройте issue или спросите в PR.
