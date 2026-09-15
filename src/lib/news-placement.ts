import type { NewsArticle } from "@/components/news/NewsCard";

/** Sin modelo no hay historial de ficha: quitarla es borrarla. */
export function isGeneralNews(article: Pick<NewsArticle, "modeloId">): boolean {
  return !article.modeloId;
}
