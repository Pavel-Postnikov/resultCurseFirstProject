import { describe, expect, it } from "vitest";
import type { CrosswordAnswer, Exercise } from "@/components/exercises/types";
import { evaluateCrossword } from "../crossword.evaluate";

const exercise: Extract<Exercise, { type: "crossword" }> = {
  id: "browser-interview-ex-03",
  type: "crossword",
  question: "Заполни термины",
  explanation: "Ключевые термины из web APIs",
  payload: {
    size: { rows: 5, cols: 5 },
    words: [
      {
        id: "w1",
        clue: "Политика браузера для кросс-доменных запросов",
        answer: "CORS",
        start: { row: 0, col: 0 },
        direction: "across",
      },
      {
        id: "w2",
        clue: "Хранилище данных на сессию",
        answer: "SESSION",
        start: { row: 1, col: 0 },
        direction: "down",
      },
    ],
  },
};

describe("evaluateCrossword", () => {
  it("засчитывает полностью верное заполнение", () => {
    const answer: CrosswordAnswer = { values: { w1: "cors", w2: "session" } };
    const result = evaluateCrossword(exercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });

  it("возвращает частичный балл при частично верном заполнении", () => {
    const answer: CrosswordAnswer = { values: { w1: "cors", w2: "storage" } };
    const result = evaluateCrossword(exercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0.5);
  });
});
