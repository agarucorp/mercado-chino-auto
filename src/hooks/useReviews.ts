import type { Review } from "@/data/reviews";
import {
  addReviewReply,
  createReview,
  getAllReviewsRaw,
  isReviewLikedByUser,
  toggleReviewLike,
  withLocalOverlays,
  type CreateReplyInput,
  type CreateReviewInput,
} from "@/lib/review-store";
import { deleteReview, fetchReviews, insertReview, updateReview, type ReviewPatch } from "@/lib/reviews-api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { resolveModeloId } from "@/lib/marcas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export const REVIEWS_QUERY_KEY = ["reviews"] as const;

function localReviews(): Review[] {
  return withLocalOverlays(getAllReviewsRaw()).sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

/**
 * La base es la fuente de verdad. Sin credenciales, o si la tabla no existe,
 * se usan las reseñas guardadas en este navegador.
 */
async function loadReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured) return localReviews();
  try {
    const remote = await fetchReviews();
    return withLocalOverlays(remote);
  } catch {
    return localReviews();
  }
}

export function useReviews(marcaId: string, modeloId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: loadReviews,
    staleTime: 30_000,
  });

  const reviews = useMemo(() => {
    const all = query.data ?? [];
    const target = resolveModeloId(modeloId);
    return all.filter(
      (review) =>
        review.marcaId === marcaId && resolveModeloId(review.modeloId ?? "") === target,
    );
  }, [query.data, marcaId, modeloId]);

  const likedMap = useMemo(
    () => Object.fromEntries(reviews.map((review) => [review.id, isReviewLikedByUser(review.id)])),
    [reviews],
  );

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
  }, [queryClient]);

  const submitReview = useCallback(
    async (input: Omit<CreateReviewInput, "marcaId" | "modeloId">) => {
      const full = { ...input, marcaId, modeloId };
      if (isSupabaseConfigured) {
        try {
          await insertReview(full);
        } catch (err) {
          const message = err instanceof Error ? err.message : "";
          const tableMissing = /reviews/i.test(message) && /schema cache|does not exist|could not find/i.test(message);
          if (!tableMissing) throw err;
          createReview(full);
        }
      } else {
        createReview(full);
      }
      refresh();
    },
    [marcaId, modeloId, refresh],
  );

  const likeReview = useCallback(
    (reviewId: string) => {
      toggleReviewLike(reviewId);
      refresh();
    },
    [refresh],
  );

  const replyToReview = useCallback(
    (reviewId: string, input: CreateReplyInput) => {
      addReviewReply(reviewId, input);
      refresh();
    },
    [refresh],
  );

  return {
    reviews,
    likedMap,
    submitReview,
    likeReview,
    replyToReview,
    refresh,
    isLoading: query.isLoading,
  };
}

export function useAdminReviews() {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEY,
    queryFn: async () => withLocalOverlays(await fetchReviews()),
    staleTime: 15_000,
  });
}

export function useReviewMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ReviewPatch }) => updateReview(id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: invalidate,
  });

  return { update, remove };
}
