"use client";

import { useMemo, useState } from "react";
import { evaluateMultipleChoice } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  ExerciseComponentProps,
  ExerciseStatus,
  Exercise,
  MultipleChoiceAnswer,
} from "../types";
import styles from "./MultipleChoiceExercise.module.css";

type MultipleChoiceExerciseType = Extract<Exercise, { type: "multiple-choice" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

export function MultipleChoiceExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<MultipleChoiceExerciseType, MultipleChoiceAnswer>) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    initialAnswer?.selectedOptionIds ?? [],
  );
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const { allowMultiple = false } = exercise.payload;

  const canCheck =
    !readonly && selectedOptionIds.length > 0 && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const inputType = allowMultiple ? "checkbox" : "radio";
  const groupName = useMemo(() => `mc-${exercise.id}`, [exercise.id]);

  function updateSelection(optionId: string) {
    if (readonly || result) {
      return;
    }

    if (!allowMultiple) {
      setSelectedOptionIds([optionId]);
      return;
    }

    setSelectedOptionIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    );
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const answer: MultipleChoiceAnswer = { selectedOptionIds };
    const nextResult = evaluateMultipleChoice(exercise, answer);

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
      typeLabel="Multiple Choice"
    >
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Варианты ответа</legend>
        <div className={styles.options}>
          {exercise.payload.options.map((option) => {
            const checked = selectedOptionIds.includes(option.id);

            return (
              <label key={option.id} className={`${styles.option} ${checked ? styles.active : ""}`}>
                <input
                  type={inputType}
                  name={groupName}
                  checked={checked}
                  onChange={() => updateSelection(option.id)}
                  disabled={!!readonly || !!result}
                  aria-label={`Вариант: ${option.text}`}
                />
                <span>{option.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

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
