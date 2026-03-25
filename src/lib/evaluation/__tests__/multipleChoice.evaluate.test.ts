import { describe, expect, it } from "vitest";
import type { Exercise, MultipleChoiceAnswer } from "@/components/exercises/types";
import { evaluateMultipleChoice } from "../multipleChoice.evaluate";

const singleChoiceExercise: Extract<Exercise, { type: "multiple-choice" }> = {
  id: "react-ts-ex-01",
  type: "multiple-choice",
  question: "Какой хук хранит изменяемое значение без ререндера?",
  explanation: "useRef хранит mutable значение и не вызывает ререндер.",
  payload: {
    allowMultiple: false,
    options: [
      { id: "a", text: "useState" },
      { id: "b", text: "useEffect" },
      { id: "c", text: "useRef" },
    ],
    correctOptionIds: ["c"],
  },
  tags: ["react-hooks"],
};

const multipleChoiceExercise: Extract<Exercise, { type: "multiple-choice" }> = {
  id: "browser-interview-ex-01",
  type: "multiple-choice",
  question: "Выбери безопасные cookie-флаги",
  explanation: "HttpOnly и Secure повышают безопасность cookie.",
  payload: {
    allowMultiple: true,
    options: [
      { id: "a", text: "HttpOnly" },
      { id: "b", text: "Secure" },
      { id: "c", text: "UnsafeAny" },
    ],
    correctOptionIds: ["a", "b"],
  },
  tags: ["cookies", "security"],
};

describe("evaluateMultipleChoice", () => {
  it("корректно проверяет single-choice", () => {
    const answer: MultipleChoiceAnswer = { selectedOptionIds: ["c"] };

    const result = evaluateMultipleChoice(singleChoiceExercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });

  it("для multi-choice возвращает частичный балл при одном верном и одном лишнем варианте", () => {
    const answer: MultipleChoiceAnswer = { selectedOptionIds: ["a", "c"] };

    const result = evaluateMultipleChoice(multipleChoiceExercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0.5);
    expect(result.details?.mistakes).toContain("Есть лишние выбранные варианты");
  });

  it("для multi-choice возвращает полный балл только для точного ответа", () => {
    const answer: MultipleChoiceAnswer = { selectedOptionIds: ["a", "b"] };

    const result = evaluateMultipleChoice(multipleChoiceExercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });
});
