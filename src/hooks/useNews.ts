import type { NewsArticle } from "@/components/news/NewsCard";
import { NEWS_DATA } from "@/data/news";
import {
  createNews,
  deleteNews,
  fetchNews,
  reorderNews,
  updateNews,
  type NewsInput,
} from "@/lib/news-api";
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
    () => data.filter((n) => n.marcaId === marcaId && n.modeloId === modeloId),
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

  const reorder = useMutation({
    mutationFn: (orderedIds: string[]) => reorderNews(orderedIds),

    // El drag tiene que verse instantáneo: pintamos el orden nuevo antes de
    // que responda la base y lo revertimos si falla.
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: NEWS_QUERY_KEY });
      const previous = queryClient.getQueryData<NewsArticle[]>(NEWS_QUERY_KEY);

      if (previous) {
        const byId = new Map(previous.map((n) => [n.id, n]));
        const reordered = orderedIds
          .map((id) => byId.get(id))
          .filter((n): n is NewsArticle => Boolean(n));
        queryClient.setQueryData(NEWS_QUERY_KEY, reordered);
      }

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NEWS_QUERY_KEY, context.previous);
      }
    },

    onSettled: invalidate,
  });

  return { create, update, remove, reorder };
}
