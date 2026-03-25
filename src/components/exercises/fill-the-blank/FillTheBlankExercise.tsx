"use client";

import { useMemo, useState } from "react";
import { evaluateFillTheBlank } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  Exercise,
  ExerciseComponentProps,
  ExerciseStatus,
  FillTheBlankAnswer,
} from "../types";
import styles from "./FillTheBlankExercise.module.css";

type FillTheBlankExerciseType = Extract<Exercise, { type: "fill-the-blank" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

function parseTemplate(
  template: string,
): Array<{ kind: "text"; value: string } | { kind: "blank"; id: string }> {
  const result: Array<{ kind: "text"; value: string } | { kind: "blank"; id: string }> = [];
  const regex = /{{(.*?)}}/g;

  let lastIndex = 0;
  let match = regex.exec(template);

  while (match) {
    if (match.index > lastIndex) {
      result.push({ kind: "text", value: template.slice(lastIndex, match.index) });
    }

    result.push({ kind: "blank", id: match[1].trim() });
    lastIndex = regex.lastIndex;
    match = regex.exec(template);
  }

  if (lastIndex < template.length) {
    result.push({ kind: "text", value: template.slice(lastIndex) });
  }

  return result;
}

export function FillTheBlankExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<FillTheBlankExerciseType, FillTheBlankAnswer>) {
  const [values, setValues] = useState<Record<string, string>>(initialAnswer?.values ?? {});
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const maxAttempts = mode === "inline" ? 2 : 1;
  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const templateParts = useMemo(
    () => parseTemplate(exercise.payload.template),
    [exercise.payload.template],
  );

  const allFilled = exercise.payload.blanks.every(
    (blank) => (values[blank.id] ?? "").trim().length > 0,
  );
  const canCheck = !readonly && allFilled && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  function handleChange(id: string, nextValue: string) {
    if (readonly || result) {
      return;
    }

    setValues((prev) => ({
      ...prev,
      [id]: nextValue,
    }));
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const answer: FillTheBlankAnswer = { values };
    const nextResult = evaluateFillTheBlank(exercise, answer);

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
      typeLabel="Fill The Blank"
    >
      <p className={styles.templateLine}>
        {templateParts.map((part, index) => {
          if (part.kind === "text") {
            return <span key={`text-${index}`}>{part.value}</span>;
          }

          return (
            <input
              key={`${part.id}-${index}`}
              className={styles.blankInput}
              value={values[part.id] ?? ""}
              onChange={(event) => handleChange(part.id, event.target.value)}
              placeholder={part.id}
              disabled={!!readonly || !!result}
            />
          );
        })}
      </p>

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
