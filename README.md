# Frontend Interview Portal

Образовательный портал для подготовки к frontend-собеседованию: теория + интерактивная практика внутри статей.

## Статус

- Milestone 1 в работе: поднят каркас на `Next.js + TypeScript + MDX`.

## Технологии

- Next.js (App Router)
- TypeScript
- MDX
- ESLint + Prettier
- Vitest (подготовлен для unit-тестов evaluate-логики)

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
- `/test` — каркас test-режима
- `/results` — каркас страницы результатов

## Что уже сделано

- Подключен MDX и вынесены 3 статьи-заглушки.
- Подготовлены slug: `js-core`, `react-ts`, `browser-interview`.
- Зафиксирован формат `exercise.id`: `<articleSlug>-ex-<nn>`.
- Добавлены команды для линтинга, форматирования и тестов.

## План следующих этапов

1. Реализовать архитектуру упражнений (`ExerciseRenderer` + `evaluate`).
2. Добавить 6 типов задач, включая кастомный `Crossword`.
3. Реализовать test-сессию, прогресс и итоговый разбор.
4. Добавить unit-тесты для evaluate-функций.
