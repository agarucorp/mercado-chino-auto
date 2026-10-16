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
    price: row.price == null ? 0 : Number(row.price),
    priceOnRequest: row.price_on_request === true,
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
    isWeeklyPick: row.is_weekly_pick ?? false,
    homePickOrder: row.home_pick_order ?? null,
    sold: row.sold === true,
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

export interface AdminListingImage {
  id: string;
  storagePath: string;
  url: string;
  position: number;
}

async function imageRecordsFor(listingId: string): Promise<AdminListingImage[]> {
  const { data, error } = await client()
    .from("listing_images")
    .select("id, storage_path, position")
    .eq("listing_id", listingId)
    .order("position", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    storagePath: row.storage_path,
    url: listingImagePublicUrl(row.storage_path),
    position: row.position,
  }));
}

export interface AdminListing extends Listing {
  remote: ListingRow;
  imageRecords?: AdminListingImage[];
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

export async function fetchAdminListingById(id: string): Promise<AdminListing | null> {
  const { data, error } = await client().from("listings").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const imageRecords = await imageRecordsFor(data.id);
  return {
    ...rowToListing(
      data,
      imageRecords.map((r) => r.storagePath),
    ),
    remote: data,
    imageRecords,
  };
}

/** Saca una foto de un aviso existente: fila y objeto en storage. */
export async function deleteListingImage(image: { id: string; storagePath: string }): Promise<void> {
  const db = client();
  const { error: rowError } = await db.from("listing_images").delete().eq("id", image.id);
  if (rowError) throw new Error(rowError.message);

  const { error: storageError } = await db.storage
    .from(LISTING_IMAGE_BUCKET)
    .remove([image.storagePath]);
  if (storageError) throw new Error(storageError.message);
}

/**
 * Cambia el orden de las fotos de un aviso (la de position 0 es la portada).
 * Son pocas fotos por aviso, así que un update por fila alcanza sin necesitar
 * una función atómica como la de noticias.
 */
export async function reorderListingImages(
  items: { id: string; position: number }[],
): Promise<void> {
  const db = client();
  for (const item of items) {
    const { error } = await db
      .from("listing_images")
      .update({ position: item.position })
      .eq("id", item.id);
    if (error) throw new Error(error.message);
  }
}

/** Elimina un aviso para siempre: sus fotos (storage + filas) y la fila del aviso. */
export async function deleteListing(id: string): Promise<void> {
  const db = client();
  const images = await imageRecordsFor(id);

  if (images.length > 0) {
    const { error: storageError } = await db.storage
      .from(LISTING_IMAGE_BUCKET)
      .remove(images.map((img) => img.storagePath));
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await db.from("listings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Suma una foto a un aviso que ya existe (no al alta: ahí se usa uploadListingImage + createListing). */
export async function addListingImage(
  listingId: string,
  file: File,
): Promise<AdminListingImage> {
  const storagePath = await uploadListingImage(listingId, file);
  const db = client();

  const { data: top } = await db
    .from("listing_images")
    .select("position")
    .eq("listing_id", listingId)
    .order("position", { ascending: false })
    .limit(1);

  const position = (top?.[0]?.position ?? -1) + 1;

  const { data, error } = await db
    .from("listing_images")
    .insert({ listing_id: listingId, storage_path: storagePath, position })
    .select("id, storage_path, position")
    .single();

  if (error) throw new Error(error.message);
  return {
    id: data.id,
    storagePath: data.storage_path,
    url: listingImagePublicUrl(data.storage_path),
    position: data.position,
  };
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

function mapSubmitError(message: string): string {
  if (/row-level security|listing_is_pending/i.test(message)) {
    return "No se pudieron guardar las fotos. Falta correr el SQL de publicación en Supabase.";
  }
  return message;
}

export async function submitListing(
  draft: ListingDraft,
  blobs: Map<string, Blob>,
): Promise<{ listingId: string; mailSent: boolean; mailError?: string }> {
  const db = client();
  if (!draft.planId) throw new Error("Elegí un plan de publicación.");

  // El id lo genera el navegador. No pedimos la fila de vuelta: un visitante
  // no puede leer avisos pendientes, y ese select cortaba la publicación.
  const listingId = crypto.randomUUID();
  const { error } = await db.from("listings").insert({
    id: listingId,
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
  });

  if (error) throw new Error(error.message);

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
    if (rowError) throw new Error(mapSubmitError(rowError.message));
    position += 1;
  }

  const mail = await notifyListing(listingId, "submitted");
  return { listingId, ...mail };
}

export type ListingReviewPatch = {
  title?: string;
  version?: string | null;
  marca_id?: string;
  modelo_id?: string;
  year?: number;
  km?: number;
  price?: number | null;
  price_on_request?: boolean;
  currency?: "ARS" | "USD";
  fuel?: string;
  transmission?: string;
  location?: string;
  province?: string;
  description?: string;
  plan?: PlanId;
  seller_name?: string;
  seller_email?: string;
  seller_phone?: string;
  seller_type?: ListingRow["seller_type"];
};

export const MAX_LISTING_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Sube una foto suelta al bucket antes de que exista el aviso: el admin
 * arma las fotos y recién al publicar se crea la fila en `listings`. El
 * storage_path no necesita coincidir con el id del aviso, así que un
 * folder temporal (`draftId`) alcanza para agrupar las subidas de una carga.
 */
export async function uploadListingImage(draftId: string, file: File): Promise<string> {
  if (file.size > MAX_LISTING_IMAGE_BYTES) {
    throw new Error("La imagen supera los 8 MB.");
  }

  const db = client();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${draftId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await db.storage
    .from(LISTING_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return path;
}

export async function deleteListingImageObject(storagePath: string): Promise<void> {
  const { error } = await client().storage.from(LISTING_IMAGE_BUCKET).remove([storagePath]);
  if (error) throw new Error(error.message);
}

export interface NewListingInput {
  title: string;
  version: string | null;
  marca_id: string;
  modelo_id: string;
  year: number;
  km: number;
  price: number | null;
  price_on_request: boolean;
  currency: "ARS" | "USD";
  fuel: string;
  transmission: string;
  location: string;
  province: string;
  description: string;
  plan: PlanId;
  seller_name: string;
  seller_email: string;
  seller_phone: string;
  seller_type: ListingRow["seller_type"];
  admin_notes: string | null;
}

/** El admin carga un aviso ya aprobado, sin pasar por la cola de solicitudes. */
export async function createListing(
  input: NewListingInput,
  reviewerId: string,
  imagePaths: string[],
): Promise<string> {
  const db = client();
  const now = new Date().toISOString();

  const { data, error } = await db
    .from("listings")
    .insert({
      ...input,
      status: "aprobada",
      reviewed_by: reviewerId,
      reviewed_at: now,
      published_at: now,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  const listingId = data.id as string;

  for (const [position, storagePath] of imagePaths.entries()) {
    const { error: imageError } = await db.from("listing_images").insert({
      listing_id: listingId,
      storage_path: storagePath,
      position,
    });
    if (imageError) throw new Error(imageError.message);
  }

  return listingId;
}

export async function reviewListing(input: {
  id: string;
  status: ListingStatus;
  adminNotes: string;
  reviewerId: string;
  patch?: ListingReviewPatch;
  /**
   * true solo cuando el aviso pasa a "aprobada" desde otro estado: ahí sí
   * pisamos published_at con la fecha actual. Guardar cambios sin cambiar
   * de estado no debe reflotar el aviso al tope de clasificados.
   */
  bumpPublishedAt?: boolean;
}): Promise<void> {
  const update: Record<string, unknown> = {
    ...(input.patch ?? {}),
    status: input.status,
    admin_notes: input.adminNotes.trim() || null,
    reviewed_by: input.reviewerId,
    reviewed_at: new Date().toISOString(),
  };

  if (input.status === "aprobada") {
    if (input.bumpPublishedAt) update.published_at = new Date().toISOString();
  } else {
    update.published_at = null;
  }

  const { error } = await client().from("listings").update(update).eq("id", input.id);

  if (error) throw new Error(error.message);
}

/** Marca o saca un aviso de "Vehículo de la semana". Puede haber varios: en el inicio rotan. */
export async function setWeeklyPick(listingId: string, active: boolean): Promise<void> {
  const { error } = await client()
    .from("listings")
    .update({ is_weekly_pick: active })
    .eq("id", listingId);
  if (error) throw new Error(mapHomePicksError(error.message));
}

/** "Los más vistos": hasta 3 avisos, `order` es la posición (1, 2 o 3). */
export async function setHomePick(listingId: string, order: number | null): Promise<void> {
  const { error } = await client()
    .from("listings")
    .update({ home_pick_order: order })
    .eq("id", listingId);
  if (error) throw new Error(mapHomePicksError(error.message));
}

export async function setListingSold(listingId: string, sold: boolean): Promise<void> {
  const { error } = await client().from("listings").update({ sold }).eq("id", listingId);
  if (error) {
    if (/sold|schema cache/i.test(error.message)) {
      throw new Error("Falta correr el SQL de vendidos en Supabase.");
    }
    throw new Error(error.message);
  }
}

function mapHomePicksError(message: string): string {
  if (message.includes("is_weekly_pick") || message.includes("home_pick_order")) {
    return "Falta correr la migración 20260929000000_home_picks.sql en Supabase.";
  }
  return message;
}

export type { PlanId };
