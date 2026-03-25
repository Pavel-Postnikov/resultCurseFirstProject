import { describe, expect, it } from "vitest";
import type { Exercise, OrderStepsAnswer } from "@/components/exercises/types";
import { evaluateOrderSteps } from "../orderSteps.evaluate";

const exercise: Extract<Exercise, { type: "order-steps" }> = {
  id: "browser-interview-ex-02",
  type: "order-steps",
  question: "Расставь порядок обработки fetch",
  explanation: "Сначала запрос, затем проверка статуса, потом парсинг данных.",
  payload: {
    steps: [
      { id: "s1", text: "Выполнить fetch" },
      { id: "s2", text: "Проверить response.ok" },
      { id: "s3", text: "Вызвать response.json" },
    ],
    correctOrder: ["s1", "s2", "s3"],
  },
};

describe("evaluateOrderSteps", () => {
  it("возвращает 1 при правильном порядке", () => {
    const answer: OrderStepsAnswer = { orderedStepIds: ["s1", "s2", "s3"] };
    const result = evaluateOrderSteps(exercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });

  it("возвращает частичный балл при частично верном порядке", () => {
    const answer: OrderStepsAnswer = { orderedStepIds: ["s1", "s3", "s2"] };
    const result = evaluateOrderSteps(exercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBeCloseTo(0.33, 2);
  });
});
