import Link from "next/link";
import { notFound } from "next/navigation";
import { ExerciseRenderer } from "@/components/exercises";
import { articleList, getArticleBySlug } from "@/lib/articles";
import { getInlineExercisesForArticle } from "@/lib/exercises";
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
  const inlineExercises = getInlineExercisesForArticle(slug);

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

      {inlineExercises.length > 0 ? (
        <section className={styles.practice}>
          <h2>Практика по теме</h2>
          <p>Упражнения работают в inline-режиме и дают обратную связь сразу в статье.</p>
          <div className={styles.exerciseList}>
            {inlineExercises.map((exercise) => (
              <ExerciseRenderer key={exercise.id} exercise={exercise} mode="inline" />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
