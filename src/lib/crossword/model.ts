import type { CrosswordPayload } from "@/components/exercises/types";

export interface CrosswordCellRef {
  wordId: string;
  charIndex: number;
  expectedChar: string;
}

export interface CrosswordCell {
  row: number;
  col: number;
  refs: CrosswordCellRef[];
}

export type CrosswordValidationIssueType = "out-of-bounds" | "overlap-mismatch" | "disconnected";

export interface CrosswordValidationIssue {
  type: CrosswordValidationIssueType;
  message: string;
}

export interface CrosswordModel {
  cellMap: Map<string, CrosswordCell>;
  issues: CrosswordValidationIssue[];
  isValid: boolean;
}

export function normalizeCrosswordInput(value: string, maxLength: number): string {
  return value.toUpperCase().replace(/\s+/g, "").slice(0, maxLength);
}

function getCellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

function addEdge(adjacency: Map<string, Set<string>>, source: string, target: string) {
  if (!adjacency.has(source)) {
    adjacency.set(source, new Set());
  }

  adjacency.get(source)?.add(target);
}

export function buildCrosswordModel(payload: CrosswordPayload): CrosswordModel {
  const cellMap = new Map<string, CrosswordCell>();
  const issues: CrosswordValidationIssue[] = [];
  const adjacency = new Map<string, Set<string>>();

  for (const word of payload.words) {
    adjacency.set(word.id, new Set());
    const normalizedAnswer = normalizeCrosswordInput(word.answer, word.answer.length);

    for (let charIndex = 0; charIndex < normalizedAnswer.length; charIndex += 1) {
      const row = word.start.row + (word.direction === "down" ? charIndex : 0);
      const col = word.start.col + (word.direction === "across" ? charIndex : 0);

      if (row < 0 || row >= payload.size.rows || col < 0 || col >= payload.size.cols) {
        issues.push({
          type: "out-of-bounds",
          message: `Слово ${word.id} выходит за границы сетки (${row}, ${col}).`,
        });
        continue;
      }

      const key = getCellKey(row, col);
      const existingCell = cellMap.get(key);

      if (!existingCell) {
        cellMap.set(key, {
          row,
          col,
          refs: [
            {
              wordId: word.id,
              charIndex,
              expectedChar: normalizedAnswer[charIndex],
            },
          ],
        });
        continue;
      }

      const mismatchRef = existingCell.refs.find(
        (ref) => ref.expectedChar !== normalizedAnswer[charIndex],
      );

      if (mismatchRef) {
        issues.push({
          type: "overlap-mismatch",
          message: `Конфликт в пересечении (${row}, ${col}) между ${mismatchRef.wordId} и ${word.id}.`,
        });
      }

      for (const ref of existingCell.refs) {
        addEdge(adjacency, word.id, ref.wordId);
        addEdge(adjacency, ref.wordId, word.id);
      }

      existingCell.refs.push({
        wordId: word.id,
        charIndex,
        expectedChar: normalizedAnswer[charIndex],
      });
    }
  }

  if (payload.words.length > 1) {
    const [firstWord] = payload.words;
    const visited = new Set<string>();
    const queue = [firstWord.id];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) {
        continue;
      }

      visited.add(current);

      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }

    if (visited.size !== payload.words.length) {
      const disconnected = payload.words
        .map((word) => word.id)
        .filter((wordId) => !visited.has(wordId));

      issues.push({
        type: "disconnected",
        message: `Слова не образуют связанную сетку: ${disconnected.join(", ")}.`,
      });
    }
  }

  return {
    cellMap,
    issues,
    isValid: issues.length === 0,
  };
}
