"use client";

import { useMemo, useState } from "react";
import { ExerciseRenderer } from "@/components/exercises";
import type { ExerciseAnswer, EvaluationResult } from "@/components/exercises";
import { milestone2TestExercises } from "@/lib/exercises";
import styles from "./page.module.css";

interface SubmittedItem {
  answer: ExerciseAnswer;
  result: EvaluationResult;
}

export default function TestPage() {
  const [submitted, setSubmitted] = useState<Record<string, SubmittedItem>>({});

  const answeredCount = Object.keys(submitted).length;
  const totalCount = milestone2TestExercises.length;

  const { score, maxScore } = useMemo(() => {
    return Object.values(submitted).reduce(
      (acc, entry) => ({
        score: acc.score + entry.result.score,
        maxScore: acc.maxScore + entry.result.maxScore,
      }),
      { score: 0, maxScore: 0 },
    );
  }, [submitted]);

  const progress = totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Test-режим</h1>
        <p>
          Milestone 2: первые два типа упражнений подключены к общей архитектуре и работают в едином
          режиме проверки.
        </p>
      </header>

      <section className={styles.progressCard}>
        <div className={styles.progressTop}>
          <span>
            Прогресс: {answeredCount}/{totalCount}
          </span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className={styles.exerciseList}>
        {milestone2TestExercises.map((exercise) => (
          <ExerciseRenderer
            key={exercise.id}
            exercise={exercise}
            mode="test"
            onSubmit={({ exerciseId, answer, result }) => {
              setSubmitted((prev) => ({
                ...prev,
                [exerciseId]: { answer, result },
              }));
            }}
          />
        ))}
      </section>

      {answeredCount === totalCount ? (
        <section className={styles.summary}>
          <h2>Промежуточный итог Milestone 2</h2>
          <p>
            Набрано: {score} / {maxScore}
          </p>
          <p>На следующем этапе подключим остальные типы упражнений и расширенный подсчет.</p>
        </section>
      ) : null}
    </main>
  );
}
