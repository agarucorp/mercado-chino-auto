import type { NewsArticle } from "@/components/news/NewsCard";

type NewsScope = Pick<NewsArticle, "marcaId" | "modeloId">;

/** Sin marca ni modelo: al quitarla del radar se borra. */
export function isGeneralNews(article: NewsScope): boolean {
  return !article.marcaId && !article.modeloId;
}

/** Marca sin modelo concreto: aplica a todos los modelos de esa marca. */
export function isBrandWideNews(article: NewsScope): boolean {
  return Boolean(article.marcaId) && !article.modeloId;
}

/** Noticia de un modelo concreto o de “todos los modelos” de esa marca. */
export function newsMatchesModelo(
  article: NewsScope,
  marcaId: string,
  modeloId: string,
): boolean {
  if (article.marcaId !== marcaId) return false;
  return !article.modeloId || article.modeloId === modeloId;
}
