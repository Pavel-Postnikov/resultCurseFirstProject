export type ExerciseMode = "inline" | "test";

export type ExerciseType =
  | "multiple-choice"
  | "match-pairs"
  | "fill-the-blank"
  | "true-false"
  | "order-steps"
  | "crossword";

export interface ExerciseBase {
  id: string;
  type: ExerciseType;
  title?: string;
  question: string;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface MultipleChoicePayload {
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  allowMultiple?: boolean;
}

export interface MatchPairsPayload {
  left: { id: string; text: string }[];
  right: { id: string; text: string }[];
  correctPairs: { leftId: string; rightId: string }[];
}

export interface FillTheBlankPayload {
  template: string;
  blanks: { id: string; answers: string[]; caseSensitive?: boolean }[];
}

export interface TrueFalsePayload {
  statement: string;
  correct: boolean;
}

export interface OrderStepsPayload {
  steps: { id: string; text: string }[];
  correctOrder: string[];
}

export interface CrosswordPayload {
  size: { rows: number; cols: number };
  words: {
    id: string;
    clue: string;
    answer: string;
    start: { row: number; col: number };
    direction: "across" | "down";
  }[];
}

export type Exercise =
  | (ExerciseBase & { type: "multiple-choice"; payload: MultipleChoicePayload })
  | (ExerciseBase & { type: "match-pairs"; payload: MatchPairsPayload })
  | (ExerciseBase & { type: "fill-the-blank"; payload: FillTheBlankPayload })
  | (ExerciseBase & { type: "true-false"; payload: TrueFalsePayload })
  | (ExerciseBase & { type: "order-steps"; payload: OrderStepsPayload })
  | (ExerciseBase & { type: "crossword"; payload: CrosswordPayload });

export interface MultipleChoiceAnswer {
  selectedOptionIds: string[];
}

export interface TrueFalseAnswer {
  value: boolean;
}

export interface FillTheBlankAnswer {
  values: Record<string, string>;
}

export interface MatchPairsAnswer {
  pairs: Record<string, string>;
}

export interface OrderStepsAnswer {
  orderedStepIds: string[];
}

export interface CrosswordAnswer {
  values: Record<string, string>;
}

export type ExerciseAnswer =
  | MultipleChoiceAnswer
  | TrueFalseAnswer
  | FillTheBlankAnswer
  | MatchPairsAnswer
  | OrderStepsAnswer
  | CrosswordAnswer;

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
  details?: {
    correctItems?: number;
    totalItems?: number;
    mistakes?: string[];
  };
}

export type EvaluateFn<TExercise, TAnswer> = (
  exercise: TExercise,
  answer: TAnswer,
) => EvaluationResult;

export type ExerciseStatus = "idle" | "answered-partial" | "answered-correct" | "answered-wrong";

export interface ExerciseComponentProps<TExercise, TAnswer> {
  exercise: TExercise;
  mode: ExerciseMode;
  initialAnswer?: TAnswer;
  readonly?: boolean;
  onSubmit?: (answer: TAnswer, result: EvaluationResult) => void;
}
