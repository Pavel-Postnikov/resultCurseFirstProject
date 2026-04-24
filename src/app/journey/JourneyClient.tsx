"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExerciseRenderer } from "@/components/exercises/ExerciseRenderer";
import { CheckpointTimer } from "@/components/journey/CheckpointTimer";
import { TheoryRenderer } from "@/components/journey/TheoryRenderer";
import type { Journey, JourneyCheckpoint } from "@/types/journey";
import type { EvaluationResult, ExerciseAnswer } from "@/components/exercises/types";
import styles from "./JourneyClient.module.css";

interface ExResult {
  exerciseId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}

interface CpResult {
  checkpoint: JourneyCheckpoint;
  timeSpent: number;
  xpEarned: number;
  exerciseResults: ExResult[];
  timedOut: boolean;
}

type Phase = "start" | "checkpoint" | "report";
type SubPhase = "theory" | "exercises" | "done";

interface Props {
  journey: Journey;
}

export function JourneyClient({ journey }: Props) {
  const [phase, setPhase] = useState<Phase>("start");
  const [cpIndex, setCpIndex] = useState(0);
  const [subPhase, setSubPhase] = useState<SubPhase>("theory");
  const [exIndex, setExIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [exResults, setExResults] = useState<ExResult[]>([]);
  const [allCpResults, setAllCpResults] = useState<CpResult[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cpStartedAt = useRef(0);
  // Refs to avoid stale closures in timer callback
  const exResultsRef = useRef<ExResult[]>([]);
  const subPhaseRef = useRef<SubPhase>("theory");
  const phaseRef = useRef<Phase>("start");

  exResultsRef.current = exResults;
  subPhaseRef.current = subPhase;
  phaseRef.current = phase;

  const currentCp = journey.checkpoints[cpIndex];

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer(seconds: number) {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // When timer hits 0 in exercises phase → auto-finish
  useEffect(() => {
    if (timeLeft !== 0 || subPhaseRef.current !== "exercises" || phaseRef.current !== "checkpoint") {
      return;
    }
    setTimedOut(true);
    finishCheckpoint(exResultsRef.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), []);

  // ─── Actions ────────────────────────────────────────────────────────────────

  function startJourney() {
    setCpIndex(0);
    setSubPhase("theory");
    setExIndex(0);
    setExResults([]);
    setAllCpResults([]);
    setTotalXp(0);
    setStreak(0);
    setMaxStreak(0);
    setTimedOut(false);
    setPhase("checkpoint");
  }

  function beginExercises() {
    cpStartedAt.current = Date.now();
    startTimer(currentCp.timeLimit);
    setSubPhase("exercises");
  }

  function handleExerciseSubmit(
    _answer: ExerciseAnswer,
    result: EvaluationResult,
    exerciseId: string,
  ) {
    const exResult: ExResult = {
      exerciseId,
      isCorrect: result.isCorrect,
      score: result.score,
      maxScore: result.maxScore,
    };

    const updatedResults = [...exResultsRef.current, exResult];
    setExResults(updatedResults);

    setStreak((prev) => {
      const next = result.isCorrect ? prev + 1 : 0;
      setMaxStreak((m) => Math.max(m, next));
      return next;
    });

    const cp = journey.checkpoints[cpIndex];
    if (exIndex < cp.exercises.length - 1) {
      setExIndex((i) => i + 1);
    } else {
      stopTimer();
      finishCheckpoint(updatedResults, false);
    }
  }

  function finishCheckpoint(results: ExResult[], wasTimedOut: boolean) {
    const cp = journey.checkpoints[cpIndex];
    const timeSpent = Math.round((Date.now() - cpStartedAt.current) / 1000);
    const correctCount = results.filter((r) => r.isCorrect).length;
    const accuracy = results.length > 0 ? correctCount / results.length : 0;
    const baseXp = Math.round(cp.xpReward * accuracy);
    const speedBonus =
      !wasTimedOut && timeSpent < cp.timeLimit * 0.5 ? Math.round(baseXp * 0.1) : 0;
    // Use current maxStreak value — we compute it before state update arrives,
    // so we peek directly from the running state via a local variable captured earlier
    const streakBonus = maxStreak >= 3 ? Math.round(baseXp * 0.2) : 0;
    const xpEarned = baseXp + speedBonus + streakBonus;

    const cpResult: CpResult = {
      checkpoint: cp,
      timeSpent,
      xpEarned,
      exerciseResults: results,
      timedOut: wasTimedOut,
    };

    setAllCpResults((prev) => [...prev, cpResult]);
    setTotalXp((prev) => prev + xpEarned);
    setSubPhase("done");
  }

  function nextCheckpoint() {
    const nextIndex = cpIndex + 1;
    if (nextIndex >= journey.checkpoints.length) {
      setPhase("report");
      return;
    }
    setCpIndex(nextIndex);
    setSubPhase("theory");
    setExIndex(0);
    setExResults([]);
    setTimedOut(false);
  }

  // ─── Progress bar ────────────────────────────────────────────────────────────

  const totalExercises = journey.checkpoints.reduce((s, cp) => s + cp.exercises.length, 0);
  const doneExercises = allCpResults.reduce((s, r) => s + r.exerciseResults.length, 0);
  const progressPct = totalExercises > 0 ? (doneExercises / totalExercises) * 100 : 0;

  // ─── Render: START ───────────────────────────────────────────────────────────

  if (phase === "start") {
    return (
      <div className={styles.page}>
        <div className={styles.startCard}>
          <div className={styles.startKicker}>Knowledge Journey</div>
          <h1 className={styles.startTitle}>{journey.topic}</h1>
          <p className={styles.startDesc}>{journey.description}</p>

          <div className={styles.startMeta}>
            <span>⏱ ~{journey.estimatedMinutes} мин</span>
            <span>📍 {journey.checkpoints.length} чекпоинтов</span>
            <span>⚡ до {journey.checkpoints.reduce((s, cp) => s + cp.xpReward, 0)} XP</span>
          </div>

          <div className={styles.startRules}>
            <p>Как это работает:</p>
            <ol>
              <li>Читаешь теорию каждого чекпоинта</li>
              <li>Отвечаешь на задания под давлением таймера</li>
              <li>Получаешь XP за правильные ответы и скорость</li>
              <li>В конце — детальный отчёт о результатах</li>
            </ol>
          </div>

          <button className={styles.btnPrimary} onClick={startJourney}>
            Начать путешествие →
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: REPORT ──────────────────────────────────────────────────────────

  if (phase === "report") {
    const totalMaxXp = journey.checkpoints.reduce((s, cp) => s + cp.xpReward, 0);
    const pct = totalMaxXp > 0 ? Math.round((totalXp / totalMaxXp) * 100) : 0;
    const totalCorrect = allCpResults.reduce(
      (s, r) => s + r.exerciseResults.filter((e) => e.isCorrect).length,
      0,
    );
    const totalAnswered = allCpResults.reduce((s, r) => s + r.exerciseResults.length, 0);

    const medal =
      pct >= 90 ? "🥇" : pct >= 70 ? "🥈" : pct >= 50 ? "🥉" : "📋";
    const message =
      pct >= 90
        ? "Отлично! Материал усвоен на отлично."
        : pct >= 70
          ? "Хорошо! Есть несколько пробелов — стоит повторить."
          : pct >= 50
            ? "Неплохо, но лучше пройти ещё раз внимательнее."
            : "Сложно с первого раза — пройди ещё раз, это нормально.";

    return (
      <div className={styles.page}>
        <div className={styles.reportCard}>
          <div className={styles.reportMedal}>{medal}</div>
          <h1 className={styles.reportTitle}>Journey завершён!</h1>
          <p className={styles.reportMessage}>{message}</p>

          <div className={styles.reportStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalXp}</span>
              <span className={styles.statLabel}>XP заработано</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{pct}%</span>
              <span className={styles.statLabel}>от максимума</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {totalCorrect}/{totalAnswered}
              </span>
              <span className={styles.statLabel}>правильных</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>🔥 {maxStreak}</span>
              <span className={styles.statLabel}>макс. стрик</span>
            </div>
          </div>

          <div className={styles.reportBreakdown}>
            {allCpResults.map((r, i) => {
              const correct = r.exerciseResults.filter((e) => e.isCorrect).length;
              const total = r.exerciseResults.length;
              const isGood = correct / total >= 0.6;
              return (
                <div key={r.checkpoint.id} className={styles.reportRow}>
                  <span className={styles.reportRowIcon}>{isGood ? "✓" : "✗"}</span>
                  <div className={styles.reportRowInfo}>
                    <span className={styles.reportRowTitle}>
                      {i + 1}. {r.checkpoint.title}
                    </span>
                    <span className={styles.reportRowMeta}>
                      {correct}/{total} правильно · {r.timeSpent}с ·{" "}
                      {r.timedOut ? "⏰ время вышло · " : ""}+{r.xpEarned} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.reportActions}>
            <button className={styles.btnPrimary} onClick={startJourney}>
              Пройти заново
            </button>
            <Link href="/" className={styles.btnSecondary}>
              На главную
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render: CHECKPOINT ──────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.cpLabel}>
            Чекпоинт {cpIndex + 1} / {journey.checkpoints.length}
          </span>
          <span className={styles.cpTitle}>{currentCp.title}</span>
        </div>
        <div className={styles.headerRight}>
          {subPhase === "exercises" && (
            <CheckpointTimer timeLeft={timeLeft} totalTime={currentCp.timeLimit} />
          )}
          <div className={styles.xpBadge}>⚡ {totalXp} XP</div>
          {streak >= 2 && <div className={styles.streakBadge}>🔥 {streak}</div>}
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* ─── THEORY ─────────────────────────────────────────────── */}
      {subPhase === "theory" && (
        <div className={styles.theoryCard}>
          <h2 className={styles.theoryHeading}>{currentCp.title}</h2>
          <TheoryRenderer text={currentCp.theory} />
          <div className={styles.theoryFooter}>
            <span className={styles.theoryMeta}>
              {currentCp.exercises.length} задания · таймер {Math.floor(currentCp.timeLimit / 60)}:{(currentCp.timeLimit % 60).toString().padStart(2, "0")} мин
            </span>
            <button className={styles.btnPrimary} onClick={beginExercises}>
              К заданиям →
            </button>
          </div>
        </div>
      )}

      {/* ─── EXERCISES ──────────────────────────────────────────── */}
      {subPhase === "exercises" && (
        <div className={styles.exercisesSection}>
          {timedOut && (
            <div className={styles.timedOutBanner}>
              ⏰ Время вышло! Продолжай — результаты зафиксированы.
            </div>
          )}
          <div className={styles.exProgress}>
            Задание {exIndex + 1} / {currentCp.exercises.length}
          </div>
          <ExerciseRenderer
            key={currentCp.exercises[exIndex].id}
            exercise={currentCp.exercises[exIndex]}
            mode="inline"
            onSubmit={({ answer, result, exerciseId }) =>
              handleExerciseSubmit(answer, result, exerciseId)
            }
          />
        </div>
      )}

      {/* ─── DONE ───────────────────────────────────────────────── */}
      {subPhase === "done" && (
        <div className={styles.doneCard}>
          <div className={styles.doneIcon}>✓</div>
          <h2 className={styles.doneTitle}>Чекпоинт завершён!</h2>

          <div className={styles.doneStats}>
            {(() => {
              const last = allCpResults[allCpResults.length - 1];
              if (!last) return null;
              const correct = last.exerciseResults.filter((e) => e.isCorrect).length;
              return (
                <>
                  <div className={styles.doneStat}>
                    <span className={styles.doneStatVal}>+{last.xpEarned}</span>
                    <span className={styles.doneStatLabel}>XP</span>
                  </div>
                  <div className={styles.doneStat}>
                    <span className={styles.doneStatVal}>
                      {correct}/{last.exerciseResults.length}
                    </span>
                    <span className={styles.doneStatLabel}>правильных</span>
                  </div>
                  <div className={styles.doneStat}>
                    <span className={styles.doneStatVal}>{last.timeSpent}с</span>
                    <span className={styles.doneStatLabel}>потрачено</span>
                  </div>
                </>
              );
            })()}
          </div>

          {maxStreak >= 3 && (
            <div className={styles.streakCongrats}>🔥 Стрик {maxStreak}! Бонус +20% XP</div>
          )}

          <button className={styles.btnPrimary} onClick={nextCheckpoint}>
            {cpIndex < journey.checkpoints.length - 1
              ? `Следующий чекпоинт →`
              : "Посмотреть результаты →"}
          </button>
        </div>
      )}
    </div>
  );
}
