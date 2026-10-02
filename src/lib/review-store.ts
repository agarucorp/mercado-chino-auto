import { REVIEWS_DATA, type ModeloReviewStats, type Review, type ReviewReply } from "@/data/reviews";
import { resolveModeloId } from "@/lib/marcas";

const USER_REVIEWS_KEY = "auchar-user-reviews";
const REVIEW_OVERLAYS_KEY = "auchar-review-overlays";

export interface ReviewOverlay {
  extraLikes: number;
  likedByUser: boolean;
  replies: ReviewReply[];
}

export interface CreateReviewInput {
  marcaId: string;
  modeloId: string;
  brand: string;
  model: string;
  year: number;
  firstName: string;
  lastName: string;
  rating: number;
  content: string;
}

export interface CreateReplyInput {
  firstName: string;
  lastName: string;
  content: string;
}

export function formatAuthorDisplay(firstName: string, lastName: string): string {
  const name = firstName.trim();
  const last = lastName.trim();
  if (!name) return "Usuario";
  if (!last) return name;
  return `${name} ${last.charAt(0).toUpperCase()}.`;
}

export function formatReviewDate(date: Date = new Date()): string {
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function readUserReviews(): Review[] {
  try {
    const raw = localStorage.getItem(USER_REVIEWS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Review[];
  } catch {
    return [];
  }
}

function writeUserReviews(reviews: Review[]) {
  localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(reviews));
}

function readOverlays(): Record<string, ReviewOverlay> {
  try {
    const raw = localStorage.getItem(REVIEW_OVERLAYS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ReviewOverlay>;
  } catch {
    return {};
  }
}

function writeOverlays(overlays: Record<string, ReviewOverlay>) {
  localStorage.setItem(REVIEW_OVERLAYS_KEY, JSON.stringify(overlays));
}

function applyOverlay(review: Review, overlay?: ReviewOverlay): Review {
  if (!overlay) return { ...review, replies: review.replies ?? [] };
  return {
    ...review,
    likes: review.likes + overlay.extraLikes,
    replies: [...(review.replies ?? []), ...overlay.replies],
  };
}

export function getAllReviewsRaw(): Review[] {
  return [...REVIEWS_DATA, ...readUserReviews()];
}

export function getMergedReviewById(reviewId: string): Review | undefined {
  const review = getAllReviewsRaw().find((r) => r.id === reviewId);
  if (!review) return undefined;
  const overlays = readOverlays();
  return applyOverlay(review, overlays[reviewId]);
}

export function getMergedReviewsByModelo(marcaId: string, modeloId: string): Review[] {
  const overlays = readOverlays();
  return getAllReviewsRaw()
    .filter(
      (r) =>
        r.marcaId === marcaId &&
        resolveModeloId(r.modeloId ?? "") === resolveModeloId(modeloId),
    )
    .map((r) => applyOverlay(r, overlays[r.id]))
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate));
}

export function isReviewLikedByUser(reviewId: string): boolean {
  return readOverlays()[reviewId]?.likedByUser ?? false;
}

export function createReview(input: CreateReviewInput): Review {
  const now = new Date();
  const review: Review = {
    id: `user-${now.getTime()}`,
    marcaId: input.marcaId,
    modeloId: input.modeloId,
    brand: input.brand,
    model: input.model,
    year: input.year,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    author: formatAuthorDisplay(input.firstName, input.lastName),
    date: formatReviewDate(now),
    sortDate: now.toISOString().slice(0, 10),
    rating: input.rating,
    content: input.content.trim(),
    likes: 0,
    replies: [],
  };

  const userReviews = readUserReviews();
  writeUserReviews([review, ...userReviews]);
  return review;
}

/** Likes y respuestas siguen en este navegador. El texto vive en la base. */
export function withLocalOverlays(reviews: Review[]): Review[] {
  const overlays = readOverlays();
  return reviews.map((review) => applyOverlay(review, overlays[review.id]));
}

export function toggleReviewLike(reviewId: string): { likes: number; liked: boolean } {
  const overlays = readOverlays();
  const base = getAllReviewsRaw().find((r) => r.id === reviewId);

  const current = overlays[reviewId] ?? { extraLikes: 0, likedByUser: false, replies: [] };
  const liked = !current.likedByUser;
  const extraLikes = liked ? current.extraLikes + 1 : Math.max(0, current.extraLikes - 1);

  overlays[reviewId] = { ...current, extraLikes, likedByUser: liked };
  writeOverlays(overlays);

  return { likes: (base?.likes ?? 0) + extraLikes, liked };
}

export function addReviewReply(reviewId: string, input: CreateReplyInput): ReviewReply | null {
  const content = input.content.trim();
  if (!content) return null;

  const now = new Date();
  const reply: ReviewReply = {
    id: `reply-${now.getTime()}`,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    author: formatAuthorDisplay(input.firstName, input.lastName),
    content,
    date: formatReviewDate(now),
    sortDate: now.toISOString().slice(0, 10),
  };

  const overlays = readOverlays();
  const current = overlays[reviewId] ?? { extraLikes: 0, likedByUser: false, replies: [] };
  overlays[reviewId] = { ...current, replies: [...current.replies, reply] };
  writeOverlays(overlays);

  return reply;
}

export function getModelosMasComentados(limit = 3): ModeloReviewStats[] {
  const map = new Map<string, ModeloReviewStats>();

  for (const review of getAllReviewsRaw()) {
    if (!review.modeloId) continue;
    const key = review.modeloId;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
      existing.avgRating =
        (existing.avgRating * (existing.count - 1) + review.rating) / existing.count;
      existing.totalLikes += review.likes;
    } else {
      map.set(key, {
        marcaId: review.marcaId,
        modeloId: review.modeloId,
        brand: review.brand,
        model: review.model,
        count: 1,
        avgRating: review.rating,
        totalLikes: review.likes,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count || b.totalLikes - a.totalLikes)
    .slice(0, limit);
}
