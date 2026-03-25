import type { EvaluationResult, ExerciseStatus } from "../types";
import styles from "./FeedbackPanel.module.css";

interface FeedbackPanelProps {
  result: EvaluationResult | null;
  explanation: string;
  status: ExerciseStatus;
  showExplanation: boolean;
}

const statusTitle: Record<Exclude<ExerciseStatus, "idle">, string> = {
  "answered-correct": "Правильно",
  "answered-partial": "Частично правильно",
  "answered-wrong": "Неправильно",
};

export function FeedbackPanel({
  result,
  explanation,
  status,
  showExplanation,
}: FeedbackPanelProps) {
  if (!result || status === "idle") {
    return null;
  }

  return (
    <div className={`${styles.panel} ${styles[status]}`}>
      <p className={styles.title}>{statusTitle[status]}</p>
      <p className={styles.feedback}>{result.feedback}</p>
      <p className={styles.score}>
        Баллы: {result.score} / {result.maxScore}
      </p>
      {showExplanation ? <p className={styles.explanation}>{explanation}</p> : null}
    </div>
  );
}
