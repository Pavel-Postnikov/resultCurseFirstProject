# Frontend Interview Portal + Knowledge Journey

Образовательный портал для подготовки к frontend-собеседованию. Модуль 1 — статьи с inline-упражнениями и test-режим. Модуль 2 — **Knowledge Journey**: AI-генерируемые обучающие маршруты с таймером, геймификацией и финальным отчётом.

---

## Модуль 2 — Knowledge Journey

### Что это

Система, которая превращает любую тему в **активный опыт обучения**. Тема разбивается на чекпоинты — каждый содержит теорию и 3–5 упражнений. Всё под давлением таймера, с XP, стриком и итоговым отчётом.

### Как попробовать

1. Запустить проект (`npm run dev`)
2. Открыть `http://localhost:3000/journey`
3. Нажать «Начать путешествие»
4. Прочитать теорию → нажать «Перейти к упражнениям»
5. Ответить на упражнения под таймером
6. Получить финальный отчёт с XP, точностью и разбором по чекпоинтам

### Как генерировать новый Journey

Готовый системный промпт лежит в `content/prompts/generate-journey.md`.

1. Скопировать блок `## System Prompt` целиком
2. Вставить в любой AI (Claude, GPT-4, Gemini через [openrouter.ai](https://openrouter.ai))
3. Отправить user-message: `Создай Knowledge Journey по теме: [ТЕМА]`
4. Полученный JSON сохранить в `content/journeys/<slug>.json`
5. В `src/lib/journey.ts` поменять путь к файлу
6. Перезапустить сервер

### Архитектура Journey

```
content/journeys/js-interview.json   ← статический JSON с чекпоинтами и упражнениями
src/types/journey.ts                 ← TypeScript-типы: Journey, JourneyCheckpoint, ...
src/lib/journey.ts                   ← загрузка JSON
src/app/journey/page.tsx             ← Server Component (загружает journey)
src/app/journey/JourneyClient.tsx    ← машина состояний (start → checkpoint → report)
src/components/journey/
  TheoryRenderer.tsx                 ← markdown-рендерер теории (параграфы, код, списки)
  CheckpointTimer.tsx                ← SVG-таймер с цветовой индикацией
```

#### Машина состояний

```
"start"  →  "checkpoint" (sub: "theory" → "exercises" → "done")  →  "report"
                ↑_______________________________________________↑
                          (следующий чекпоинт)
```

#### Таймер

- Запускается при переходе к упражнениям
- Визуально меняет цвет: синий → оранжевый (<60с) → красный с пульсацией (<30с)
- При истечении времени — автоматическое завершение чекпоинта

#### Формула XP

```
baseXP    = xpReward × accuracy
speedBonus = +10% если осталось >50% времени
streakBonus = +20% если maxStreak ≥ 3
итого     = baseXP + speedBonus + streakBonus
```

### Готовый контент: JS-собеседование

Файл `content/journeys/js-interview.json` — 5 чекпоинтов, 17 упражнений, 750 XP максимум:

| Чекпоинт | Тема | XP |
|---|---|---|
| 1 | Замыкания и область видимости | 100 |
| 2 | Event Loop и асинхронность | 150 |
| 3 | Прототипы и наследование | 150 |
| 4 | `this` и контекст выполнения | 150 |
| 5 | Промисы и async/await | 200 |

### Новый тип упражнения — SpotTheBug

Самостоятельно разработанный тип (требование: «минимум 1 новый компонент»).

Студенту показан код разбитый на строки — нужно кликнуть на строку с ошибкой.

- В `inline`-режиме: 2 попытки, после второй неверной — подсветка правильного ответа
- В `test`-режиме: 1 попытка
- Цветовая обратная связь: зелёный (верно), красный (неверно), оранжевый (раскрытие)
- Оценка детерминированная — без AI

```typescript
// payload
{
  lines: string[];       // код построчно
  bugLineIndex: number;  // индекс строки с ошибкой (от 0)
  hint?: string;         // необязательная подсказка
}
```

---

## Модуль 1 — Portal (статус выполнения)

- Milestone 1: `Выполнено` (каркас Next.js + TS + MDX)
- Milestone 2: `Выполнено` (архитектура упражнений + 2 типа с evaluate и тестами)
- Milestone 3: `Выполнено` (остальные 4 типа, частичная оценка, DnD для MatchPairs)
- Milestone 4: `Выполнено` (TestSessionProvider, сохранение прогресса, финальный экран)
- Milestone 5: `Выполнено` (контент статей, inline-упражнения, UX/accessibility)
- Milestone 6: `Выполнено` (финальная документация и самопроверка)
- Milestone 7: `Выполнено` (motion foundations и полировка интеракций)
- Milestone 8: `Выполнено частично` (OrderSteps DnD v2, анимации статей и `/results`)
- Milestone 9: `Выполнено` (smoke e2e на Playwright + demo-checklist)

---

## Стек

- **Next.js 14 (App Router)** — маршрутизация, SSG, Server Components
- **TypeScript** — строгие типы для упражнений, ответов, Journey
- **MDX** — контент и компоненты в одном файле (статьи)
- **CSS Modules + CSS variables** — изоляция стилей, дизайн-система
- **framer-motion** — анимации переходов и упражнений
- **dnd-kit** — drag-and-drop для OrderSteps и MatchPairs
- **Vitest** — unit-тесты evaluate-функций
- **Playwright** — e2e smoke-тесты

---

## Архитектура упражнений (Модуль 1 + 2)

1. Типы описаны в `src/components/exercises/types.ts` (discriminated union)
2. `ExerciseRenderer` выбирает компонент по `exercise.type`
3. Для каждого типа — чистая `evaluate`-функция в `src/lib/evaluation/*`
4. Режимы: `inline` (в статье, 2 попытки) и `test` (1 попытка, результат в провайдер)

### Реализованные типы

| Тип | Описание |
|---|---|
| `TrueFalse` | Верно/Неверно |
| `MultipleChoice` | Один из четырёх вариантов |
| `FillTheBlank` | Вставить пропущенное слово |
| `MatchPairs` | Drag-and-drop соответствий |
| `OrderSteps` | Упорядочить шаги |
| `Crossword` | Кастомный кроссворд |
| `SpotTheBug` | Найти строку с ошибкой в коде *(новый — Модуль 2)* |

---

## Маршруты

| URL | Описание |
|---|---|
| `/` | Главная |
| `/articles` | Список статей |
| `/articles/js-core` | Статья: JS Core |
| `/articles/react-ts` | Статья: React + TypeScript |
| `/articles/browser-interview` | Статья: Browser APIs |
| `/test` | Test-режим (пошаговый проход) |
| `/results` | Финальный экран результатов |
| `/journey` | Knowledge Journey *(Модуль 2)* |

---

## Запуск локально

```bash
nvm use        # Node.js >= 20
npm install
npm run dev
```

Открыть: `http://localhost:3000`

## Команды

```bash
npm run format:check   # проверка форматирования
npm run lint           # линтер
npm run test           # unit-тесты (Vitest)
npm run build          # production-сборка
```

## E2E

```bash
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui    # интерактивный режим
```

---

## Соответствие требованиям Модуль 2

| Критерий | Статус |
|---|---|
| Система генерирует journey и позволяет его проходить | ✅ `/journey` + JSON-контент |
| Качество генерации: вопросы осмысленные, разнообразные | ✅ 7 типов упражнений, промпт в `content/prompts/` |
| UX: давление ощущается | ✅ таймер с пульсацией, цветовые сигналы |
| Геймификация: мотивирует продолжать | ✅ XP, стрик, бонусы за скорость и серию |
| Финальный отчёт | ✅ медаль, точность, XP, разбор по чекпоинтам |
| Минимум 1 новый компонент | ✅ `SpotTheBug` — найди строку с ошибкой |
| README с описанием архитектуры и инструкцией | ✅ этот файл |
| Промпт для AI-генерации | ✅ `content/prompts/generate-journey.md` |

---

## Деплой

Модуль 1 задеплоен на Vercel: https://result-curse-first-project.vercel.app/

Маршрут `/journey` доступен после деплоя нового кода.
