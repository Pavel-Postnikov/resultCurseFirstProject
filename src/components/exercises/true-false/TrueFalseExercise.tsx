"use client";

import { useMemo, useState } from "react";
import { evaluateTrueFalse } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  ExerciseComponentProps,
  ExerciseStatus,
  Exercise,
  TrueFalseAnswer,
} from "../types";
import styles from "./TrueFalseExercise.module.css";

type TrueFalseExerciseType = Extract<Exercise, { type: "true-false" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

export function TrueFalseExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<TrueFalseExerciseType, TrueFalseAnswer>) {
  const [selected, setSelected] = useState<boolean | null>(initialAnswer?.value ?? null);
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const canCheck = !readonly && selected !== null && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const statement = useMemo(() => exercise.payload.statement || exercise.question, [exercise]);

  function handleCheck() {
    if (!canCheck || selected === null) {
      return;
    }

    const answer: TrueFalseAnswer = { value: selected };
    const nextResult = evaluateTrueFalse(exercise, answer);

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
      typeLabel="True/False"
    >
      <p className={styles.statement}>{statement}</p>

      <div className={styles.optionRow}>
        <button
          type="button"
          onClick={() => setSelected(true)}
          disabled={!!result || !!readonly}
          className={`${styles.option} ${selected === true ? styles.active : ""}`}
        >
          Верно
        </button>
        <button
          type="button"
          onClick={() => setSelected(false)}
          disabled={!!result || !!readonly}
          className={`${styles.option} ${selected === false ? styles.active : ""}`}
        >
          Неверно
        </button>
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
