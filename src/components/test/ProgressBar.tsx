import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  answeredCount: number;
  totalCount: number;
}

export function ProgressBar({ answeredCount, totalCount }: ProgressBarProps) {
  const progress = totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);

  return (
    <section className={styles.card}>
      <div className={styles.topRow}>
        <span>
          Прогресс: {answeredCount}/{totalCount}
        </span>
        <strong>{progress}%</strong>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
