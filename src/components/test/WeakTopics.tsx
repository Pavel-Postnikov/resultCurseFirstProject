"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = !shouldReduceMotion;

  return (
    <motion.section
      className={styles.card}
      initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
    >
      <h2>Рекомендации по темам</h2>
      {items.length === 0 ? (
        <motion.p
          className={styles.success}
          initial={shouldAnimate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          Слабых тем не найдено по текущему порогу. Отличный результат.
        </motion.p>
      ) : (
        <ul className={styles.list}>
          {items.map((item, index) => (
            <motion.li
              key={item.tag}
              className={styles.item}
              initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: shouldAnimate ? index * 0.03 : 0 }}
            >
              <p>
                {item.tag}: {item.percentage}% ({item.score}/{item.maxScore})
              </p>
              <p className={styles.hint}>
                {recommendationsByTag[item.tag] ?? "Повтори материал по теме"}
              </p>
              <div className={styles.progressTrack} aria-hidden>
                <motion.div
                  className={styles.progressFill}
                  initial={false}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.36, delay: shouldAnimate ? 0.06 + index * 0.04 : 0 }}
                />
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}
