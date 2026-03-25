import type { Exercise } from "@/components/exercises/types";

const inlineExercisesBySlug: Record<string, Exercise[]> = {
  "js-core": [
    {
      id: "js-core-ex-01",
      type: "true-false",
      title: "Event Loop: базовая проверка",
      question: "Верно ли утверждение про приоритет microtasks?",
      explanation:
        "В JavaScript после завершения синхронного кода сначала выполняются microtasks (например, Promise.then), и только потом macrotasks (например, setTimeout).",
      tags: ["event-loop", "javascript"],
      payload: {
        statement: "Колбэки Promise выполняются перед setTimeout(0).",
        correct: true,
      },
    },
    {
      id: "js-core-ex-02",
      type: "multiple-choice",
      title: "Call Stack и очереди",
      question: "Что из перечисленного относится к microtasks?",
      explanation:
        "Promise callbacks относятся к microtasks. setTimeout и setInterval относятся к macrotasks.",
      tags: ["event-loop", "microtasks"],
      payload: {
        allowMultiple: true,
        options: [
          { id: "a", text: "Promise.then" },
          { id: "b", text: "setTimeout" },
          { id: "c", text: "queueMicrotask" },
        ],
        correctOptionIds: ["a", "c"],
      },
    },
    {
      id: "js-core-ex-03",
      type: "fill-the-blank",
      title: "Заполни пропуски про Event Loop",
      question: "Вставь термины про порядок выполнения задач.",
      explanation:
        "После выполнения синхронного кода Event Loop сначала очищает очередь microtasks, затем берет macrotask.",
      tags: ["event-loop", "async"],
      payload: {
        template:
          "После sync-кода сначала выполняются {{blank1}}, а затем начинается следующая {{blank2}}.",
        blanks: [
          { id: "blank1", answers: ["microtasks", "microtask"], caseSensitive: false },
          { id: "blank2", answers: ["macrotask", "macrotasks"], caseSensitive: false },
        ],
      },
    },
    {
      id: "js-core-ex-04",
      type: "order-steps",
      title: "Порядок выполнения в Event Loop",
      question: "Расположи шаги в корректной последовательности.",
      explanation: "Сначала выполняется sync-код, затем microtasks, затем следующая macrotask.",
      tags: ["event-loop", "call-stack"],
      payload: {
        steps: [
          { id: "s1", text: "Выполняется синхронный код текущей задачи" },
          { id: "s2", text: "Очищается очередь microtasks" },
          { id: "s3", text: "Запускается следующая macrotask" },
        ],
        correctOrder: ["s1", "s2", "s3"],
      },
    },
  ],
  "react-ts": [
    {
      id: "react-ts-ex-01",
      type: "multiple-choice",
      title: "React Hooks",
      question: "Какой хук хранит значение между рендерами и не вызывает ререндер при изменении?",
      explanation: "useRef хранит mutable-значение и не триггерит ререндер компонента.",
      tags: ["react-hooks", "typescript"],
      payload: {
        allowMultiple: false,
        options: [
          { id: "a", text: "useState" },
          { id: "b", text: "useRef" },
          { id: "c", text: "useEffect" },
        ],
        correctOptionIds: ["b"],
      },
    },
    {
      id: "react-ts-ex-02",
      type: "match-pairs",
      title: "TypeScript utility types",
      question: "Сопоставь utility type и его назначение.",
      explanation:
        "Partial делает поля optional, Pick выбирает subset ключей, Omit исключает ключи из исходного типа.",
      tags: ["typescript", "utility-types"],
      payload: {
        left: [
          { id: "l1", text: "Partial<T>" },
          { id: "l2", text: "Pick<T, K>" },
          { id: "l3", text: "Omit<T, K>" },
        ],
        right: [
          { id: "r1", text: "Выбирает подмножество ключей из типа" },
          { id: "r2", text: "Делает все поля необязательными" },
          { id: "r3", text: "Удаляет выбранные ключи из типа" },
        ],
        correctPairs: [
          { leftId: "l1", rightId: "r2" },
          { leftId: "l2", rightId: "r1" },
          { leftId: "l3", rightId: "r3" },
        ],
      },
    },
    {
      id: "react-ts-ex-03",
      type: "fill-the-blank",
      title: "Generics в TypeScript",
      question: "Заполни пропуски в generic-функции.",
      explanation:
        "Generic-функция сохраняет тип аргумента и возвращает это же значение без потери type safety.",
      tags: ["typescript", "generics"],
      payload: {
        template: "function identity<{{blank1}}>(value: {{blank1}}): {{blank1}} { return value; }",
        blanks: [{ id: "blank1", answers: ["T"], caseSensitive: true }],
      },
    },
  ],
  "browser-interview": [
    {
      id: "browser-interview-ex-01",
      type: "true-false",
      title: "CORS",
      question:
        "Нужно ли серверу явно отдавать CORS-заголовки для кросс-доменных XHR/fetch запросов?",
      explanation:
        "Да, браузер применяет CORS-политику и ожидает корректные заголовки ответа от сервера.",
      tags: ["cors", "http"],
      payload: {
        statement: "Без CORS-заголовков браузер может заблокировать доступ к ответу.",
        correct: true,
      },
    },
    {
      id: "browser-interview-ex-02",
      type: "order-steps",
      title: "Fetch: базовый pipeline",
      question: "Расставь шаги обработки HTTP-ответа в корректном порядке.",
      explanation:
        "Типичный flow: отправить запрос, проверить статус, распарсить тело, обработать данные.",
      tags: ["fetch", "http"],
      payload: {
        steps: [
          { id: "s1", text: "Вызвать fetch(url)" },
          { id: "s2", text: "Проверить response.ok / status" },
          { id: "s3", text: "Распарсить JSON через response.json()" },
          { id: "s4", text: "Использовать данные в UI/логике" },
        ],
        correctOrder: ["s1", "s2", "s3", "s4"],
      },
    },
    {
      id: "browser-interview-ex-03",
      type: "crossword",
      title: "Кроссворд по Web API терминам",
      question: "Заполни ключевые термины по подсказкам.",
      explanation:
        "Кроссворд закрепляет терминологию: CORS, Cookie и Fetch встречаются почти в каждом frontend-интервью.",
      tags: ["web-api", "interview"],
      payload: {
        size: { rows: 7, cols: 7 },
        words: [
          {
            id: "w1",
            clue: "Политика браузера для кросс-доменных запросов",
            answer: "CORS",
            start: { row: 1, col: 1 },
            direction: "across",
          },
          {
            id: "w2",
            clue: "Небольшие данные, которые браузер отправляет с запросами",
            answer: "COOKIE",
            start: { row: 0, col: 2 },
            direction: "down",
          },
          {
            id: "w3",
            clue: "Web API для HTTP-запросов в браузере",
            answer: "FETCH",
            start: { row: 5, col: 1 },
            direction: "across",
          },
        ],
      },
    },
    {
      id: "browser-interview-ex-04",
      type: "match-pairs",
      title: "Безопасность cookies",
      question: "Сопоставь атрибут cookie и его эффект.",
      explanation:
        "HttpOnly скрывает cookie от JS, Secure требует HTTPS, SameSite управляет кросс-сайтовой отправкой.",
      tags: ["cookies", "security"],
      payload: {
        left: [
          { id: "l1", text: "HttpOnly" },
          { id: "l2", text: "Secure" },
          { id: "l3", text: "SameSite" },
        ],
        right: [
          { id: "r1", text: "Ограничивает отправку cookie в cross-site сценариях" },
          { id: "r2", text: "Запрещает доступ к cookie из JavaScript" },
          { id: "r3", text: "Разрешает cookie только по HTTPS" },
        ],
        correctPairs: [
          { leftId: "l1", rightId: "r2" },
          { leftId: "l2", rightId: "r3" },
          { leftId: "l3", rightId: "r1" },
        ],
      },
    },
  ],
};

export const milestone3TestExercises: Exercise[] = [
  ...inlineExercisesBySlug["js-core"],
  ...inlineExercisesBySlug["react-ts"],
  ...inlineExercisesBySlug["browser-interview"],
];

export function getInlineExercisesForArticle(slug: string): Exercise[] {
  return inlineExercisesBySlug[slug] ?? [];
}
