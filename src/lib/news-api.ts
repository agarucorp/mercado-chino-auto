import type { NewsArticle } from "@/components/news/NewsCard";
import { supabase } from "@/lib/supabase";
import type { NewsRow } from "@/types/database";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** "2026-01-22T12:00:00Z" → "22 Ene 2026" */
function formatFecha(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Traduce la fila de la base a la forma que ya consumen las cards.
 * Mantener este mapa evita tocar NewsCard, NewsGrid y las páginas de marca.
 */
export function rowToArticle(row: NewsRow): NewsArticle {
  const iso = row.published_at ?? row.created_at;
  const d = new Date(iso);

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image_url ?? "/placeholder.svg",
    category: row.category,
    source: row.source_name ?? "",
    date: formatFecha(iso),
    year: d.getUTCFullYear(),
    sortDate: iso.slice(0, 10),
    featured: row.featured,
    marcaId: row.marca_id ?? undefined,
    modeloId: row.modelo_id ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    position: row.position,
    body: row.body ?? undefined,
    published: row.published,
    imageAlt: row.image_alt ?? undefined,
  };
}

function client() {
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

export async function fetchNews(): Promise<NewsArticle[]> {
  const { data, error } = await client()
    .from("news")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToArticle);
}

export async function fetchNewsById(id: string): Promise<NewsArticle | null> {
  const { data, error } = await client()
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? rowToArticle(data) : null;
}

export async function extractNewsFromUrl(url: string) {
  const { extractFromJina, isHttpUrl } = await import("@/lib/news-extract");
  if (!isHttpUrl(url)) throw new Error("Pegá un link que empiece con http:// o https://");

  const db = client();
  const { data, error } = await db.functions.invoke("extract-news", { body: { url } });

  if (!error && data && typeof data === "object" && "title" in (data as object)) {
    return data as import("@/lib/news-extract").ExtractedNews;
  }

  const response = await fetch(`https://r.jina.ai/${url}`);
  if (!response.ok) {
    throw new Error(
      "No se pudo leer la nota. Cuando esté desplegada la función extract-news, esto funciona mejor.",
    );
  }
  return extractFromJina(await response.text(), url);
}

export interface NewsInput {
  title: string;
  excerpt: string;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  category: string;
  source_name: string | null;
  source_url: string | null;
  marca_id: string | null;
  modelo_id: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
}

export async function createNews(input: NewsInput): Promise<NewsArticle> {
  const db = client();

  // La nueva entra arriba de todo: position 0 y el resto se corre uno.
  const { data: top } = await db
    .from("news")
    .select("position")
    .order("position", { ascending: true })
    .limit(1);

  const position = (top?.[0]?.position ?? 0) - 1;

  const { data, error } = await db
    .from("news")
    .insert({
      ...input,
      position,
      published: input.published,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToArticle(data);
}

export const NEWS_IMAGE_BUCKET = "news-images";
export const MAX_NEWS_IMAGE_BYTES = 8 * 1024 * 1024;

/** Sube la portada al bucket público y devuelve su URL definitiva. */
export async function uploadNewsImage(file: File): Promise<string> {
  if (file.size > MAX_NEWS_IMAGE_BYTES) {
    throw new Error("La imagen supera los 8 MB.");
  }

  const db = client();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await db.storage
    .from(NEWS_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  return db.storage.from(NEWS_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function updateNews(id: string, patch: Partial<NewsInput>): Promise<NewsArticle> {
  const { data, error } = await client()
    .from("news")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToArticle(data);
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await client().from("news").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Pone una nota primera en el radar: mismo truco que usa createNews (position
 * = mínimo actual - 1). Un solo UPDATE, no hace falta ninguna función en la
 * base ni tocar la posición de las demás notas.
 */
export async function makeNewsPrimary(id: string): Promise<void> {
  const db = client();

  const { data: top, error: topError } = await db
    .from("news")
    .select("position")
    .order("position", { ascending: true })
    .limit(1);

  if (topError) throw new Error(topError.message);

  const currentMin = top?.[0]?.position ?? 0;
  const { error } = await db
    .from("news")
    .update({ position: currentMin - 1 })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
