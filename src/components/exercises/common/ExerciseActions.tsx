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
      <button className={styles.primary} type="button" onClick={onCheck} disabled={!canCheck}>
        Проверить
      </button>
      {mode === "inline" ? (
        <button className={styles.secondary} type="button" onClick={onRetry} disabled={!canRetry}>
          Попробовать еще
        </button>
      ) : null}
    </div>
  );
}
