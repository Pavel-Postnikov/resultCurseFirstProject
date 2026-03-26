import Link from "next/link";
import styles from "./page.module.css";

const articleLinks = [
  { slug: "js-core", title: "JavaScript Core" },
  { slug: "react-ts", title: "React + TypeScript" },
  { slug: "browser-interview", title: "Browser APIs + Interview" },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Interview Lab</p>
        <h1>Frontend Interview Portal</h1>
        <p>
          Теория, встроенные интерактивы и полноценный test-режим в одном учебном портале для
          подготовки к frontend-собеседованию.
        </p>
        <div className={styles.actions}>
          <Link href="/articles" className={styles.primary}>
            Перейти к статьям
          </Link>
          <Link href="/test" className={styles.secondary}>
            Открыть test-режим
          </Link>
        </div>
      </section>

      <section className={styles.grid}>
        {articleLinks.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.card}>
            <h2>{article.title}</h2>
            <p>Подробная теория + встроенные задания по ходу материала.</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
