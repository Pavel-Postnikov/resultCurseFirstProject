"use client";

import { useMemo, useState } from "react";
import { evaluateOrderSteps } from "@/lib/evaluation";
import { ExerciseActions } from "../common/ExerciseActions";
import { ExerciseCard } from "../common/ExerciseCard";
import { FeedbackPanel } from "../common/FeedbackPanel";
import type {
  EvaluationResult,
  Exercise,
  ExerciseComponentProps,
  ExerciseStatus,
  OrderStepsAnswer,
} from "../types";
import styles from "./OrderStepsExercise.module.css";

type OrderStepsExerciseType = Extract<Exercise, { type: "order-steps" }>;

function getStatus(result: EvaluationResult | null): ExerciseStatus {
  if (!result) {
    return "idle";
  }

  if (result.isCorrect) {
    return "answered-correct";
  }

  return result.score > 0 ? "answered-partial" : "answered-wrong";
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function OrderStepsExercise({
  exercise,
  mode,
  initialAnswer,
  readonly,
  onSubmit,
}: ExerciseComponentProps<OrderStepsExerciseType, OrderStepsAnswer>) {
  const baseOrder = useMemo(
    () => exercise.payload.steps.map((step) => step.id).reverse(),
    [exercise.payload.steps],
  );

  const [orderedStepIds, setOrderedStepIds] = useState<string[]>(
    initialAnswer?.orderedStepIds ?? baseOrder,
  );
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const stepTextMap = useMemo(
    () => Object.fromEntries(exercise.payload.steps.map((step) => [step.id, step.text])),
    [exercise.payload.steps],
  );

  const maxAttempts = mode === "inline" ? 2 : 1;
  const status = getStatus(result);
  const showExplanation =
    mode === "inline" && !!result && (result.isCorrect || attempts >= maxAttempts);

  const canCheck = !readonly && result === null && attempts < maxAttempts;
  const canRetry =
    mode === "inline" &&
    !readonly &&
    result !== null &&
    !result.isCorrect &&
    attempts < maxAttempts;

  function updateOrder(nextOrder: string[]) {
    if (readonly || result) {
      return;
    }

    setOrderedStepIds(nextOrder);
  }

  function moveByKeyboard(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedStepIds.length) {
      return;
    }

    updateOrder(moveItem(orderedStepIds, index, nextIndex));
  }

  function moveByDrop(targetId: string) {
    if (!draggingId) {
      return;
    }

    const fromIndex = orderedStepIds.indexOf(draggingId);
    const toIndex = orderedStepIds.indexOf(targetId);

    if (fromIndex === -1 || toIndex === -1) {
      return;
    }

    updateOrder(moveItem(orderedStepIds, fromIndex, toIndex));
    setDraggingId(null);
  }

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const answer: OrderStepsAnswer = { orderedStepIds };
    const nextResult = evaluateOrderSteps(exercise, answer);

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
      typeLabel="Order Steps"
    >
      <ol className={styles.list}>
        {orderedStepIds.map((stepId, index) => (
          <li
            key={stepId}
            className={styles.item}
            draggable={!readonly && !result}
            aria-label={`Шаг ${index + 1}: ${stepTextMap[stepId]}`}
            onDragStart={() => setDraggingId(stepId)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => moveByDrop(stepId)}
          >
            <div className={styles.itemContent}>
              <span className={styles.stepIndex}>{index + 1}.</span>
              <span>{stepTextMap[stepId]}</span>
            </div>
            <div className={styles.controls}>
              <button
                type="button"
                onClick={() => moveByKeyboard(index, -1)}
                disabled={!!readonly || !!result || index === 0}
                aria-label={`Поднять шаг ${index + 1} вверх`}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveByKeyboard(index, 1)}
                disabled={!!readonly || !!result || index === orderedStepIds.length - 1}
                aria-label={`Опустить шаг ${index + 1} вниз`}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>

      <p className={styles.hint}>Drag-and-drop или кнопки ↑/↓ для клавиатурного сценария.</p>

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
