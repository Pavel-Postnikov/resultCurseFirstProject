import type { AggregatedScores } from "@/lib/scoring/aggregateScores";
import { getExerciseTypeLabel } from "@/lib/scoring/presentation";
import styles from "./ResultSummary.module.css";

function getLevel(percentage: number): string {
  if (percentage <= 49) {
    return "Need more practice";
  }

  if (percentage <= 74) {
    return "Almost ready";
  }

  return "Junior-ready";
}

interface ResultSummaryProps {
  aggregated: AggregatedScores;
}

export function ResultSummary({ aggregated }: ResultSummaryProps) {
  const level = getLevel(aggregated.percentage);

  return (
    <section className={styles.card}>
      <h2>Итог теста</h2>
      <p className={styles.kpi}>Результат: {aggregated.percentage}%</p>
      <p className={styles.kpi}>Уровень: {level}</p>
      <p className={styles.score}>
        Баллы: {aggregated.totalScore} / {aggregated.totalMaxScore}
      </p>

      <div className={styles.typeGrid}>
        {aggregated.byType.map((item) => (
          <article key={item.type} className={styles.typeCard}>
            <h3>{getExerciseTypeLabel(item.type)}</h3>
            <p>
              {item.score} / {item.maxScore}
            </p>
            <p>
              Ответов: {item.answered} / {item.total}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
