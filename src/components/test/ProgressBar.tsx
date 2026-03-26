import { motion, useReducedMotion } from "framer-motion";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  answeredCount: number;
  totalCount: number;
}

export function ProgressBar({ answeredCount, totalCount }: ProgressBarProps) {
  const progress = totalCount === 0 ? 0 : Math.round((answeredCount / totalCount) * 100);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={styles.card}>
      <div className={styles.topRow}>
        <span>
          Прогресс: {answeredCount}/{totalCount}
        </span>
        <strong>{progress}%</strong>
      </div>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.26 }}
        />
      </div>
    </section>
  );
}
