import type { Exercise } from "@/components/exercises/types";

export interface JourneyCheckpoint {
  id: string;
  order: number;
  title: string;
  theory: string; // markdown
  timeLimit: number; // seconds
  xpReward: number;
  exercises: Exercise[];
}

export interface Journey {
  id: string;
  topic: string;
  description: string;
  estimatedMinutes: number;
  checkpoints: JourneyCheckpoint[];
}

// Runtime progress — не хранится в JSON, только в памяти / state
export interface JourneyProgress {
  journeyId: string;
  currentCheckpointIndex: number;
  startedAt: number;
  checkpointResults: CheckpointResult[];
  totalXp: number;
  streak: number;
  maxStreak: number;
}

export interface CheckpointResult {
  checkpointId: string;
  completedAt: number;
  timeSpent: number; // seconds
  xpEarned: number;
  exerciseResults: ExerciseResult[];
}

export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
}
