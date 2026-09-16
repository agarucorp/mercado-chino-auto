import type { Listing } from "@/data/listings";
import { supabase } from "@/lib/supabase";
import type { ListingRow, ListingStatus, PlanId } from "@/types/database";
import type { ListingDraft } from "@/lib/listing-draft";

export const LISTING_IMAGE_BUCKET = "listing-images";

function client() {
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

export function listingImagePublicUrl(storagePath: string): string {
  return client().storage.from(LISTING_IMAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export function rowToListing(
  row: ListingRow,
  imagePaths: string[] = [],
): Listing {
  const urls = imagePaths.map(listingImagePublicUrl);
  const cover = urls[0] ?? "/placeholder.svg";

  return {
    id: row.id,
    title: row.title,
    version: row.version ?? "",
    price: Number(row.price),
    year: row.year,
    km: row.km,
    fuel: row.fuel,
    transmission: row.transmission,
    location: row.location,
    province: row.province,
    image: cover,
    images: urls.length ? urls : [cover],
    featured: row.plan !== "basico",
    marcaId: row.marca_id,
    modeloId: row.modelo_id,
    description: row.description,
    general: [
      { label: "Año", value: String(row.year), highlight: true },
      { label: "Kilometraje", value: `${row.km.toLocaleString("es-AR")} km` },
      { label: "Combustible", value: row.fuel },
      { label: "Transmisión", value: row.transmission },
    ],
    performance: [],
    security: [],
    equipment: [],
    seller: {
      name: row.seller_name,
      type: row.seller_type,
      address: row.location,
      city: row.location,
      province: row.province,
      listingsCount: 1,
    },
    currency: row.currency,
    plan: row.plan,
    status: row.status,
    sellerEmail: row.seller_email,
    sellerPhone: row.seller_phone,
    adminNotes: row.admin_notes,
    submittedAt: row.submitted_at,
  };
}

async function imagePathsFor(listingIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (!listingIds.length) return map;

  const { data, error } = await client()
    .from("listing_images")
    .select("listing_id, storage_path, position")
    .in("listing_id", listingIds)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);

  for (const row of data ?? []) {
    const list = map.get(row.listing_id) ?? [];
    list.push(row.storage_path);
    map.set(row.listing_id, list);
  }
  return map;
}

export async function fetchApprovedListings(): Promise<Listing[]> {
  const { data, error } = await client()
    .from("listings")
    .select("*")
    .eq("status", "aprobada")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const images = await imagePathsFor(rows.map((r) => r.id));
  return rows.map((row) => rowToListing(row, images.get(row.id) ?? []));
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  const { data, error } = await client().from("listings").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const images = await imagePathsFor([data.id]);
  return rowToListing(data, images.get(data.id) ?? []);
}

export interface AdminListing extends Listing {
  remote: ListingRow;
}

export async function fetchAdminListings(): Promise<AdminListing[]> {
  const { data, error } = await client()
    .from("listings")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const images = await imagePathsFor(rows.map((r) => r.id));
  return rows.map((row) => ({
    ...rowToListing(row, images.get(row.id) ?? []),
    remote: row,
  }));
}

/**
 * invoke() manda la publishable key en Authorization. Esa key no es un JWT,
 * el gateway responde 401 y Resend nunca llega a ejecutarse.
 * Enviamos apikey siempre; Authorization solo si hay sesión de usuario.
 */
async function notifyListing(
  listingId: string,
  event: "submitted" | "reviewed",
): Promise<{ mailSent: boolean; mailError?: string }> {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
  const { data: sessionData } = await client().auth.getSession();
  const userJwt = sessionData.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: anonKey,
  };
  if (userJwt) headers.Authorization = `Bearer ${userJwt}`;

  const res = await fetch(`${url}/functions/v1/notify-listing`, {
    method: "POST",
    headers,
    body: JSON.stringify({ listingId, event }),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    error?: string;
    skipped?: boolean;
    reason?: string;
    ok?: boolean;
  };

  if (!res.ok) {
    const mailError =
      typeof payload.error === "string" ? payload.error : `notify_listing_${res.status}`;
    console.error("notify-listing", mailError);
    return { mailSent: false, mailError };
  }

  if (payload.skipped) {
    const mailError = payload.reason ?? "skipped";
    console.warn("notify-listing skipped", mailError);
    return { mailSent: false, mailError };
  }

  return { mailSent: true };
}

export async function submitListing(
  draft: ListingDraft,
  blobs: Map<string, Blob>,
): Promise<{ listingId: string; mailSent: boolean; mailError?: string }> {
  const db = client();
  if (!draft.planId) throw new Error("Elegí un plan de publicación.");

  const { data, error } = await db
    .from("listings")
    .insert({
      status: "pendiente",
      plan: draft.planId,
      marca_id: draft.marcaId,
      modelo_id: draft.modeloId,
      version: draft.version.trim() || null,
      year: Number(draft.year),
      km: Number(draft.km),
      price: Number(draft.price),
      currency: draft.currency,
      fuel: draft.fuel,
      transmission: draft.transmission,
      location: draft.location.trim(),
      province: draft.province,
      title: draft.title.trim(),
      description: draft.description.trim(),
      seller_name: draft.sellerName.trim(),
      seller_email: draft.sellerEmail.trim(),
      seller_phone: draft.sellerPhone.trim(),
      seller_type: draft.sellerType,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const listingId = data.id;

  let position = 0;
  for (const image of draft.images) {
    const blob = blobs.get(image.id);
    if (!blob) continue;
    const ext = image.type.split("/")[1] === "jpeg" ? "jpg" : image.type.split("/")[1] || "jpg";
    const path = `${listingId}/${position}-${image.id}.${ext}`;

    const { error: uploadError } = await db.storage
      .from(LISTING_IMAGE_BUCKET)
      .upload(path, blob, { contentType: image.type, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { error: rowError } = await db.from("listing_images").insert({
      listing_id: listingId,
      storage_path: path,
      alt: image.name,
      position,
    });
    if (rowError) throw new Error(rowError.message);
    position += 1;
  }

  const mail = await notifyListing(listingId, "submitted");
  return { listingId, ...mail };
}

export async function reviewListing(input: {
  id: string;
  status: Extract<ListingStatus, "aprobada" | "rechazada" | "pendiente">;
  adminNotes: string;
  reviewerId: string;
}): Promise<void> {
  const published_at =
    input.status === "aprobada" ? new Date().toISOString() : null;

  const { error } = await client()
    .from("listings")
    .update({
      status: input.status,
      admin_notes: input.adminNotes.trim() || null,
      reviewed_by: input.reviewerId,
      reviewed_at: new Date().toISOString(),
      published_at,
    })
    .eq("id", input.id);

  if (error) throw new Error(error.message);

  await notifyListing(input.id, "reviewed");
}

export type { PlanId };
