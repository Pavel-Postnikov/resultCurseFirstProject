import type { EvaluateFn, MultipleChoiceAnswer } from "@/components/exercises/types";
import type { Exercise } from "@/components/exercises/types";

type MultipleChoiceExercise = Extract<Exercise, { type: "multiple-choice" }>;

export const evaluateMultipleChoice: EvaluateFn<MultipleChoiceExercise, MultipleChoiceAnswer> = (
  exercise,
  answer,
) => {
  const { allowMultiple = false, correctOptionIds } = exercise.payload;
  const selected = new Set(answer.selectedOptionIds);
  const correct = new Set(correctOptionIds);

  if (!allowMultiple) {
    const expected = correctOptionIds[0];
    const actual = answer.selectedOptionIds[0];
    const isCorrect = answer.selectedOptionIds.length === 1 && actual === expected;

    return {
      isCorrect,
      score: isCorrect ? 1 : 0,
      maxScore: 1,
      feedback: isCorrect
        ? "Верно. Ты выбрал правильный вариант."
        : "Неверно. Выбран не тот вариант.",
      details: {
        correctItems: isCorrect ? 1 : 0,
        totalItems: 1,
        mistakes: isCorrect ? [] : ["Выбран неверный ответ"],
      },
    };
  }

  const correctlySelected = answer.selectedOptionIds.filter((id) => correct.has(id)).length;
  const wrongSelected = answer.selectedOptionIds.filter((id) => !correct.has(id)).length;
  const totalItems = correct.size;

  // Milestone 2 follows the roadmap scoring rule:
  // score = maxScore * (correctItems / totalItems)
  const normalizedScore = Math.max(0, Math.min(1, correctlySelected / Math.max(totalItems, 1)));
  const score = Number(normalizedScore.toFixed(2));

  const isCorrect =
    wrongSelected === 0 &&
    correctOptionIds.every((id) => selected.has(id)) &&
    selected.size === correct.size;

  const mistakes: string[] = [];

  if (wrongSelected > 0) {
    mistakes.push("Есть лишние выбранные варианты");
  }

  const missed = correctOptionIds.filter((id) => !selected.has(id));
  if (missed.length > 0) {
    mistakes.push("Пропущены правильные варианты");
  }

  return {
    isCorrect,
    score,
    maxScore: 1,
    feedback: isCorrect
      ? "Верно. Все правильные варианты выбраны без ошибок."
      : score > 0
        ? "Частично верно. Есть правильные попадания, но ответ не полный."
        : "Неверно. Проверь критерии выбора ответов.",
    details: {
      correctItems: correctlySelected,
      totalItems,
      mistakes,
    },
  };
};
