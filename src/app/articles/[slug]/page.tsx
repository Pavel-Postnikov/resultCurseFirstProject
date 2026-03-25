import Link from "next/link";
import { notFound } from "next/navigation";
import { articleList, getArticleBySlug } from "@/lib/articles";
import styles from "./page.module.css";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articleList.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const ArticleComponent = article.Component;

  return (
    <main className={styles.page}>
      <nav className={styles.backLink}>
        <Link href="/articles">← К списку статей</Link>
      </nav>

      <header className={styles.header}>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
      </header>

      <article className={styles.prose}>
        <ArticleComponent />
      </article>
    </main>
  );
}
