# Frontend Interview Portal

Образовательный портал для подготовки к frontend-собеседованию: теория + интерактивная практика внутри статей.

## Статус

- Milestone 1: `Выполнено` (каркас Next.js + TS + MDX).
- Milestone 2: `Выполнено` (архитектура упражнений + 2 типа с evaluate и тестами).

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
- `/test` — test-режим Milestone 2 (первые 2 типа упражнений)
- `/results` — каркас страницы результатов

## Что уже сделано

- Подключен MDX и вынесены 3 статьи-заглушки.
- Подготовлены slug: `js-core`, `react-ts`, `browser-interview`.
- Зафиксирован формат `exercise.id`: `<articleSlug>-ex-<nn>`.
- Добавлены команды для линтинга, форматирования и тестов.
- Реализованы `types.ts`, `ExerciseRenderer`, common-компоненты упражнений.
- Реализованы 2 типа: `TrueFalse`, `MultipleChoice` в режимах `inline` и `test`.
- Реализованы `evaluateTrueFalse` и `evaluateMultipleChoice`.
- Добавлены unit-тесты для evaluate-функций (`Vitest`).

## План следующих этапов

1. Добавить остальные типы задач: `FillTheBlank`, `MatchPairs`, `OrderSteps`, `Crossword`.
2. Реализовать обязательный drag-and-drop для `MatchPairs` и `OrderSteps`.
3. Расширить test-сессию до 10–12 заданий, добавить финальный экран и рекомендации.
4. Довести контент до целевых 3 статей и минимум 10 inline-упражнений.
