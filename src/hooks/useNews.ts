import type { NewsArticle } from "@/components/news/NewsCard";
import { NEWS_DATA } from "@/data/news";
import {
  createNews,
  deleteNews,
  fetchNews,
  makeNewsPrimary,
  updateNews,
  type NewsInput,
} from "@/lib/news-api";
import { newsMatchesModelo } from "@/lib/news-placement";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const NEWS_QUERY_KEY = ["news"] as const;

/**
 * La base es la fuente de verdad. Sin credenciales caemos al set estático
 * para que la sección no quede vacía en un clon sin `.env`.
 */
export function useNews() {
  return useQuery<NewsArticle[]>({
    queryKey: NEWS_QUERY_KEY,
    queryFn: () => (isSupabaseConfigured ? fetchNews() : Promise.resolve(NEWS_DATA)),
    staleTime: 60_000,
  });
}

/**
 * Derivados de la misma query: TanStack la cachea, así que la home y las
 * páginas de marca no disparan un fetch extra cada una.
 */
export function useNewsByMarca(marcaId: string): NewsArticle[] {
  const { data = [] } = useNews();
  return useMemo(
    () => data.filter((n) => n.published !== false && n.marcaId === marcaId),
    [data, marcaId],
  );
}

export function useNewsByModelo(marcaId: string, modeloId: string): NewsArticle[] {
  const { data = [] } = useNews();
  return useMemo(
    () => data.filter((n) => newsMatchesModelo(n, marcaId, modeloId)),
    [data, marcaId, modeloId],
  );
}

export function useNewsMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: NEWS_QUERY_KEY });

  const create = useMutation({
    mutationFn: (input: NewsInput) => createNews(input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewsInput> }) =>
      updateNews(id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: invalidate,
  });

  const makePrimary = useMutation({
    mutationFn: (id: string) => makeNewsPrimary(id),
    onSuccess: invalidate,
  });

  return { create, update, remove, makePrimary };
}
