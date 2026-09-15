import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * El catálogo del sitio es estático, así que sin credenciales todo sigue
 * funcionando: lo único que se apaga es el login del admin. Por eso el cliente
 * puede ser null en vez de tirar al arrancar.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // El login es por email y contraseña: no hay callback OAuth que leer.
        detectSessionInUrl: false,
        storageKey: "auchar-auth",
      },
    })
  : null;

/** Mensaje único para cuando falta configuración, así no se repite el texto. */
export const SUPABASE_MISSING_MESSAGE =
  "Falta configurar las credenciales de Supabase (.env). El login está deshabilitado.";
