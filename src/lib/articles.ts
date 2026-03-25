import type { ComponentType } from "react";

import BrowserInterviewArticle from "../../content/articles/browser-interview.mdx";
import JsCoreArticle from "../../content/articles/js-core.mdx";
import ReactTsArticle from "../../content/articles/react-ts.mdx";

export const articleSlugs = ["js-core", "react-ts", "browser-interview"] as const;

export type ArticleSlug = (typeof articleSlugs)[number];

type ArticleComponent = ComponentType<Record<string, never>>;

export interface ArticleMeta {
  slug: ArticleSlug;
  title: string;
  description: string;
  Component: ArticleComponent;
}

export const articleList: ArticleMeta[] = [
  {
    slug: "js-core",
    title: "JavaScript Core",
    description: "Execution Context, Event Loop, closures и ключевые интервью-ловушки.",
    Component: JsCoreArticle,
  },
  {
    slug: "react-ts",
    title: "React + TypeScript",
    description: "Рендеринг, хуки, типизация компонентов и практичные TS-паттерны.",
    Component: ReactTsArticle,
  },
  {
    slug: "browser-interview",
    title: "Browser APIs + Interview",
    description: "DOM, HTTP, CORS, Storage и объяснение технических решений.",
    Component: BrowserInterviewArticle,
  },
];

const articleMap: Record<ArticleSlug, ArticleMeta> = {
  "js-core": articleList[0],
  "react-ts": articleList[1],
  "browser-interview": articleList[2],
};

export function isArticleSlug(slug: string): slug is ArticleSlug {
  return articleSlugs.includes(slug as ArticleSlug);
}

export function getArticleBySlug(slug: string): ArticleMeta | null {
  if (!isArticleSlug(slug)) {
    return null;
  }

  return articleMap[slug];
}
