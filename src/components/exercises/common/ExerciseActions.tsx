import styles from "./ExerciseActions.module.css";

interface ExerciseActionsProps {
  onCheck: () => void;
  onRetry: () => void;
  canCheck: boolean;
  canRetry: boolean;
  mode: "inline" | "test";
}

export function ExerciseActions({
  onCheck,
  onRetry,
  canCheck,
  canRetry,
  mode,
}: ExerciseActionsProps) {
  return (
    <div className={styles.row}>
      <button
        className={styles.primary}
        type="button"
        onClick={onCheck}
        disabled={!canCheck}
        aria-label="Ответить"
      >
        Ответить
      </button>
      {mode === "inline" && canRetry ? (
        <button
          className={styles.secondary}
          type="button"
          onClick={onRetry}
          aria-label="Попробовать ответить еще раз"
        >
          Попробовать еще
        </button>
      ) : null}
    </div>
  );
}
