"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Exercise, ExerciseAnswer, EvaluationResult } from "@/components/exercises/types";
import { aggregateScores, type TestSessionItemResult } from "@/lib/scoring/aggregateScores";

const STORAGE_KEY = "frontend-interview-portal:test-session:v1";

interface TestSessionState {
  results: Record<string, TestSessionItemResult>;
  currentIndex: number;
  startedAt: string;
  completedAt: string | null;
}

interface PersistedTestSession {
  version: 1;
  exerciseIds: string[];
  state: TestSessionState;
}

interface TestSessionContextValue {
  exercises: Exercise[];
  state: TestSessionState;
  isHydrated: boolean;
  isCompleted: boolean;
  currentExercise: Exercise | null;
  submit: (exerciseId: string, answer: ExerciseAnswer, result: EvaluationResult) => void;
  skip: (exerciseId: string) => void;
  restart: () => void;
  aggregated: ReturnType<typeof aggregateScores>;
}

interface TestSessionProviderProps {
  exercises: Exercise[];
  children: ReactNode;
}

const TestSessionContext = createContext<TestSessionContextValue | null>(null);

function createInitialState(): TestSessionState {
  return {
    results: {},
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

function areExerciseIdsCompatible(exercises: Exercise[], persistedIds: string[]): boolean {
  if (exercises.length !== persistedIds.length) {
    return false;
  }

  return exercises.every((exercise, index) => exercise.id === persistedIds[index]);
}

function findNextUnansweredIndex(
  exercises: Exercise[],
  results: Record<string, TestSessionItemResult>,
): number {
  const nextIndex = exercises.findIndex((exercise) => !results[exercise.id]);
  return nextIndex === -1 ? exercises.length - 1 : nextIndex;
}

function sanitizeState(exercises: Exercise[], state: TestSessionState): TestSessionState {
  const allowedIds = new Set(exercises.map((exercise) => exercise.id));

  const sanitizedResults = Object.fromEntries(
    Object.entries(state.results).filter(([exerciseId]) => allowedIds.has(exerciseId)),
  ) as Record<string, TestSessionItemResult>;

  const isCompleted = Object.keys(sanitizedResults).length >= exercises.length;

  return {
    results: sanitizedResults,
    currentIndex: isCompleted
      ? Math.max(exercises.length - 1, 0)
      : findNextUnansweredIndex(exercises, sanitizedResults),
    startedAt: state.startedAt,
    completedAt: isCompleted ? (state.completedAt ?? new Date().toISOString()) : null,
  };
}

export function TestSessionProvider({ exercises, children }: TestSessionProviderProps) {
  const [state, setState] = useState<TestSessionState>(createInitialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setIsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as PersistedTestSession;
      if (
        !parsed ||
        parsed.version !== 1 ||
        !Array.isArray(parsed.exerciseIds) ||
        !parsed.state ||
        !areExerciseIdsCompatible(exercises, parsed.exerciseIds)
      ) {
        setIsHydrated(true);
        return;
      }

      setState(sanitizeState(exercises, parsed.state));
    } catch {
      // noop
    } finally {
      setIsHydrated(true);
    }
  }, [exercises]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const payload: PersistedTestSession = {
      version: 1,
      exerciseIds: exercises.map((exercise) => exercise.id),
      state,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [exercises, isHydrated, state]);

  const aggregated = useMemo(
    () => aggregateScores(exercises, state.results),
    [exercises, state.results],
  );
  const isCompleted =
    aggregated.answeredCount >= aggregated.totalCount && aggregated.totalCount > 0;

  const currentExercise = isCompleted
    ? null
    : (exercises[state.currentIndex] ?? exercises[0] ?? null);

  function submit(exerciseId: string, answer: ExerciseAnswer, result: EvaluationResult) {
    setState((prev) => {
      if (prev.results[exerciseId]) {
        return prev;
      }

      const nextResults = {
        ...prev.results,
        [exerciseId]: {
          exerciseId,
          answer,
          result,
        },
      };

      const answeredCount = Object.keys(nextResults).length;
      const finished = answeredCount >= exercises.length;

      return {
        ...prev,
        results: nextResults,
        currentIndex: finished
          ? Math.max(exercises.length - 1, 0)
          : findNextUnansweredIndex(exercises, nextResults),
        completedAt: finished ? new Date().toISOString() : null,
      };
    });
  }

  function skip(exerciseId: string) {
    setState((prev) => {
      if (prev.results[exerciseId]) {
        return prev;
      }

      const nextResults = {
        ...prev.results,
        [exerciseId]: {
          exerciseId,
          answer: null,
          skipped: true,
          result: {
            isCorrect: false,
            score: 0,
            maxScore: 1,
            feedback: "Вопрос пропущен. Баллы за задание: 0.",
          },
        },
      };

      const answeredCount = Object.keys(nextResults).length;
      const finished = answeredCount >= exercises.length;

      return {
        ...prev,
        results: nextResults,
        currentIndex: finished
          ? Math.max(exercises.length - 1, 0)
          : findNextUnansweredIndex(exercises, nextResults),
        completedAt: finished ? new Date().toISOString() : null,
      };
    });
  }

  function restart() {
    const next = createInitialState();
    setState(next);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        exerciseIds: exercises.map((exercise) => exercise.id),
        state: next,
      } satisfies PersistedTestSession),
    );
  }

  const value: TestSessionContextValue = {
    exercises,
    state,
    isHydrated,
    isCompleted,
    currentExercise,
    submit,
    skip,
    restart,
    aggregated,
  };

  return <TestSessionContext.Provider value={value}>{children}</TestSessionContext.Provider>;
}

export function useTestSession() {
  const context = useContext(TestSessionContext);

  if (!context) {
    throw new Error("useTestSession must be used inside TestSessionProvider");
  }

  return context;
}
