import type {
  CrosswordAnswer,
  Exercise,
  ExerciseAnswer,
  FillTheBlankAnswer,
  MatchPairsAnswer,
  MultipleChoiceAnswer,
  OrderStepsAnswer,
  TrueFalseAnswer,
} from "@/components/exercises/types";

export function getExerciseTypeLabel(type: Exercise["type"]): string {
  switch (type) {
    case "multiple-choice":
      return "MultipleChoice";
    case "true-false":
      return "TrueFalse";
    case "fill-the-blank":
      return "FillTheBlank";
    case "match-pairs":
      return "MatchPairs";
    case "order-steps":
      return "OrderSteps";
    case "crossword":
      return "Crossword";
    default:
      return type;
  }
}

export function formatUserAnswerLines(exercise: Exercise, answer: ExerciseAnswer | null): string[] {
  if (!answer) {
    return ["Пропущено"];
  }

  switch (exercise.type) {
    case "true-false": {
      const typedAnswer = answer as TrueFalseAnswer;
      return [typedAnswer.value ? "Верно" : "Неверно"];
    }

    case "multiple-choice": {
      const typedAnswer = answer as MultipleChoiceAnswer;
      const selected = typedAnswer.selectedOptionIds;
      if (selected.length === 0) {
        return ["Ответ не выбран"];
      }

      const optionMap = Object.fromEntries(
        exercise.payload.options.map((option) => [option.id, option.text]),
      );
      return selected.map((optionId) => optionMap[optionId] ?? optionId);
    }

    case "fill-the-blank": {
      const typedAnswer = answer as FillTheBlankAnswer;
      return exercise.payload.blanks.map(
        (blank) => `${blank.id}: ${typedAnswer.values[blank.id] ?? "—"}`,
      );
    }

    case "match-pairs": {
      const typedAnswer = answer as MatchPairsAnswer;
      const rightMap = Object.fromEntries(
        exercise.payload.right.map((item) => [item.id, item.text]),
      );
      return exercise.payload.left.map((left) => {
        const rightId = typedAnswer.pairs[left.id];
        return `${left.text} -> ${rightMap[rightId] ?? "—"}`;
      });
    }

    case "order-steps": {
      const typedAnswer = answer as OrderStepsAnswer;
      const stepMap = Object.fromEntries(
        exercise.payload.steps.map((step) => [step.id, step.text]),
      );
      return typedAnswer.orderedStepIds.map(
        (stepId, index) => `${index + 1}. ${stepMap[stepId] ?? stepId}`,
      );
    }

    case "crossword": {
      const typedAnswer = answer as CrosswordAnswer;
      return exercise.payload.words.map(
        (word) => `${word.id.toUpperCase()}: ${typedAnswer.values[word.id] ?? "—"}`,
      );
    }

    default: {
      const exhaustive: never = exercise;
      return [String(exhaustive)];
    }
  }
}

export function formatCorrectAnswerLines(exercise: Exercise): string[] {
  switch (exercise.type) {
    case "true-false": {
      return [exercise.payload.correct ? "Верно" : "Неверно"];
    }

    case "multiple-choice": {
      const optionMap = Object.fromEntries(
        exercise.payload.options.map((option) => [option.id, option.text]),
      );
      return exercise.payload.correctOptionIds.map((id) => optionMap[id] ?? id);
    }

    case "fill-the-blank": {
      return exercise.payload.blanks.map((blank) => `${blank.id}: ${blank.answers.join(" / ")}`);
    }

    case "match-pairs": {
      const leftMap = Object.fromEntries(exercise.payload.left.map((item) => [item.id, item.text]));
      const rightMap = Object.fromEntries(
        exercise.payload.right.map((item) => [item.id, item.text]),
      );

      return exercise.payload.correctPairs.map(
        (pair) =>
          `${leftMap[pair.leftId] ?? pair.leftId} -> ${rightMap[pair.rightId] ?? pair.rightId}`,
      );
    }

    case "order-steps": {
      const stepMap = Object.fromEntries(
        exercise.payload.steps.map((step) => [step.id, step.text]),
      );
      return exercise.payload.correctOrder.map(
        (stepId, index) => `${index + 1}. ${stepMap[stepId] ?? stepId}`,
      );
    }

    case "crossword": {
      return exercise.payload.words.map((word) => `${word.id.toUpperCase()}: ${word.answer}`);
    }

    default: {
      const exhaustive: never = exercise;
      return [String(exhaustive)];
    }
  }
}
