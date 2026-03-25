import { describe, expect, it } from "vitest";
import type { Exercise, MatchPairsAnswer } from "@/components/exercises/types";
import { evaluateMatchPairs } from "../matchPairs.evaluate";

const exercise: Extract<Exercise, { type: "match-pairs" }> = {
  id: "react-ts-ex-02",
  type: "match-pairs",
  question: "Сопоставь утилиты и описание",
  explanation: "Часть утилит может быть перепутана.",
  payload: {
    left: [
      { id: "l1", text: "Partial" },
      { id: "l2", text: "Pick" },
    ],
    right: [
      { id: "r1", text: "Делает все поля optional" },
      { id: "r2", text: "Выбирает подмножество ключей" },
    ],
    correctPairs: [
      { leftId: "l1", rightId: "r1" },
      { leftId: "l2", rightId: "r2" },
    ],
  },
};

describe("evaluateMatchPairs", () => {
  it("возвращает полный балл при полном совпадении", () => {
    const answer: MatchPairsAnswer = { pairs: { l1: "r1", l2: "r2" } };
    const result = evaluateMatchPairs(exercise, answer);

    expect(result.isCorrect).toBe(true);
    expect(result.score).toBe(1);
  });

  it("возвращает частичный балл при частичном совпадении", () => {
    const answer: MatchPairsAnswer = { pairs: { l1: "r1", l2: "r1" } };
    const result = evaluateMatchPairs(exercise, answer);

    expect(result.isCorrect).toBe(false);
    expect(result.score).toBe(0.5);
  });
});
