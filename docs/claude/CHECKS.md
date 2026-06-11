# Checks

## Scripts (`package.json`)

- `dev` — `vite --host 127.0.0.1` (dev-сервер на 5173, прокси `/api` и `/photos` на `http://localhost:8080`).
- `build` — `tsc -b && vite build` (полный typecheck + production-сборка).
- `preview` — `vite preview --host 127.0.0.1` (просмотр прод-сборки).

Lint, test, отдельный typecheck — **не обнаружено**. Единственная комплексная проверка — `npm run build`.

## Что запускать

Перед финальным ответом по возможности:

1. `npm run build` — прогоняет `tsc -b` (все `.ts/.tsx` под `src/`) и собирает бандл. Это покрывает typecheck + production-сборку.
2. Если меняется только UI без логики — `npx tsc -b --noEmit` быстрее, но в проекте нет отдельного script для этого; используйте `npm run build`.

## Чего нет

- ESLint/Prettier config — **не обнаружено**. Стиль поддерживается вручную.
- Тесты (Vitest/Jest) — **не обнаружено**.
- Husky/pre-commit — **не обнаружено**.

## TypeScript-конфигурация

- `tsconfig.json`: `strict: true`, `moduleResolution: "Bundler"`, `jsx: "react-jsx"`, `target: "ES2020"`.
- `tsconfig.node.json` — для Vite-конфига.
- Алиасы путей (`paths`) — **не обнаружено**. Импорты абсолютные относительно `src/`.

## Ручная проверка

- Если меняли `src/api/*` или `src/store/*` — соберите и убедитесь, что `npm run build` проходит (типы DTO не разъехались с TS-типами).
- Если меняли публичные маршруты — откройте `dev` и проверьте переходы `/` → `/rooms` → `/booking` → `/booking/confirmation`, и обратные кнопки.
- Если меняли шахматку — проверьте клик по пустой ячейке (должен открыться `BookingCreateModal`), клик по бару (должен открыться `BookingDetailDrawer`), стрелки окна.
- Если меняли auth — проверьте `/admin/login` → вход → `/admin/chessboard`, обновление страницы (юзер должен сохраниться), `/admin/users` под `manager` (должен показать `AdminForbidden`), logout.
- Если меняли `BookingCreateModal` — проверьте ветку «новый гость» и «из базы» (поиск от 2 символов).
