import type { WeakTopicItem } from "@/lib/scoring/weakTopics";
import styles from "./WeakTopics.module.css";

const recommendationsByTag: Record<string, string> = {
  "event-loop": "Статья: JavaScript Core",
  javascript: "Статья: JavaScript Core",
  "react-hooks": "Статья: React + TypeScript",
  typescript: "Статья: React + TypeScript",
  "utility-types": "Статья: React + TypeScript",
  cors: "Статья: Browser APIs + Interview",
  fetch: "Статья: Browser APIs + Interview",
  cookies: "Статья: Browser APIs + Interview",
  security: "Статья: Browser APIs + Interview",
  "web-api": "Статья: Browser APIs + Interview",
};

interface WeakTopicsProps {
  items: WeakTopicItem[];
}

export function WeakTopics({ items }: WeakTopicsProps) {
  return (
    <section className={styles.card}>
      <h2>Рекомендации по темам</h2>
      {items.length === 0 ? (
        <p className={styles.success}>
          Слабых тем не найдено по текущему порогу. Отличный результат.
        </p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.tag} className={styles.item}>
              <p>
                {item.tag}: {item.percentage}% ({item.score}/{item.maxScore})
              </p>
              <p className={styles.hint}>
                {recommendationsByTag[item.tag] ?? "Повтори материал по теме"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
