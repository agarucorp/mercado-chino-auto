import type { NewsArticle } from "@/components/news/NewsCard";
import { resolveModeloId } from "@/lib/marcas";

type NewsScope = Pick<NewsArticle, "marcaId" | "modeloId">;

/** Sin marca ni modelo: al quitarla del radar se borra. */
export function isGeneralNews(article: NewsScope): boolean {
  return !article.marcaId && !article.modeloId;
}

/** Marca sin modelo concreto: aplica a todos los modelos de esa marca. */
export function isBrandWideNews(article: NewsScope): boolean {
  return Boolean(article.marcaId) && !article.modeloId;
}

/** Noticia de un modelo concreto, de un alias unificado, o de “todos los modelos”. */
export function newsMatchesModelo(
  article: NewsScope,
  marcaId: string,
  modeloId: string,
): boolean {
  if (article.marcaId !== marcaId) return false;
  if (!article.modeloId) return true;
  return resolveModeloId(article.modeloId) === resolveModeloId(modeloId);
}
