"use client";

import { MultipleChoiceExercise } from "./multiple-choice/MultipleChoiceExercise";
import { TrueFalseExercise } from "./true-false/TrueFalseExercise";
import type { EvaluationResult, Exercise, ExerciseAnswer, ExerciseMode } from "./types";

interface ExerciseRendererProps {
  exercise: Exercise;
  mode: ExerciseMode;
  readonly?: boolean;
  onSubmit?: (payload: {
    exerciseId: string;
    answer: ExerciseAnswer;
    result: EvaluationResult;
  }) => void;
}

export function ExerciseRenderer({ exercise, mode, readonly, onSubmit }: ExerciseRendererProps) {
  switch (exercise.type) {
    case "true-false":
      return (
        <TrueFalseExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    case "multiple-choice":
      return (
        <MultipleChoiceExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    default:
      return (
        <section>
          <p>
            Тип упражнения <code>{exercise.type}</code> будет реализован на следующих этапах.
          </p>
        </section>
      );
  }
}
