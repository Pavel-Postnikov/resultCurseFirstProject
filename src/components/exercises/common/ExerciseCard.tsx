import type { ReactNode } from "react";
import type { ExerciseMode, ExerciseStatus } from "../types";
import styles from "./ExerciseCard.module.css";

interface ExerciseCardProps {
  title?: string;
  question: string;
  mode: ExerciseMode;
  status: ExerciseStatus;
  typeLabel: string;
  children: ReactNode;
}

export function ExerciseCard({
  title,
  question,
  mode,
  status,
  typeLabel,
  children,
}: ExerciseCardProps) {
  return (
    <section className={`${styles.card} ${styles[status]}`}>
      <header className={styles.header}>
        <div className={styles.metaRow}>
          <span className={styles.type}>{typeLabel}</span>
          <span className={styles.mode}>{mode === "inline" ? "Inline" : "Test"}</span>
        </div>
        {title ? <h3 className={styles.title}>{title}</h3> : null}
        <p className={styles.question}>{question}</p>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
