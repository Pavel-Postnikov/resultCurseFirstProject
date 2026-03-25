import styles from "../placeholder.module.css";

export const metadata = {
  title: "Результаты",
};

export default function ResultsPage() {
  return (
    <main className={styles.page}>
      <h1>Результаты</h1>
      <p>
        Каркас страницы готов. На этапе реализации test-сессии здесь появятся score/maxScore, разбор
        ответов и рекомендации по слабым темам.
      </p>
    </main>
  );
}
