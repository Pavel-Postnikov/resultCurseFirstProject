# Frontend Interview Portal

Образовательный портал для подготовки к frontend-собеседованию: теория + интерактивная практика внутри статей.

## Статус

- Milestone 1: `Выполнено` (каркас Next.js + TS + MDX).
- Milestone 2: `Выполнено` (архитектура упражнений + 2 типа с evaluate и тестами).
- Milestone 3: `Выполнено` (остальные 4 типа, частичная оценка, DnD для MatchPairs/OrderSteps).
- Milestone 4: `Выполнено` (TestSessionProvider, сохранение прогресса, финальный экран результатов).

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
- `/test` — test-режим Milestone 4 (пошаговый проход + сохранение прогресса)
- `/results` — финальный экран с итогом, разбором и рекомендациями по weak topics

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
- Реализован `TestSessionProvider` с централизованным состоянием и восстановлением из `localStorage`.
- Обновлен `/test`: пошаговый сценарий прохождения (1 вопрос за раз) и переход к финальным результатам.
- Реализована страница `/results`: процент и уровень, score/maxScore, разбор по вопросам, weak topics.
- Добавлены unit-тесты для `scoring` логики (`aggregateScores`, `getWeakTopics`).

## План следующих этапов

1. Довести контент статей до целевых учебных материалов и встроить финальные inline-упражнения (Milestone 5).
2. Улучшить UX и доступность: тексты фидбека, visual polish, edge-cases интерфейса (Milestone 5).
3. Сделать финальную сдаточную упаковку README и самопроверку по Definition of Done (Milestone 6).
