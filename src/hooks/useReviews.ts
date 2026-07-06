import {
  addReviewReply,
  createReview,
  getMergedReviewsByModelo,
  isReviewLikedByUser,
  toggleReviewLike,
  type CreateReplyInput,
  type CreateReviewInput,
} from "@/lib/review-store";
import type { Review } from "@/data/reviews";
import { useCallback, useState } from "react";

export function useReviews(marcaId: string, modeloId: string) {
  const [reviews, setReviews] = useState<Review[]>(() =>
    getMergedReviewsByModelo(marcaId, modeloId),
  );
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    const initial = getMergedReviewsByModelo(marcaId, modeloId);
    return Object.fromEntries(initial.map((r) => [r.id, isReviewLikedByUser(r.id)]));
  });

  const refresh = useCallback(() => {
    const merged = getMergedReviewsByModelo(marcaId, modeloId);
    setReviews(merged);
    setLikedMap(Object.fromEntries(merged.map((r) => [r.id, isReviewLikedByUser(r.id)])));
  }, [marcaId, modeloId]);

  const submitReview = useCallback(
    (input: Omit<CreateReviewInput, "marcaId" | "modeloId">) => {
      createReview({ ...input, marcaId, modeloId });
      refresh();
    },
    [marcaId, modeloId, refresh],
  );

  const likeReview = useCallback(
    (reviewId: string) => {
      const { liked } = toggleReviewLike(reviewId);
      setLikedMap((prev) => ({ ...prev, [reviewId]: liked }));
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
  };
}
