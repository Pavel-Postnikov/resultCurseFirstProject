import type { EvaluateFn, FillTheBlankAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type FillTheBlankExercise = Extract<Exercise, { type: "fill-the-blank" }>;

export const evaluateFillTheBlank: EvaluateFn<FillTheBlankExercise, FillTheBlankAnswer> = (
  exercise,
  answer,
) => {
  const totalItems = exercise.payload.blanks.length;

  let correctItems = 0;
  const mistakes: string[] = [];

  for (const blank of exercise.payload.blanks) {
    const userValueRaw = answer.values[blank.id] ?? "";
    const userValue = blank.caseSensitive ? userValueRaw.trim() : userValueRaw.trim().toLowerCase();

    const acceptedValues = blank.answers.map((item) =>
      blank.caseSensitive ? item.trim() : item.trim().toLowerCase(),
    );

    const isCorrect = acceptedValues.includes(userValue);

    if (isCorrect) {
      correctItems += 1;
    } else {
      mistakes.push(`Пропуск ${blank.id} заполнен неверно`);
    }
  }

  const score = Number((correctItems / Math.max(totalItems, 1)).toFixed(2));
  const isCorrect = correctItems === totalItems;

  return {
    isCorrect,
    score,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Все пропуски заполнены правильно."
      : score > 0
        ? "Частично верно. Некоторые пропуски требуют исправления."
        : "Неверно. Проверь базовые термины и синтаксис.",
    details: {
      correctItems,
      totalItems,
      mistakes,
    },
  };
};
