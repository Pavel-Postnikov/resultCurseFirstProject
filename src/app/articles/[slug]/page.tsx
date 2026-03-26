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
  const inlineExercisesById = Object.fromEntries(
    inlineExercises.map((exercise) => [exercise.id, exercise]),
  );

  function ExerciseInline({ id }: { id: string }) {
    const exercise = inlineExercisesById[id];

    if (!exercise) {
      return (
        <aside className={styles.inlineFallback}>
          <p>
            Упражнение <code>{id}</code> не найдено в данных статьи.
          </p>
        </aside>
      );
    }

    return (
      <div className={styles.inlineExercise}>
        <ExerciseRenderer exercise={exercise} mode="inline" />
      </div>
    );
  }

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
        <ArticleComponent components={{ ExerciseInline }} />
      </article>
    </main>
  );
}
