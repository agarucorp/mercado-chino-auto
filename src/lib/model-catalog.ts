import { MARCAS } from "@/data/marcas";
import { getFichaTecnica, getModeloImages, type FichaTecnicaRow } from "@/data/modelo-media";
import { resolveModeloId, slugify } from "@/lib/marcas";
import type { EstadoModelo, Marca, Modelo } from "@/types/marcas";

export interface ModelProfile {
  modeloId: string;
  marcaId: string;
  nombre: string;
  estado: EstadoModelo;
  summary: string;
  /** null: sigue la ficha del código. Array: lo que guardó el admin, aunque esté vacío. */
  ficha: FichaTecnicaRow[] | null;
  /** null: siguen las fotos del código. Array: las que dejó el admin. */
  images: string[] | null;
  removed: boolean;
  custom: boolean;
}

export interface CatalogSnapshot {
  marcas: Marca[];
  profiles: ModelProfile[];
  ready: boolean;
  error: string | null;
}

export interface AdminModeloEntry {
  marca: Marca;
  modelo: Modelo;
  removed: boolean;
  custom: boolean;
  edited: boolean;
}

export const FICHA_LABELS = [
  "Modelo",
  "Precio",
  "Vigencia",
  "Tipo de motor",
  "Transmisión",
  "Potencia",
  "Consumo",
  "Seguridad",
  "Autonomía",
] as const;

const listeners = new Set<() => void>();

let profiles: ModelProfile[] = [];
let ready = false;
let error: string | null = null;
let snapshot: CatalogSnapshot = {
  marcas: MARCAS,
  profiles,
  ready,
  error,
};

function publish() {
  snapshot = {
    marcas: profiles.length === 0 ? MARCAS : mergeCatalog(MARCAS, profiles),
    profiles,
    ready,
    error,
  };
  listeners.forEach((listener) => listener());
}

export function getCatalogSnapshot(): CatalogSnapshot {
  return snapshot;
}

export function subscribeModelCatalog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setModelProfiles(next: ModelProfile[]) {
  profiles = next;
  publish();
}

export function setCatalogReady(nextReady: boolean, nextError: string | null = null) {
  ready = nextReady;
  error = nextError;
  publish();
}

export function getLiveMarcas(): Marca[] {
  return snapshot.marcas;
}

export function mergeCatalog(base: Marca[], rows: ModelProfile[]): Marca[] {
  const staticIds = new Set<string>();
  const marcas = base.map((marca) => ({
    ...marca,
    modelos: marca.modelos.flatMap((modelo) => {
      staticIds.add(modelo.id);
      const profile = rows.find((row) => row.modeloId === modelo.id);
      if (!profile) return [modelo];
      if (profile.removed) return [];
      return [applyProfile(modelo, profile)];
    }),
  }));

  for (const profile of rows) {
    if (profile.removed || staticIds.has(profile.modeloId)) continue;
    const marca = marcas.find((item) => item.id === profile.marcaId);
    if (!marca || !profile.nombre.trim()) continue;
    marca.modelos = [
      ...marca.modelos,
      {
        id: profile.modeloId,
        nombre: profile.nombre.trim(),
        estado: profile.estado,
        marcaId: profile.marcaId,
      },
    ];
  }

  return marcas;
}

function applyProfile(modelo: Modelo, profile: ModelProfile): Modelo {
  return {
    ...modelo,
    nombre: profile.nombre.trim() || modelo.nombre,
    estado: profile.estado,
  };
}

function activeProfile(modeloId: string): ModelProfile | undefined {
  const id = resolveModeloId(modeloId);
  const profile = snapshot.profiles.find((row) => row.modeloId === id || row.modeloId === modeloId);
  if (!profile || profile.removed) return undefined;
  return profile;
}

export function resolveFicha(modeloId: string): FichaTecnicaRow[] {
  const profile = activeProfile(modeloId);
  if (profile?.ficha) return profile.ficha;
  return getFichaTecnica(modeloId);
}

export function resolveImages(modeloId: string): string[] {
  const profile = activeProfile(modeloId);
  if (profile?.images && profile.images.length > 0) return profile.images;
  return getModeloImages(modeloId);
}

export function resolveSummary(modeloId: string): string {
  return activeProfile(modeloId)?.summary.trim() ?? "";
}

export function nextModeloId(marcaId: string, nombre: string, taken: Set<string>): string {
  const slug = slugify(nombre);
  const base = slug ? `${marcaId}-${slug}` : `${marcaId}-modelo`;
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function takenModeloIds(): Set<string> {
  const ids = new Set<string>();
  for (const marca of MARCAS) {
    for (const modelo of marca.modelos) ids.add(modelo.id);
  }
  for (const profile of snapshot.profiles) ids.add(profile.modeloId);
  return ids;
}

export function listAdminEntries(): AdminModeloEntry[] {
  const byId = new Map(snapshot.profiles.map((profile) => [profile.modeloId, profile]));
  const entries: AdminModeloEntry[] = [];

  for (const marca of MARCAS) {
    for (const modelo of marca.modelos) {
      const profile = byId.get(modelo.id);
      entries.push({
        marca,
        modelo: profile ? applyProfile(modelo, profile) : modelo,
        removed: profile?.removed === true,
        custom: false,
        edited: Boolean(profile && !profile.removed),
      });
    }
  }

  for (const profile of snapshot.profiles) {
    if (MARCAS.some((marca) => marca.modelos.some((modelo) => modelo.id === profile.modeloId))) {
      continue;
    }
    const marca = MARCAS.find((item) => item.id === profile.marcaId);
    if (!marca) continue;
    entries.push({
      marca,
      modelo: {
        id: profile.modeloId,
        nombre: profile.nombre.trim() || profile.modeloId,
        estado: profile.estado,
        marcaId: profile.marcaId,
      },
      removed: profile.removed,
      custom: true,
      edited: !profile.removed,
    });
  }

  return entries;
}

export function findAdminModelo(
  marcaId: string,
  modeloId: string,
): { marca: Marca; modelo: Modelo; profile?: ModelProfile } | null {
  const id = resolveModeloId(modeloId);
  const entry = listAdminEntries().find(
    (item) => item.marca.id === marcaId && (item.modelo.id === id || item.modelo.id === modeloId),
  );
  if (!entry) return null;
  const profile = snapshot.profiles.find((row) => row.modeloId === entry.modelo.id);
  return { marca: entry.marca, modelo: entry.modelo, profile };
}

export function blankFicha(nombre = ""): FichaTecnicaRow[] {
  return FICHA_LABELS.map((label) => ({
    label,
    value: label === "Modelo" ? nombre : "",
  }));
}

export function sanitizeFicha(value: unknown): FichaTecnicaRow[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  const rows: FichaTecnicaRow[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as { label?: unknown; value?: unknown };
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const rowValue = typeof record.value === "string" ? record.value.trim() : "";
    if (!label && !rowValue) continue;
    rows.push({ label, value: rowValue });
  }
  return rows;
}

export function sanitizeImages(value: unknown): string[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}
