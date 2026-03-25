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
  ],
};

export const milestone2TestExercises: Exercise[] = [
  inlineExercisesBySlug["js-core"][0],
  inlineExercisesBySlug["js-core"][1],
  inlineExercisesBySlug["react-ts"][0],
  inlineExercisesBySlug["browser-interview"][0],
];

export function getInlineExercisesForArticle(slug: string): Exercise[] {
  return inlineExercisesBySlug[slug] ?? [];
}
