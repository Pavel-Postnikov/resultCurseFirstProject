"use client";

import { useMemo, useState } from "react";
import { evaluateMatchPairs } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  Exercise,
  ExerciseComponentProps,
  ExerciseStatus,
  MatchPairsAnswer,
} from "../types";
import styles from "./MatchPairsExercise.module.css";

type MatchPairsExerciseType = Extract<Exercise, { type: "match-pairs" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

function assignUniquePair(
  pairs: Record<string, string>,
  leftId: string,
  rightId: string,
): Record<string, string> {
  const next = { ...pairs };

  for (const [sourceLeftId, sourceRightId] of Object.entries(next)) {
    if (sourceLeftId !== leftId && sourceRightId === rightId) {
      delete next[sourceLeftId];
    }
  }

  if (rightId) {
    next[leftId] = rightId;
  } else {
    delete next[leftId];
  }

  return next;
}

export function MatchPairsExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<MatchPairsExerciseType, MatchPairsAnswer>) {
  const [pairs, setPairs] = useState<Record<string, string>>(initialAnswer?.pairs ?? {});
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [draggingRightId, setDraggingRightId] = useState<string | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const rightMap = useMemo(
    () => Object.fromEntries(exercise.payload.right.map((item) => [item.id, item.text])),
    [exercise.payload.right],
  );

  const allMatched = exercise.payload.left.every((leftItem) => !!pairs[leftItem.id]);
  const canCheck = !readonly && allMatched && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  function updatePair(leftId: string, rightId: string) {
    if (readonly || result) {
      return;
    }

    setPairs((prev) => assignUniquePair(prev, leftId, rightId));
  }

  function handleDrop(leftId: string, droppedRightId: string) {
    updatePair(leftId, droppedRightId);
    setDraggingRightId(null);
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const answer: MatchPairsAnswer = { pairs };
    const nextResult = evaluateMatchPairs(exercise, answer);

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
      typeLabel="Match Pairs"
    >
      <div className={styles.layout}>
        <section className={styles.column}>
          <h4>Термины</h4>
          {exercise.payload.left.map((leftItem) => (
            <div key={leftItem.id} className={styles.leftRow}>
              <p className={styles.leftText}>{leftItem.text}</p>

              <div
                className={styles.dropZone}
                role="group"
                aria-label={`Зона соответствия для термина ${leftItem.text}`}
                tabIndex={0}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const droppedRightId =
                    event.dataTransfer.getData("text/plain") || draggingRightId;
                  if (droppedRightId) {
                    handleDrop(leftItem.id, droppedRightId);
                  }
                }}
              >
                {pairs[leftItem.id] ? rightMap[pairs[leftItem.id]] : "Перетащи сюда определение"}
              </div>

              <label className={styles.selectLabel}>
                <span>Клавиатурная альтернатива:</span>
                <select
                  value={pairs[leftItem.id] ?? ""}
                  onChange={(event) => updatePair(leftItem.id, event.target.value)}
                  disabled={!!readonly || !!result}
                  aria-label={`Выбери определение для термина ${leftItem.text}`}
                >
                  <option value="">Не выбрано</option>
                  {exercise.payload.right.map((rightItem) => (
                    <option key={rightItem.id} value={rightItem.id}>
                      {rightItem.text}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </section>

        <section className={styles.column}>
          <h4>Определения (drag-and-drop)</h4>
          <div className={styles.draggableList}>
            {exercise.payload.right.map((rightItem) => {
              const isUsed = Object.values(pairs).includes(rightItem.id);

              return (
                <button
                  key={rightItem.id}
                  type="button"
                  draggable={!readonly && !result}
                  disabled={!!readonly || !!result}
                  className={`${styles.draggableItem} ${isUsed ? styles.used : ""}`}
                  aria-label={`Определение для перетаскивания: ${rightItem.text}`}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", rightItem.id);
                    setDraggingRightId(rightItem.id);
                  }}
                  onDragEnd={() => setDraggingRightId(null)}
                >
                  {rightItem.text}
                </button>
              );
            })}
          </div>
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
