export interface ReviewReply {
  id: string;
  firstName: string;
  lastName: string;
  author: string;
  content: string;
  date: string;
  sortDate: string;
}

export interface Review {
  id: string;
  marcaId: string;
  modeloId?: string;
  brand: string;
  model: string;
  year: number;
  author: string;
  firstName?: string;
  lastName?: string;
  date: string;
  sortDate: string;
  rating: number;
  content: string;
  likes: number;
  replies: ReviewReply[];
}

/** Vacío a propósito: las reseñas viven en la base y se moderan desde el panel. */
export const REVIEWS_DATA: Review[] = [];

export function getReviewsByModelo(marcaId: string, modeloId: string) {
  return REVIEWS_DATA.filter(
    (r) => r.marcaId === marcaId && r.modeloId === modeloId,
  );
}

export interface ModeloReviewStats {
  marcaId: string;
  modeloId: string;
  brand: string;
  model: string;
  count: number;
  avgRating: number;
  totalLikes: number;
}
