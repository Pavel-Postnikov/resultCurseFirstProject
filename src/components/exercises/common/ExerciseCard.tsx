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

function renderQuestion(text: string) {
  const parts = text.split(/(```[\w]*\n[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith("```")) {
      const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
      return (
        <pre key={i} className={styles.questionCode}>
          <code>{code.trimEnd()}</code>
        </pre>
      );
    }
    return part ? <span key={i}>{part}</span> : null;
  });
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
        <div className={styles.question}>{renderQuestion(question)}</div>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
