import { describe, expect, it } from "vitest";
import type { CrosswordPayload } from "@/components/exercises/types";
import { buildCrosswordModel, normalizeCrosswordInput } from "../model";

describe("normalizeCrosswordInput", () => {
  it("обрезает длину и убирает пробелы", () => {
    expect(normalizeCrosswordInput(" fe tch  ", 5)).toBe("FETCH");
  });
});

describe("buildCrosswordModel", () => {
  const validPayload: CrosswordPayload = {
    size: { rows: 7, cols: 7 },
    words: [
      {
        id: "w1",
        clue: "Политика браузера",
        answer: "CORS",
        start: { row: 1, col: 1 },
        direction: "across",
      },
      {
        id: "w2",
        clue: "Cookie",
        answer: "COOKIE",
        start: { row: 0, col: 2 },
        direction: "down",
      },
      {
        id: "w3",
        clue: "Fetch",
        answer: "FETCH",
        start: { row: 5, col: 1 },
        direction: "across",
      },
    ],
  };

  it("строит валидную связанную сетку", () => {
    const model = buildCrosswordModel(validPayload);

    expect(model.isValid).toBe(true);
    expect(model.issues).toHaveLength(0);
    expect(model.cellMap.size).toBeGreaterThan(0);
  });

  it("находит слово, выходящее за границы", () => {
    const payload: CrosswordPayload = {
      size: { rows: 3, cols: 3 },
      words: [
        {
          id: "w1",
          clue: "Too long",
          answer: "FETCH",
          start: { row: 0, col: 0 },
          direction: "across",
        },
      ],
    };

    const model = buildCrosswordModel(payload);

    expect(model.isValid).toBe(false);
    expect(model.issues.some((issue) => issue.type === "out-of-bounds")).toBe(true);
  });

  it("находит конфликт букв в пересечении", () => {
    const payload: CrosswordPayload = {
      size: { rows: 5, cols: 5 },
      words: [
        {
          id: "w1",
          clue: "Word 1",
          answer: "CAT",
          start: { row: 1, col: 1 },
          direction: "across",
        },
        {
          id: "w2",
          clue: "Word 2",
          answer: "DOG",
          start: { row: 0, col: 2 },
          direction: "down",
        },
      ],
    };

    const model = buildCrosswordModel(payload);

    expect(model.isValid).toBe(false);
    expect(model.issues.some((issue) => issue.type === "overlap-mismatch")).toBe(true);
  });

  it("находит несвязную сетку", () => {
    const payload: CrosswordPayload = {
      size: { rows: 8, cols: 8 },
      words: [
        {
          id: "w1",
          clue: "Word 1",
          answer: "CORS",
          start: { row: 0, col: 0 },
          direction: "across",
        },
        {
          id: "w2",
          clue: "Word 2",
          answer: "FETCH",
          start: { row: 6, col: 1 },
          direction: "across",
        },
      ],
    };

    const model = buildCrosswordModel(payload);

    expect(model.isValid).toBe(false);
    expect(model.issues.some((issue) => issue.type === "disconnected")).toBe(true);
  });
});
