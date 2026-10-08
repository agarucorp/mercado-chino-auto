import { supabase } from "@/lib/supabase";
import type { ProviderCategory, ServiceProviderRow } from "@/types/database";

export const PROVIDER_CATEGORIES: { id: ProviderCategory; label: string }[] = [
  { id: "estetico", label: "Cuidado estético" },
  { id: "mecanico", label: "Mecánico" },
  { id: "lubricentro", label: "Lubricentros" },
];

export type ProviderInput = {
  category: ProviderCategory;
  name: string;
  city: string;
  phone: string;
  description: string;
  published: boolean;
};

function client() {
  if (!supabase) throw new Error("Falta configurar Supabase.");
  return supabase;
}

function mapMissing(message: string): string {
  if (/service_providers|schema cache/i.test(message)) {
    return "Falta correr el SQL de repuestos y talleres en Supabase.";
  }
  return message;
}

export async function listProviders(publishedOnly: boolean): Promise<ServiceProviderRow[]> {
  const query = client()
    .from("service_providers")
    .select("*")
    .order("name", { ascending: true });
  const { data, error } = publishedOnly ? await query.eq("published", true) : await query;
  if (error) throw new Error(mapMissing(error.message));
  return data ?? [];
}

export async function createProvider(input: ProviderInput): Promise<void> {
  const { error } = await client().from("service_providers").insert(input);
  if (error) throw new Error(mapMissing(error.message));
}

export async function updateProvider(id: string, input: ProviderInput): Promise<void> {
  const { error } = await client()
    .from("service_providers")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(mapMissing(error.message));
}

export async function deleteProvider(id: string): Promise<void> {
  const { error } = await client().from("service_providers").delete().eq("id", id);
  if (error) throw new Error(mapMissing(error.message));
}
