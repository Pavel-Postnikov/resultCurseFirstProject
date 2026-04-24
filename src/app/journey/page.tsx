import type { Metadata } from "next";
import { getAllJourneys } from "@/lib/journey";
import { JourneyCard } from "@/components/journey/JourneyCard";
import { GenerateButton } from "@/components/journey/GenerateButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Knowledge Journey — выбор темы",
};

export default function JourneyListPage() {
  const journeys = getAllJourneys();

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <span className={styles.kicker}>Knowledge Journey</span>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Выбери тему для изучения</h1>
          <GenerateButton />
        </div>
        <p className={styles.subtitle}>
          Каждая тема — это цепочка чекпоинтов с теорией, упражнениями и таймером.
          Проходи под давлением времени и зарабатывай XP.
        </p>
      </div>

      <div className={styles.grid}>
        {journeys.map((journey) => (
          <JourneyCard key={journey.id} journey={journey} />
        ))}
      </div>
    </main>
  );
}
