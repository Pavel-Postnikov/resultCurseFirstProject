import type { EvaluateFn, OrderStepsAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type OrderStepsExercise = Extract<Exercise, { type: "order-steps" }>;

export const evaluateOrderSteps: EvaluateFn<OrderStepsExercise, OrderStepsAnswer> = (
  exercise,
  answer,
) => {
  const expected = exercise.payload.correctOrder;
  const actual = answer.orderedStepIds;

  const totalItems = expected.length;
  let correctItems = 0;

  for (let index = 0; index < totalItems; index += 1) {
    if (expected[index] === actual[index]) {
      correctItems += 1;
    }
  }

  const mistakes = correctItems === totalItems ? [] : ["Последовательность шагов нарушена"];
  const score = Number((correctItems / Math.max(totalItems, 1)).toFixed(2));
  const isCorrect = correctItems === totalItems;

  return {
    isCorrect,
    score,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Шаги выстроены в правильном порядке."
      : score > 0
        ? "Частично верно. Некоторые позиции нужно переставить."
        : "Неверно. Начни с определения первого шага процесса.",
    details: {
      correctItems,
      totalItems,
      mistakes,
    },
  };
};
