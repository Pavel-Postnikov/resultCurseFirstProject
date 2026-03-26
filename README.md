# Frontend Interview Portal

Образовательный портал для подготовки к frontend-собеседованию: теория + интерактивная практика внутри статей.

## Статус

- Milestone 1: `Выполнено` (каркас Next.js + TS + MDX).
- Milestone 2: `Выполнено` (архитектура упражнений + 2 типа с evaluate и тестами).
- Milestone 3: `Выполнено` (остальные 4 типа, частичная оценка, DnD для MatchPairs/OrderSteps).
- Milestone 4: `Выполнено` (TestSessionProvider, сохранение прогресса, финальный экран результатов).
- Milestone 5: `Выполнено` (контент статей, inline-встраивание упражнений, UX/accessibility полировка).

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
- `/test` — test-режим (пошаговый проход, сохранение прогресса, пропуск вопроса)
- `/results` — финальный экран с итогом, разбором и рекомендациями по weak topics
- На всех страницах доступна верхняя навигация: `Главная / Статьи / Тест / Результаты`.

## Что уже сделано

- Подключен MDX и подготовлены 3 полноценных учебных статьи.
- Подготовлены slug: `js-core`, `react-ts`, `browser-interview`.
- Зафиксирован формат `exercise.id`: `<articleSlug>-ex-<nn>`.
- Добавлены команды для линтинга, форматирования и тестов.
- Реализованы `types.ts`, `ExerciseRenderer`, common-компоненты упражнений.
- Реализованы все 6 типов: `TrueFalse`, `MultipleChoice`, `FillTheBlank`, `MatchPairs`,
  `OrderSteps`, `Crossword` в режимах `inline` и `test`.
- Для `MatchPairs` и `OrderSteps` добавлен drag-and-drop и клавиатурная альтернатива.
- Реализованы `evaluate` функции для всех типов с поддержкой частичной правильности.
- Добавлены unit-тесты для evaluate-функций всех типов (`Vitest`).
- Test-режим покрывает 11 заданий разного типа.
- Реализован `TestSessionProvider` с централизованным состоянием и восстановлением из `localStorage`.
- Обновлен `/test`: пошаговый сценарий прохождения (1 вопрос за раз) и переход к финальным результатам.
- Реализована страница `/results`: процент и уровень, score/maxScore, разбор по вопросам, weak topics.
- В test-режиме добавлен сценарий `Не знаю`: можно пропустить вопрос, получить `0` баллов и перейти дальше.
- Добавлены unit-тесты для `scoring` логики (`aggregateScores`, `getWeakTopics`).
- Упражнения встроены прямо в текст статей через MDX-слоты (`ExerciseInline`), а не вынесены отдельным блоком внизу.
- Доведены UX/accessibility улучшения: `focus-visible`, `aria-label`, улучшенная читаемость интерактивов.

## План следующих этапов

1. Финальная сдаточная упаковка README и самопроверка по Definition of Done (Milestone 6).
