import type { EvaluateFn, MatchPairsAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type MatchPairsExercise = Extract<Exercise, { type: "match-pairs" }>;

export const evaluateMatchPairs: EvaluateFn<MatchPairsExercise, MatchPairsAnswer> = (
  exercise,
  answer,
) => {
  const totalItems = exercise.payload.correctPairs.length;

  let correctItems = 0;
  const mistakes: string[] = [];

  for (const pair of exercise.payload.correctPairs) {
    const selectedRightId = answer.pairs[pair.leftId];
    const isCorrect = selectedRightId === pair.rightId;

    if (isCorrect) {
      correctItems += 1;
    } else {
      mistakes.push(`Пара для ${pair.leftId} выбрана неверно`);
    }
  }

  const score = Number((correctItems / Math.max(totalItems, 1)).toFixed(2));
  const isCorrect = correctItems === totalItems;

  return {
    isCorrect,
    score,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Все пары сопоставлены корректно."
      : score > 0
        ? "Частично верно. Есть корректные совпадения, но не все."
        : "Неверно. Попробуй пересобрать пары по определениям.",
    details: {
      correctItems,
      totalItems,
      mistakes,
    },
  };
};
