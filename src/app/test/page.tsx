"use client";

import Link from "next/link";
import { ExerciseRenderer } from "@/components/exercises";
import { ProgressBar, TestSessionProvider, useTestSession } from "@/components/test";
import { milestone3TestExercises } from "@/lib/exercises";
import styles from "./page.module.css";

function TestPageContent() {
  const { isHydrated, currentExercise, isCompleted, submit, skip, aggregated, restart } =
    useTestSession();

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <section className={styles.infoCard}>
          <h1>Test-режим</h1>
          <p>Восстанавливаем прогресс сессии...</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Test-режим</h1>
        <p>
          Последовательное прохождение заданий с сохранением прогресса, возможностью пропуска и
          финальным разбором на странице результатов.
        </p>
      </header>

      <ProgressBar answeredCount={aggregated.answeredCount} totalCount={aggregated.totalCount} />

      {isCompleted ? (
        <section className={styles.infoCard}>
          <h2>Тест завершен</h2>
          <p>
            Итог: {aggregated.totalScore} / {aggregated.totalMaxScore}
          </p>
          <div className={styles.actions}>
            <Link href="/results" className={styles.primary}>
              Открыть результаты
            </Link>
            <button type="button" onClick={restart} className={styles.secondary}>
              Пройти заново
            </button>
          </div>
        </section>
      ) : currentExercise ? (
        <section className={styles.exerciseWrap}>
          <ExerciseRenderer
            key={currentExercise.id}
            exercise={currentExercise}
            mode="test"
            onSubmit={({ exerciseId, answer, result }) => submit(exerciseId, answer, result)}
          />
          <div className={styles.exerciseActions}>
            <button
              type="button"
              onClick={() => skip(currentExercise.id)}
              className={styles.skipButton}
              aria-label="Пропустить текущий вопрос и перейти к следующему"
            >
              Не знаю, пропустить вопрос
            </button>
          </div>
          <p className={styles.hint}>
            После ответа система автоматически переходит к следующему заданию.
          </p>
        </section>
      ) : (
        <section className={styles.infoCard}>
          <h2>Нет доступных заданий</h2>
          <p>Проверь набор test-упражнений в локальных данных.</p>
        </section>
      )}
    </main>
  );
}

export default function TestPage() {
  return (
    <TestSessionProvider exercises={milestone3TestExercises}>
      <TestPageContent />
    </TestSessionProvider>
  );
}
