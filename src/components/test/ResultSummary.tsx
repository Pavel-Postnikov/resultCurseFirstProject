"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { AggregatedScores } from "@/lib/scoring/aggregateScores";
import { getExerciseTypeLabel } from "@/lib/scoring/presentation";
import { AnimatedNumber } from "./AnimatedNumber";
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
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = !shouldReduceMotion;

  return (
    <motion.section
      className={styles.card}
      initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <h2>Итог теста</h2>
      <p className={styles.kpi}>
        Результат: <AnimatedNumber value={aggregated.percentage} />%
      </p>
      <p className={styles.kpi}>Уровень: {level}</p>
      <p className={styles.score}>
        Баллы: <AnimatedNumber value={aggregated.totalScore} decimals={2} /> /{" "}
        <AnimatedNumber value={aggregated.totalMaxScore} decimals={2} />
      </p>

      <div className={styles.typeGrid}>
        {aggregated.byType.map((item, index) => {
          const percent = item.maxScore > 0 ? Math.round((item.score / item.maxScore) * 100) : 0;

          return (
            <motion.article
              key={item.type}
              className={styles.typeCard}
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: shouldAnimate ? index * 0.04 : 0 }}
            >
              <h3>{getExerciseTypeLabel(item.type)}</h3>
              <p>
                <AnimatedNumber value={item.score} decimals={2} /> /{" "}
                <AnimatedNumber value={item.maxScore} decimals={2} />
              </p>
              <p>
                Ответов: {item.answered} / {item.total}
              </p>
              <div className={styles.typeProgressTrack} aria-hidden>
                <motion.div
                  className={styles.typeProgressFill}
                  initial={false}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.34, delay: shouldAnimate ? 0.06 + index * 0.04 : 0 }}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}
