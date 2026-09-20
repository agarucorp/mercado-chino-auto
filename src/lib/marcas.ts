import type {
  FiltroAnioMarca,
  FiltroEstadoMarca,
  Marca,
  Modelo,
  Representante,
} from "@/types/marcas";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createModelo(
  marcaId: string,
  nombre: string,
  estado: Modelo["estado"],
): Modelo {
  return {
    id: `${marcaId}-${slugify(nombre)}`,
    nombre,
    estado,
    marcaId,
  };
}

export function countModelosVigentes(marca: Marca): number {
  return marca.modelos.filter((m) => m.estado === "Vigente").length;
}

export function countModelosDiscontinuados(marca: Marca): number {
  return marca.modelos.filter((m) => m.estado === "Discontinuado").length;
}

export function tieneModelosVigentes(marca: Marca): boolean {
  return countModelosVigentes(marca) > 0;
}

export function buildRepresentantes(marcas: Marca[]): Representante[] {
  const map = new Map<string, string[]>();

  for (const marca of marcas) {
    const existing = map.get(marca.representante) ?? [];
    map.set(marca.representante, [...existing, marca.id]);
  }

  return Array.from(map.entries())
    .map(([nombre, marcaIds]) => ({
      id: slugify(nombre),
      nombre,
      marcaIds,
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function getMarcaNombre(marcas: Marca[], id: string): string {
  return marcas.find((m) => m.id === id)?.nombre ?? id;
}

export function filterMarcas(
  marcas: Marca[],
  options: {
    representante?: string;
    filtroAnio?: FiltroAnioMarca;
    filtroEstado?: FiltroEstadoMarca;
    busqueda?: string;
  },
): Marca[] {
  const { representante, filtroAnio = "todas", filtroEstado = "todas", busqueda } =
    options;

  return marcas.filter((marca) => {
    if (representante && representante !== "todos" && marca.representante !== representante) {
      return false;
    }

    if (filtroAnio === "nuevas" && marca.anioLanzamiento < 2025) return false;
    if (
      filtroAnio === "2016-2020" &&
      (marca.anioLanzamiento < 2016 || marca.anioLanzamiento > 2020)
    ) {
      return false;
    }
    if (filtroAnio === "antes-2016" && marca.anioLanzamiento >= 2016) return false;

    if (filtroEstado === "con-vigentes" && !tieneModelosVigentes(marca)) return false;
    if (filtroEstado === "solo-historicas" && tieneModelosVigentes(marca)) return false;

    if (busqueda?.trim()) {
      const q = busqueda.trim().toLowerCase();
      const matchMarca = marca.nombre.toLowerCase().includes(q);
      const matchModelo = marca.modelos.some((m) =>
        m.nombre.toLowerCase().includes(q),
      );
      if (!matchMarca && !matchModelo) return false;
    }

    return true;
  });
}

export function getRepresentantesUnicos(marcas: Marca[]): string[] {
  return [...new Set(marcas.map((m) => m.representante))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export function getModeloSlug(modelo: Modelo): string {
  return modelo.id.replace(`${modelo.marcaId}-`, "");
}

const MODELO_SLUG_ALIASES: Record<string, string> = {
  "baic-x35": "baic-x35-ex35",
  "baic-ex35": "baic-x35-ex35",
  "baic-ex55-plus": "baic-x55-plus",
};

export function resolveModeloId(modeloId: string): string {
  return MODELO_SLUG_ALIASES[modeloId] ?? modeloId;
}

export function getModeloBySlug(marca: Marca, modeloSlug: string): Modelo | undefined {
  const requested = `${marca.id}-${modeloSlug}`;
  const canonical = resolveModeloId(requested);
  return marca.modelos.find(
    (m) =>
      m.id === canonical ||
      getModeloSlug(m) === modeloSlug ||
      m.id === requested,
  );
}

export function getModeloPath(marca: Marca, modelo: Modelo): string {
  return `/marcas/${marca.slug}/${getModeloSlug(modelo)}`;
}

const MARCA_SLUG_ALIASES: Record<string, string> = {
  lepamotors: "leapmotors",
};

export function getMarcaBySlug(marcas: Marca[], slug: string): Marca | undefined {
  const canonical = MARCA_SLUG_ALIASES[slug] ?? slug;
  return marcas.find((m) => m.slug === canonical || m.id === canonical);
}
