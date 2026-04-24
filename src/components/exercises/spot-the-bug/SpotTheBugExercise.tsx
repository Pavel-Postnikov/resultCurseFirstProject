"use client";

import { useState } from "react";
import { evaluateSpotTheBug } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  Exercise,
  ExerciseComponentProps,
  ExerciseStatus,
  SpotTheBugAnswer,
} from "../types";
import styles from "./SpotTheBugExercise.module.css";

type SpotTheBugExerciseType = Extract<Exercise, { type: "spot-the-bug" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) return "idle";
  if (result.isCorrect) return "answered-correct";
  return "answered-wrong";
}

export function SpotTheBugExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<SpotTheBugExerciseType, SpotTheBugAnswer>) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    initialAnswer?.selectedLineIndex ?? null,
  );
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const canCheck = !readonly && selectedIndex !== null && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" && !readonly && result !== null && !result.isCorrect && attempts < maxAttempts;

  function handleLineClick(index: number) {
    if (readonly || result) return;
    setSelectedIndex(index);
  }

  function handleCheck() {
    if (!canCheck || selectedIndex === null) return;

    const answer: SpotTheBugAnswer = { selectedLineIndex: selectedIndex };
    const nextResult = evaluateSpotTheBug(exercise, answer);

    setAttempts((prev) => prev + 1);
    setResult(nextResult);
    onSubmit?.(answer, nextResult);
  }

  function handleRetry() {
    if (!canRetry) return;
    setSelectedIndex(null);
    setResult(null);
  }

  const bugIndex = exercise.payload.bugLineIndex;

  function getLineState(index: number): "selected" | "correct" | "wrong" | "reveal" | "idle" {
    if (!result) return index === selectedIndex ? "selected" : "idle";
    if (result.isCorrect && index === bugIndex) return "correct";
    if (!result.isCorrect) {
      if (index === selectedIndex) return "wrong";
      // после maxAttempts показываем правильный ответ
      if (attempts >= maxAttempts && index === bugIndex) return "reveal";
    }
    return "idle";
  }

  return (
    <ExerciseCard
      mode={mode}
      title={exercise.title}
      question={exercise.question}
      status={status}
      typeLabel="Spot the Bug"
    >
      <div className={styles.instructions}>
        Нажми на строку с ошибкой
      </div>

      <div className={styles.codeBlock} role="list" aria-label="Строки кода">
        {exercise.payload.lines.map((line, index) => {
          const lineState = getLineState(index);
          return (
            <button
              key={index}
              type="button"
              role="listitem"
              disabled={!!readonly || !!result}
              onClick={() => handleLineClick(index)}
              className={`${styles.line} ${styles[lineState]}`}
              aria-label={`Строка ${index + 1}: ${line}`}
              aria-pressed={selectedIndex === index}
            >
              <span className={styles.lineNumber}>{index + 1}</span>
              <span className={styles.lineContent}>{line}</span>
              {lineState === "correct" && <span className={styles.badge}>✓ ошибка здесь</span>}
              {lineState === "wrong" && <span className={styles.badge}>✗ не эта</span>}
              {lineState === "reveal" && <span className={styles.badge}>← ошибка здесь</span>}
            </button>
          );
        })}
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
