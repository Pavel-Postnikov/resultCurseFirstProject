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
        aria-label="Проверить ответ"
      >
        Проверить
      </button>
      {mode === "inline" ? (
        <button
          className={styles.secondary}
          type="button"
          onClick={onRetry}
          disabled={!canRetry}
          aria-label="Попробовать ответить еще раз"
        >
          Попробовать еще
        </button>
      ) : null}
    </div>
  );
}
