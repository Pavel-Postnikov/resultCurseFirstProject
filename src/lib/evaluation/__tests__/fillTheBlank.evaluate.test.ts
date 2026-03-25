import { describe, expect, it } from "vitest";
import type { Exercise, FillTheBlankAnswer } from "@/components/exercises/types";
import { evaluateFillTheBlank } from "../fillTheBlank.evaluate";

const exercise: Extract<Exercise, { type: "fill-the-blank" }> = {
  id: "js-core-ex-03",
  type: "fill-the-blank",
  question: "Заполни пропуски",
  explanation: "Promise callbacks попадают в microtasks.",
  payload: {
    template: "Promise callbacks are {{blank1}} tasks.",
    blanks: [{ id: "blank1", answers: ["micro", "microtask"], caseSensitive: false }],
  },
};

describe("evaluateFillTheBlank", () => {
  it("засчитывает правильный ответ", () => {
    const answer: FillTheBlankAnswer = { values: { blank1: "microtask" } };
    const result = evaluateFillTheBlank(exercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });

  it("возвращает частичный/нулевой результат для неверных пропусков", () => {
    const answer: FillTheBlankAnswer = { values: { blank1: "macro" } };
    const result = evaluateFillTheBlank(exercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0);
    expect(result.details?.mistakes?.length).toBeGreaterThan(0);
  });
});
