import type { Exercise } from "@/components/exercises/types";
import type { TestSessionItemResult } from "./aggregateScores";

export interface WeakTopicItem {
  tag: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface TagStats {
  score: number;
  maxScore: number;
}

export function getWeakTopics(
  exercises: Exercise[],
  results: Record<string, TestSessionItemResult>,
  threshold = 60,
  limit = 3,
): WeakTopicItem[] {
  const tagStats = new Map<string, TagStats>();

  for (const exercise of exercises) {
    const itemResult = results[exercise.id];
    if (!itemResult) {
      continue;
    }

    const tags = exercise.tags ?? [];

    for (const tag of tags) {
      const current = tagStats.get(tag) ?? { score: 0, maxScore: 0 };
      current.score += itemResult.result.score;
      current.maxScore += itemResult.result.maxScore;
      tagStats.set(tag, current);
    }
  }

  return Array.from(tagStats.entries())
    .map(([tag, stats]) => {
      const percentage = stats.maxScore > 0 ? Math.round((stats.score / stats.maxScore) * 100) : 0;

      return {
        tag,
        score: Number(stats.score.toFixed(2)),
        maxScore: Number(stats.maxScore.toFixed(2)),
        percentage,
      };
    })
    .filter((item) => item.percentage < threshold)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, limit);
}
