"use client";

import { useMemo, useState } from "react";
import { buildCrosswordModel, normalizeCrosswordInput } from "@/lib/crossword/model";
import { evaluateCrossword } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  CrosswordAnswer,
  EvaluationResult,
  Exercise,
  ExerciseComponentProps,
  ExerciseStatus,
} from "../types";
import styles from "./CrosswordExercise.module.css";

type CrosswordExerciseType = Extract<Exercise, { type: "crossword" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

function getDirectionLabel(direction: "across" | "down"): string {
  return direction === "across" ? "→" : "↓";
}

export function CrosswordExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<CrosswordExerciseType, CrosswordAnswer>) {
  const [values, setValues] = useState<Record<string, string>>(initialAnswer?.values ?? {});
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const model = useMemo(() => buildCrosswordModel(exercise.payload), [exercise.payload]);

  const expectedLengthMap = useMemo(
    () =>
      Object.fromEntries(
        exercise.payload.words.map((word) => [
          word.id,
          normalizeCrosswordInput(word.answer, word.answer.length).length,
        ]),
      ),
    [exercise.payload.words],
  );

  function getCellState(cellRefs: Array<{ wordId: string; charIndex: number }>) {
    const chars = cellRefs
      .map((ref) => (values[ref.wordId] ?? "")[ref.charIndex] ?? "")
      .filter((value) => value.length > 0)
      .map((value) => value.toUpperCase());

    if (chars.length === 0) {
      return { char: "", isConflict: false };
    }

    const unique = Array.from(new Set(chars));

    if (unique.length === 1) {
      return { char: unique[0], isConflict: false };
    }

    return { char: "•", isConflict: true };
  }

  const hasCellConflicts = Array.from(model.cellMap.values()).some(
    (cell) => getCellState(cell.refs).isConflict,
  );

  const allFilled = exercise.payload.words.every((word) => {
    const expectedLength = expectedLengthMap[word.id];
    return (values[word.id] ?? "").length === expectedLength;
  });

  const canCheck =
    !readonly &&
    model.isValid &&
    !hasCellConflicts &&
    allFilled &&
    result === null &&
    attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  function handleChange(wordId: string, nextValue: string) {
    if (readonly || result) {
      return;
    }

    const expectedLength = expectedLengthMap[wordId];
    const normalizedValue = normalizeCrosswordInput(nextValue, expectedLength);

    setValues((prev) => ({
      ...prev,
      [wordId]: normalizedValue,
    }));
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const answer: CrosswordAnswer = { values };
    const nextResult = evaluateCrossword(exercise, answer);

    setAttempts((prev) => prev + 1);
    setResult(nextResult);
    onSubmit?.(answer, nextResult);
  }

  function handleRetry() {
    if (!canRetry) {
      return;
    }

    setResult(null);
  }

  return (
    <ExerciseCard
      mode={mode}
      title={exercise.title}
      question={exercise.question}
      status={status}
      typeLabel="Crossword"
    >
      {!model.isValid ? (
        <section className={styles.warningBox}>
          <p className={styles.warningTitle}>Конфигурация кроссворда содержит ошибки:</p>
          <ul className={styles.warningList}>
            {model.issues.map((issue, index) => (
              <li key={`${issue.type}-${index}`}>{issue.message}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {model.isValid && hasCellConflicts && result === null ? (
        <p className={styles.hint}>
          В пересечениях есть конфликт символов. Исправь слова перед проверкой.
        </p>
      ) : null}

      <div className={styles.layout}>
        <section className={styles.grid} aria-label="Сетка кроссворда">
          {Array.from({ length: exercise.payload.size.rows }).map((_, row) => (
            <div
              key={row}
              className={styles.row}
              style={{ gridTemplateColumns: `repeat(${exercise.payload.size.cols}, 28px)` }}
            >
              {Array.from({ length: exercise.payload.size.cols }).map((__, col) => {
                const cell = model.cellMap.get(`${row}:${col}`);
                if (!cell) {
                  return <span key={`${row}-${col}`} className={styles.emptyCell} />;
                }

                const cellState = getCellState(cell.refs);
                const cellClassName =
                  `${styles.cell} ${cell.refs.length > 1 ? styles.intersection : ""} ${cellState.isConflict ? styles.conflict : ""}`.trim();

                return (
                  <span key={`${row}-${col}`} className={cellClassName}>
                    {cellState.char}
                  </span>
                );
              })}
            </div>
          ))}
        </section>

        <section className={styles.clues}>
          {exercise.payload.words.map((word) => (
            <label key={word.id} className={styles.clueItem}>
              <span className={styles.clueText}>
                {word.id.toUpperCase()} ({getDirectionLabel(word.direction)}): {word.clue}
              </span>
              <input
                value={values[word.id] ?? ""}
                onChange={(event) => handleChange(word.id, event.target.value)}
                disabled={!!readonly || !!result}
                placeholder="Введите слово"
                maxLength={expectedLengthMap[word.id]}
                aria-label={`Ответ для ${word.id.toUpperCase()}: ${word.clue}`}
              />
              <span className={styles.lengthHint}>
                {(values[word.id] ?? "").length}/{expectedLengthMap[word.id]}
              </span>
            </label>
          ))}
        </section>
      </div>

      <ExerciseActions
        mode={mode}
        onCheck={handleCheck}
        onRetry={handleRetry}
        canCheck={canCheck}
        canRetry={canRetry}
      />

      <FeedbackPanel
        result={result}
        status={status}
        explanation={exercise.explanation}
        showExplanation={showExplanation}
      />
    </ExerciseCard>
  );
}
