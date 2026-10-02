import type { Review } from "@/data/reviews";
import { formatAuthorDisplay, formatReviewDate, type CreateReviewInput } from "@/lib/review-store";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/types/database";

function client() {
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

export function rowToReview(row: ReviewRow): Review {
  const created = new Date(row.created_at);
  return {
    id: row.id,
    marcaId: row.marca_id,
    modeloId: row.modelo_id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    author: row.author,
    firstName: row.first_name,
    lastName: row.last_name,
    date: formatReviewDate(created),
    sortDate: row.created_at.slice(0, 10),
    rating: row.rating,
    content: row.content,
    likes: row.likes,
    replies: [],
  };
}

export type ReviewPatch = {
  firstName: string;
  lastName: string;
  year: number;
  rating: number;
  content: string;
};

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await client()
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToReview);
}

export async function insertReview(input: CreateReviewInput): Promise<Review> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const { data, error } = await client()
    .from("reviews")
    .insert({
      marca_id: input.marcaId,
      modelo_id: input.modeloId,
      brand: input.brand,
      model: input.model,
      year: input.year,
      first_name: firstName,
      last_name: lastName,
      author: formatAuthorDisplay(firstName, lastName),
      rating: input.rating,
      content: input.content.trim(),
      likes: 0,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToReview(data);
}

export async function updateReview(id: string, patch: ReviewPatch): Promise<Review> {
  const firstName = patch.firstName.trim();
  const lastName = patch.lastName.trim();
  const { data, error } = await client()
    .from("reviews")
    .update({
      first_name: firstName,
      last_name: lastName,
      author: formatAuthorDisplay(firstName, lastName),
      year: patch.year,
      rating: patch.rating,
      content: patch.content.trim(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return rowToReview(data);
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await client().from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
