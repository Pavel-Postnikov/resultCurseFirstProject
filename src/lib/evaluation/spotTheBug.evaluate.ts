import type { EvaluateFn, SpotTheBugAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type SpotTheBugExercise = Extract<Exercise, { type: "spot-the-bug" }>;

export const evaluateSpotTheBug: EvaluateFn<SpotTheBugExercise, SpotTheBugAnswer> = (
  exercise,
  answer,
) => {
  const isCorrect = answer.selectedLineIndex === exercise.payload.bugLineIndex;

  return {
    isCorrect,
    score: isCorrect ? 1 : 0,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно! Ты нашёл строку с ошибкой."
      : exercise.payload.hint
        ? `Не совсем. Подсказка: ${exercise.payload.hint}`
        : "Не та строка. Посмотри внимательнее.",
  };
};
