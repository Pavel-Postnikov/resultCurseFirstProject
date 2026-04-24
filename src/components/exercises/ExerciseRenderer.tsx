"use client";

import { CrosswordExercise } from "./crossword/CrosswordExercise";
import { FillTheBlankExercise } from "./fill-the-blank/FillTheBlankExercise";
import { MatchPairsExercise } from "./match-pairs/MatchPairsExercise";
import { MultipleChoiceExercise } from "./multiple-choice/MultipleChoiceExercise";
import { OrderStepsExercise } from "./order-steps/OrderStepsExercise";
import { SpotTheBugExercise } from "./spot-the-bug/SpotTheBugExercise";
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

    case "fill-the-blank":
      return (
        <FillTheBlankExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    case "match-pairs":
      return (
        <MatchPairsExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    case "order-steps":
      return (
        <OrderStepsExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    case "crossword":
      return (
        <CrosswordExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    case "spot-the-bug":
      return (
        <SpotTheBugExercise
          exercise={exercise}
          mode={mode}
          readonly={readonly}
          onSubmit={(answer, result) => onSubmit?.({ exerciseId: exercise.id, answer, result })}
        />
      );

    default: {
      const exhaustiveCheck: never = exercise;
      return exhaustiveCheck;
    }
  }
}
