"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

interface SortableStepItemProps {
  stepId: string;
  stepText: string;
  index: number;
  totalCount: number;
  readonly: boolean;
  hasResult: boolean;
  dndEnabled: boolean;
  onMoveByKeyboard: (index: number, direction: -1 | 1) => void;
}

function SortableStepItem({
  stepId,
  stepText,
  index,
  totalCount,
  readonly,
  hasResult,
  dndEnabled,
  onMoveByKeyboard,
}: SortableStepItemProps) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: stepId,
    disabled: !dndEnabled,
  });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${styles.item} ${isDragging ? styles.itemDragging : ""} ${isOver ? styles.itemOver : ""}`}
      aria-label={`Шаг ${index + 1}: ${stepText}`}
    >
      <div className={styles.itemContent}>
        <span className={styles.stepIndex}>{index + 1}.</span>
        <span>{stepText}</span>
      </div>
      <div className={styles.controls}>
        <button
          ref={setActivatorNodeRef}
          type="button"
          className={styles.dragHandle}
          disabled={!dndEnabled}
          aria-label={`Перетащить шаг ${index + 1}`}
          {...attributes}
          {...listeners}
        >
          ⋮⋮
        </button>
        <button
          type="button"
          onClick={() => onMoveByKeyboard(index, -1)}
          disabled={!!readonly || !!hasResult || index === 0}
          aria-label={`Поднять шаг ${index + 1} вверх`}
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMoveByKeyboard(index, 1)}
          disabled={!!readonly || !!hasResult || index === totalCount - 1}
          aria-label={`Опустить шаг ${index + 1} вниз`}
        >
          ↓
        </button>
      </div>
    </li>
  );
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
  const dndEnabled = !readonly && !result;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  function handleDragEnd(event: DragEndEvent) {
    if (!dndEnabled) {
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedStepIds.indexOf(String(active.id));
    const newIndex = orderedStepIds.indexOf(String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    updateOrder(arrayMove(orderedStepIds, oldIndex, newIndex));
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={orderedStepIds} strategy={verticalListSortingStrategy}>
          <ol className={styles.list}>
            {orderedStepIds.map((stepId, index) => (
              <SortableStepItem
                key={stepId}
                stepId={stepId}
                stepText={stepTextMap[stepId]}
                index={index}
                totalCount={orderedStepIds.length}
                readonly={!!readonly}
                hasResult={!!result}
                dndEnabled={dndEnabled}
                onMoveByKeyboard={moveByKeyboard}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>

      <p className={styles.hint}>Перетаскивай шаги за ручку ⋮⋮ или используй кнопки ↑/↓.</p>

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
