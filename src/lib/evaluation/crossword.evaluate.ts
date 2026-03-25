import type { CrosswordAnswer, EvaluateFn } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type CrosswordExercise = Extract<Exercise, { type: "crossword" }>;

export const evaluateCrossword: EvaluateFn<CrosswordExercise, CrosswordAnswer> = (
  exercise,
  answer,
) => {
  const totalItems = exercise.payload.words.length;

  let correctItems = 0;
  const mistakes: string[] = [];

  for (const word of exercise.payload.words) {
    const expected = word.answer.trim().toLowerCase();
    const actual = (answer.values[word.id] ?? "").trim().toLowerCase();

    if (expected === actual) {
      correctItems += 1;
    } else {
      mistakes.push(`Слово ${word.id} заполнено неверно`);
    }
  }

  const score = Number((correctItems / Math.max(totalItems, 1)).toFixed(2));
  const isCorrect = correctItems === totalItems;

  return {
    isCorrect,
    score,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Кроссворд заполнен полностью."
      : score > 0
        ? "Частично верно. Проверь отдельные термины."
        : "Неверно. Повтори определения ключевых терминов.",
    details: {
      correctItems,
      totalItems,
      mistakes,
    },
  };
};
