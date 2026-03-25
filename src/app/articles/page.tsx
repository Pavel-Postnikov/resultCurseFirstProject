import Link from "next/link";
import { articleList } from "@/lib/articles";
import styles from "./page.module.css";

export const metadata = {
  title: "Статьи",
};

export default function ArticlesPage() {
  return (
    <main className={styles.page}>
      <header>
        <h1>Статьи</h1>
        <p>Теория по блокам + встроенная практика (следующий этап после Milestone 1).</p>
      </header>

      <section className={styles.grid}>
        {articleList.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className={styles.card}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
