import { MARCAS } from "@/data/marcas";
import { getModeloImage } from "@/data/modelo-media";
import { getModeloPath } from "@/lib/marcas";
import type { Marca, Modelo } from "@/types/marcas";

export type SearchResultType = "marca" | "modelo";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  marcaId: string;
  estado?: Modelo["estado"];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(text: string, query: string): boolean {
  return normalize(text).includes(normalize(query));
}

export function searchCatalog(
  query: string,
  options: { maxMarcas?: number; maxModelos?: number } = {},
): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const maxMarcas = options.maxMarcas ?? 4;
  const maxModelos = options.maxModelos ?? 6;
  const marcas: SearchResult[] = [];
  const modelos: SearchResult[] = [];

  for (const marca of MARCAS) {
    if (matchesQuery(marca.nombre, q)) {
      marcas.push({
        type: "marca",
        id: marca.id,
        title: marca.nombre,
        subtitle: `${marca.modelos.length} modelos · ${marca.representante}`,
        href: `/marcas/${marca.slug}`,
        marcaId: marca.id,
      });
    }

    for (const modelo of marca.modelos) {
      const combined = `${marca.nombre} ${modelo.nombre}`;
      if (matchesQuery(modelo.nombre, q) || matchesQuery(combined, q)) {
        modelos.push({
          type: "modelo",
          id: modelo.id,
          title: modelo.nombre,
          subtitle: marca.nombre,
          href: getModeloPath(marca, modelo),
          image: getModeloImage(modelo.id),
          marcaId: marca.id,
          estado: modelo.estado,
        });
      }
    }
  }

  const sortByTitle = (a: SearchResult, b: SearchResult) =>
    a.title.localeCompare(b.title, "es");

  return [
    ...marcas.sort(sortByTitle).slice(0, maxMarcas),
    ...modelos.sort(sortByTitle).slice(0, maxModelos),
  ];
}

export function getMarcaForResult(result: SearchResult): Marca | undefined {
  return MARCAS.find((m) => m.id === result.marcaId);
}
