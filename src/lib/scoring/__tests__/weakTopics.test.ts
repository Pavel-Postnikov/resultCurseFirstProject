import { describe, expect, it } from "vitest";
import type { Exercise } from "@/components/exercises/types";
import type { TestSessionItemResult } from "../aggregateScores";
import { getWeakTopics } from "../weakTopics";

const exercises: Exercise[] = [
  {
    id: "js-core-ex-01",
    type: "true-false",
    question: "q1",
    explanation: "e1",
    tags: ["event-loop", "javascript"],
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
    id: "browser-interview-ex-01",
    type: "true-false",
    question: "q3",
    explanation: "e3",
    tags: ["cors"],
    payload: { statement: "s", correct: true },
  },
];

describe("getWeakTopics", () => {
  it("возвращает топ слабых тегов ниже порога", () => {
    const results: Record<string, TestSessionItemResult> = {
      "js-core-ex-01": {
        exerciseId: "js-core-ex-01",
        answer: { value: false },
        result: { isCorrect: false, score: 0, maxScore: 1, feedback: "bad" },
      },
      "react-ts-ex-01": {
        exerciseId: "react-ts-ex-01",
        answer: { selectedOptionIds: ["a"] },
        result: { isCorrect: true, score: 1, maxScore: 1, feedback: "ok" },
      },
      "browser-interview-ex-01": {
        exerciseId: "browser-interview-ex-01",
        answer: { value: true },
        result: { isCorrect: false, score: 0.5, maxScore: 1, feedback: "partial" },
      },
    };

    const weak = getWeakTopics(exercises, results, 60, 3);

    expect(weak.map((item) => item.tag)).toEqual(["event-loop", "javascript", "cors"]);
    expect(weak[0]?.percentage).toBe(0);
    expect(weak[2]?.percentage).toBe(50);
  });
});
