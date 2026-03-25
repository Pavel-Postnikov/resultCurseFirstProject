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
        <p className={styles.kicker}>Milestone 1</p>
        <h1>Frontend Interview Portal</h1>
        <p>
          Каркас проекта готов: статьи на MDX, отдельный test-режим и страница результатов. Дальше
          добавляем интерактивные компоненты и систему оценки.
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
            <p>Черновая статья подключена через MDX.</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
