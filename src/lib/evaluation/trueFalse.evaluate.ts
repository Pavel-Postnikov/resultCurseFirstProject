import type { EvaluateFn, TrueFalseAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type TrueFalseExercise = Extract<Exercise, { type: "true-false" }>;

export const evaluateTrueFalse: EvaluateFn<TrueFalseExercise, TrueFalseAnswer> = (
  exercise,
  answer,
) => {
  const isCorrect = answer.value === exercise.payload.correct;

  return {
    isCorrect,
    score: isCorrect ? 1 : 0,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Отлично, логика утверждения понята."
      : "Неверно. Перепроверь формулировку утверждения.",
    details: {
      correctItems: isCorrect ? 1 : 0,
      totalItems: 1,
      mistakes: isCorrect ? [] : ["Утверждение оценено неверно"],
    },
  };
};
