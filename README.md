# Frontend Interview Portal

Образовательный портал для подготовки к frontend-собеседованию: теория + интерактивная практика внутри статей.

## Статус

- Milestone 1: `Выполнено` (каркас Next.js + TS + MDX).
- Milestone 2: `Выполнено` (архитектура упражнений + 2 типа с evaluate и тестами).
- Milestone 3: `Выполнено` (остальные 4 типа, частичная оценка, DnD для MatchPairs/OrderSteps).

## Технологии

- Next.js (App Router)
- TypeScript
- MDX
- ESLint + Prettier
- Vitest (добавлены первые unit-тесты evaluate-логики)

## Запуск локально

```bash
nvm use
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Основные маршруты

- `/` — главная
- `/articles` — список статей
- `/articles/js-core`
- `/articles/react-ts`
- `/articles/browser-interview`
- `/test` — test-режим Milestone 3 (6 типов упражнений, прогресс и промежуточный итог)
- `/results` — каркас страницы результатов

## Что уже сделано

- Подключен MDX и вынесены 3 статьи-заглушки.
- Подготовлены slug: `js-core`, `react-ts`, `browser-interview`.
- Зафиксирован формат `exercise.id`: `<articleSlug>-ex-<nn>`.
- Добавлены команды для линтинга, форматирования и тестов.
- Реализованы `types.ts`, `ExerciseRenderer`, common-компоненты упражнений.
- Реализованы все 6 типов: `TrueFalse`, `MultipleChoice`, `FillTheBlank`, `MatchPairs`,
  `OrderSteps`, `Crossword` в режимах `inline` и `test`.
- Для `MatchPairs` и `OrderSteps` добавлен drag-and-drop и клавиатурная альтернатива.
- Реализованы `evaluate` функции для всех типов с поддержкой частичной правильности.
- Добавлены unit-тесты для evaluate-функций всех типов (`Vitest`).
- Test-режим расширен до набора Milestone 3 (11 заданий разного типа).

## План следующих этапов

1. Реализовать `TestSessionProvider` и централизованное хранение результатов прохождения теста.
2. Добавить финальную страницу результатов с уровнем, разбором и рекомендациями по `tags`.
3. Довести контент статей до целевых учебных материалов и улучшить UX/доступность.
