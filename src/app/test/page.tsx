import styles from "../placeholder.module.css";

export const metadata = {
  title: "Test-режим",
};

export default function TestPage() {
  return (
    <main className={styles.page}>
      <h1>Test-режим</h1>
      <p>
        Каркас страницы готов. На следующих этапах здесь появится последовательность из 10-12
        заданий, прогресс-бар и подсчет итоговых баллов.
      </p>
    </main>
  );
}
