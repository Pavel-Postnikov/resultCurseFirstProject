"use client";

import Link from "next/link";
import { ResultSummary, TestSessionProvider, useTestSession, WeakTopics } from "@/components/test";
import { milestone3TestExercises } from "@/lib/exercises";
import {
  formatCorrectAnswerLines,
  formatUserAnswerLines,
  getExerciseTypeLabel,
} from "@/lib/scoring/presentation";
import { getWeakTopics } from "@/lib/scoring/weakTopics";
import styles from "./page.module.css";

function getResultClass(score: number, isCorrect: boolean): string {
  if (isCorrect) {
    return styles.correct;
  }

  return score > 0 ? styles.partial : styles.wrong;
}

function ResultsContent() {
  const { isHydrated, isCompleted, exercises, state, aggregated, restart } = useTestSession();

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <section className={styles.infoCard}>
          <h1>Результаты</h1>
          <p>Загружаем сохраненную test-сессию...</p>
        </section>
      </main>
    );
  }

  if (!isCompleted) {
    return (
      <main className={styles.page}>
        <section className={styles.infoCard}>
          <h1>Результаты</h1>
          <p>Тест еще не завершен. Дойди до конца теста, чтобы получить полный разбор.</p>
          <div className={styles.actions}>
            <Link href="/test" className={styles.primary}>
              Перейти к тесту
            </Link>
            <Link href="/articles" className={styles.secondary}>
              Перейти к статьям
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const weakTopics = getWeakTopics(exercises, state.results, 60, 3);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Результаты теста</h1>
        <p>Финальный отчет: общий итог, слабые темы и детальный разбор каждого вопроса.</p>
      </header>

      <ResultSummary aggregated={aggregated} />
      <WeakTopics items={weakTopics} />

      <section className={styles.breakdown}>
        <h2>Разбор по вопросам</h2>
        <div className={styles.breakdownList}>
          {exercises.map((exercise) => {
            const item = state.results[exercise.id];
            if (!item) {
              return null;
            }

            const userAnswer = formatUserAnswerLines(exercise, item.answer);
            const correctAnswer = formatCorrectAnswerLines(exercise);
            const resultClass = getResultClass(item.result.score, item.result.isCorrect);

            return (
              <article key={exercise.id} className={`${styles.resultCard} ${resultClass}`}>
                <header className={styles.cardHeader}>
                  <div>
                    <h3>{exercise.title ?? exercise.question}</h3>
                    <p className={styles.typeLabel}>{getExerciseTypeLabel(exercise.type)}</p>
                  </div>
                  <p className={styles.score}>
                    {item.result.score} / {item.result.maxScore}
                  </p>
                </header>

                <div className={styles.answerGrid}>
                  <section>
                    <h4>Твой ответ</h4>
                    <ul>
                      {userAnswer.map((line, index) => (
                        <li key={`${exercise.id}-user-${index}`}>{line}</li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h4>Правильный ответ</h4>
                    <ul>
                      {correctAnswer.map((line, index) => (
                        <li key={`${exercise.id}-correct-${index}`}>{line}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <p className={styles.feedback}>Feedback: {item.result.feedback}</p>
                <p className={styles.explanation}>Пояснение: {exercise.explanation}</p>
              </article>
            );
          })}
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" onClick={restart} className={styles.primary}>
          Пройти заново
        </button>
        <Link href="/test" className={styles.secondary}>
          К тесту
        </Link>
        <Link href="/articles" className={styles.secondary}>
          К статьям
        </Link>
      </div>
    </main>
  );
}

export function ResultsClient() {
  return (
    <TestSessionProvider exercises={milestone3TestExercises}>
      <ResultsContent />
    </TestSessionProvider>
  );
}
