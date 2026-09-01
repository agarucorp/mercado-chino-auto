import {
  DNRPA_ACTUALIZADO_AL,
  DNRPA_PATENTAMIENTOS,
  DNRPA_TOTAL_CHINOS,
  DNRPA_TOTAL_INSCRIPCIONES,
  DNRPA_YEARS,
  type DnrpaPatentamiento,
} from "@/data/dnrpa-patentamientos";

export type DnrpaYearFilter = (typeof DNRPA_YEARS)[number] | "todos";

export interface DnrpaRankingRow {
  marcaId: string;
  modeloId: string;
  marcaNombre: string;
  modeloNombre: string;
  cantidad: number;
  share: number;
}

export interface DnrpaRankingResult {
  rows: DnrpaRankingRow[];
  totalCatalogo: number;
  totalChinos: number;
  totalInscripciones: number;
}

export function sumByYear(
  byYear: Record<number, number>,
  year: DnrpaYearFilter,
): number {
  if (year === "todos") {
    return Object.values(byYear).reduce((n, v) => n + v, 0);
  }
  return byYear[year] ?? 0;
}

export function rankPatentamientos(
  options: { year: DnrpaYearFilter; marcaId?: string },
  rows: DnrpaPatentamiento[] = DNRPA_PATENTAMIENTOS,
  totals: {
    inscripciones: Record<number, number>;
    chinos: Record<number, number>;
  } = { inscripciones: DNRPA_TOTAL_INSCRIPCIONES, chinos: DNRPA_TOTAL_CHINOS },
): DnrpaRankingResult {
  const marcaId = options.marcaId && options.marcaId !== "todas" ? options.marcaId : undefined;
  const filtered = rows.filter((row) => {
    if (options.year !== "todos" && row.year !== options.year) return false;
    if (marcaId && row.marcaId !== marcaId) return false;
    return true;
  });

  const byModelo = new Map<string, DnrpaRankingRow>();
  for (const row of filtered) {
    const prev = byModelo.get(row.modeloId);
    if (prev) prev.cantidad += row.cantidad;
    else {
      byModelo.set(row.modeloId, {
        marcaId: row.marcaId,
        modeloId: row.modeloId,
        marcaNombre: row.marcaNombre,
        modeloNombre: row.modeloNombre,
        cantidad: row.cantidad,
        share: 0,
      });
    }
  }

  const ranked = [...byModelo.values()].sort((a, b) => b.cantidad - a.cantidad);
  const totalCatalogo = ranked.reduce((n, row) => n + row.cantidad, 0);
  for (const row of ranked) {
    row.share = totalCatalogo > 0 ? row.cantidad / totalCatalogo : 0;
  }

  return {
    rows: ranked,
    totalCatalogo,
    totalChinos: sumByYear(totals.chinos, options.year),
    totalInscripciones: sumByYear(totals.inscripciones, options.year),
  };
}

export function marcasConPatentamientos(
  year: DnrpaYearFilter,
  rows: DnrpaPatentamiento[] = DNRPA_PATENTAMIENTOS,
): { id: string; nombre: string }[] {
  const map = new Map<string, string>();
  for (const row of rows) {
    if (year !== "todos" && row.year !== year) continue;
    if (!map.has(row.marcaId)) map.set(row.marcaId, row.marcaNombre);
  }
  return [...map.entries()]
    .map(([id, nombre]) => ({ id, nombre }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function labelPeriodoDnrpa(year: DnrpaYearFilter): string {
  if (year === "todos") return "2024–2026";
  if (year === 2026) return "2026 (ene–jul)";
  return String(year);
}

export function formatFechaCorteDnrpa(isoMonth = DNRPA_ACTUALIZADO_AL): string {
  const [y, m] = isoMonth.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, 1);
  return date.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
}

export function formatEnteroAr(n: number): string {
  return new Intl.NumberFormat("es-AR").format(n);
}

export function formatPctAr(n: number, digits = 1): string {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}
