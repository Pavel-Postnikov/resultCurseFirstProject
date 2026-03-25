import { describe, expect, it } from "vitest";
import type { Exercise, TrueFalseAnswer } from "@/components/exercises/types";
import { evaluateTrueFalse } from "../trueFalse.evaluate";

const exercise: Extract<Exercise, { type: "true-false" }> = {
  id: "js-core-ex-01",
  type: "true-false",
  question: "Promise callbacks выполняются раньше macrotasks?",
  explanation: "В event loop microtasks обрабатываются перед macrotasks.",
  payload: {
    statement: "Promise callbacks выполняются раньше macrotasks",
    correct: true,
  },
  tags: ["event-loop"],
};

describe("evaluateTrueFalse", () => {
  it("возвращает 1 балл для правильного ответа", () => {
    const answer: TrueFalseAnswer = { value: true };

    const result = evaluateTrueFalse(exercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
    expect(result.maxScore).toBe(1);
  });

  it("возвращает 0 баллов для неправильного ответа", () => {
    const answer: TrueFalseAnswer = { value: false };

    const result = evaluateTrueFalse(exercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
    expect(result.details?.mistakes?.length).toBeGreaterThan(0);
  });
});
