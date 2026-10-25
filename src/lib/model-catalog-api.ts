import type { FichaTecnicaRow } from "@/data/modelo-media";
import {
  sanitizeFicha,
  sanitizeImages,
  setCatalogReady,
  setModelProfiles,
  type ModelProfile,
} from "@/lib/model-catalog";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { EstadoModelo } from "@/types/marcas";

export const MODEL_IMAGE_BUCKET = "model-images";
export const MAX_MODEL_IMAGE_BYTES = 8 * 1024 * 1024;

export interface ModelProfileInput {
  modeloId: string;
  marcaId: string;
  nombre: string;
  estado: EstadoModelo;
  summary: string;
  ficha: FichaTecnicaRow[];
  images: string[];
  custom: boolean;
}

type ProfileRow = {
  modelo_id: string;
  marca_id: string;
  nombre: string;
  estado: string;
  summary: string;
  ficha: unknown;
  images: unknown;
  removed: boolean;
  custom: boolean;
};

function client() {
  if (!supabase) throw new Error("Supabase no está configurado.");
  return supabase;
}

export function mapModelError(message: string): string {
  if (/model_profiles|model-images|schema cache|bucket not found|does not exist/i.test(message)) {
    return "Falta correr el SQL de modelos en Supabase.";
  }
  return message;
}

function rowToProfile(row: ProfileRow): ModelProfile {
  const estado: EstadoModelo = row.estado === "Discontinuado" ? "Discontinuado" : "Vigente";
  return {
    modeloId: row.modelo_id,
    marcaId: row.marca_id,
    nombre: row.nombre,
    estado,
    summary: row.summary ?? "",
    ficha: sanitizeFicha(row.ficha),
    images: sanitizeImages(row.images),
    removed: row.removed === true,
    custom: row.custom === true,
  };
}

export async function loadModelCatalog(): Promise<void> {
  if (!isSupabaseConfigured) {
    setCatalogReady(true, null);
    return;
  }

  try {
    const { data, error } = await client()
      .from("model_profiles")
      .select("modelo_id, marca_id, nombre, estado, summary, ficha, images, removed, custom")
      .order("nombre", { ascending: true });

    if (error) throw new Error(error.message);
    setModelProfiles((data ?? []).map((row) => rowToProfile(row as ProfileRow)));
    setCatalogReady(true, null);
  } catch (err) {
    const message = err instanceof Error ? err.message : "No se pudo leer el catálogo.";
    setModelProfiles([]);
    setCatalogReady(true, mapModelError(message));
  }
}

export async function saveModelProfile(input: ModelProfileInput): Promise<void> {
  const nombre = input.nombre.trim();
  if (!nombre) throw new Error("El nombre es obligatorio.");

  const { error } = await client()
    .from("model_profiles")
    .upsert({
      modelo_id: input.modeloId,
      marca_id: input.marcaId,
      nombre,
      estado: input.estado,
      summary: input.summary.trim(),
      ficha: input.ficha,
      images: input.images,
      removed: false,
      custom: input.custom,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error(mapModelError(error.message));
  await loadModelCatalog();
}

export async function hideModel(input: {
  modeloId: string;
  marcaId: string;
  nombre: string;
  estado: EstadoModelo;
  custom: boolean;
}): Promise<void> {
  if (input.custom) {
    const { error } = await client().from("model_profiles").delete().eq("modelo_id", input.modeloId);
    if (error) throw new Error(mapModelError(error.message));
    await loadModelCatalog();
    return;
  }

  const { error } = await client().from("model_profiles").upsert({
    modelo_id: input.modeloId,
    marca_id: input.marcaId,
    nombre: input.nombre.trim() || input.modeloId,
    estado: input.estado,
    removed: true,
    custom: false,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(mapModelError(error.message));
  await loadModelCatalog();
}

export async function restoreModel(modeloId: string): Promise<void> {
  const { error } = await client()
    .from("model_profiles")
    .update({ removed: false, updated_at: new Date().toISOString() })
    .eq("modelo_id", modeloId);

  if (error) throw new Error(mapModelError(error.message));
  await loadModelCatalog();
}

export async function resetModelProfile(modeloId: string): Promise<void> {
  const { error } = await client().from("model_profiles").delete().eq("modelo_id", modeloId);
  if (error) throw new Error(mapModelError(error.message));
  await loadModelCatalog();
}

export async function uploadModelImage(modeloId: string, file: File): Promise<string> {
  if (file.size > MAX_MODEL_IMAGE_BYTES) {
    throw new Error("La imagen supera los 8 MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${modeloId}/${crypto.randomUUID()}.${ext}`;
  const db = client();
  const { error } = await db.storage
    .from(MODEL_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });

  if (error) throw new Error(mapModelError(error.message));
  return db.storage.from(MODEL_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
