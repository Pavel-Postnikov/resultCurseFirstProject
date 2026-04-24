import Link from "next/link";
import type { Journey } from "@/types/journey";
import styles from "./JourneyCard.module.css";

interface Props {
  journey: Journey;
}

export function JourneyCard({ journey }: Props) {
  const maxXp = journey.checkpoints.reduce((s, cp) => s + cp.xpReward, 0);

  return (
    <Link href={`/journey/${journey.id}`} className={styles.card}>
      <div className={styles.kicker}>Knowledge Journey</div>
      <h2 className={styles.title}>{journey.topic}</h2>
      <p className={styles.description}>{journey.description}</p>
      <div className={styles.meta}>
        <span>📍 {journey.checkpoints.length} чекпоинтов</span>
        <span>⏱ ~{journey.estimatedMinutes} мин</span>
        <span>⚡ до {maxXp} XP</span>
      </div>
      <div className={styles.cta}>Начать путешествие →</div>
    </Link>
  );
}
