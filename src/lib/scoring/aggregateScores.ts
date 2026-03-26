import type { Exercise, ExerciseAnswer, EvaluationResult } from "@/components/exercises/types";

export interface TestSessionItemResult {
  exerciseId: string;
  answer: ExerciseAnswer | null;
  result: EvaluationResult;
  skipped?: boolean;
}

export interface TypeProgressItem {
  type: Exercise["type"];
  score: number;
  maxScore: number;
  answered: number;
  total: number;
}

export interface AggregatedScores {
  totalScore: number;
  totalMaxScore: number;
  answeredCount: number;
  totalCount: number;
  percentage: number;
  byType: TypeProgressItem[];
}

export function aggregateScores(
  exercises: Exercise[],
  results: Record<string, TestSessionItemResult>,
): AggregatedScores {
  const totalCount = exercises.length;

  let totalScore = 0;
  let totalMaxScore = 0;

  const typeMap = new Map<Exercise["type"], TypeProgressItem>();

  for (const exercise of exercises) {
    const current = typeMap.get(exercise.type) ?? {
      type: exercise.type,
      score: 0,
      maxScore: 0,
      answered: 0,
      total: 0,
    };

    current.total += 1;

    const itemResult = results[exercise.id];
    if (itemResult) {
      current.answered += 1;
      current.score += itemResult.result.score;
      current.maxScore += itemResult.result.maxScore;

      totalScore += itemResult.result.score;
      totalMaxScore += itemResult.result.maxScore;
    }

    typeMap.set(exercise.type, current);
  }

  const answeredCount = Object.keys(results).length;
  const percentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;

  return {
    totalScore: Number(totalScore.toFixed(2)),
    totalMaxScore: Number(totalMaxScore.toFixed(2)),
    answeredCount,
    totalCount,
    percentage,
    byType: Array.from(typeMap.values()),
  };
}
