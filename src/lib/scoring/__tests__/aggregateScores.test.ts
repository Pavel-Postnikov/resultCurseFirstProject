import { describe, expect, it } from "vitest";
import type { Exercise } from "@/components/exercises/types";
import { aggregateScores, type TestSessionItemResult } from "../aggregateScores";

const exercises: Exercise[] = [
  {
    id: "js-core-ex-01",
    type: "true-false",
    question: "q1",
    explanation: "e1",
    tags: ["event-loop"],
    payload: { statement: "s", correct: true },
  },
  {
    id: "react-ts-ex-01",
    type: "multiple-choice",
    question: "q2",
    explanation: "e2",
    tags: ["react-hooks"],
    payload: {
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["a"],
    },
  },
  {
    id: "react-ts-ex-02",
    type: "multiple-choice",
    question: "q3",
    explanation: "e3",
    tags: ["react-hooks"],
    payload: {
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
      ],
      correctOptionIds: ["b"],
    },
  },
];

describe("aggregateScores", () => {
  it("считает total и прогресс по типам", () => {
    const results: Record<string, TestSessionItemResult> = {
      "js-core-ex-01": {
        exerciseId: "js-core-ex-01",
        answer: { value: true },
        result: { isCorrect: true, score: 1, maxScore: 1, feedback: "ok" },
      },
      "react-ts-ex-01": {
        exerciseId: "react-ts-ex-01",
        answer: { selectedOptionIds: ["a"] },
        result: { isCorrect: false, score: 0.5, maxScore: 1, feedback: "partial" },
      },
    };

    const aggregated = aggregateScores(exercises, results);

    expect(aggregated.totalCount).toBe(3);
    expect(aggregated.answeredCount).toBe(2);
    expect(aggregated.totalScore).toBe(1.5);
    expect(aggregated.totalMaxScore).toBe(2);
    expect(aggregated.percentage).toBe(75);

    const mc = aggregated.byType.find((item) => item.type === "multiple-choice");
    expect(mc).toBeDefined();
    expect(mc?.total).toBe(2);
    expect(mc?.answered).toBe(1);
  });
});
