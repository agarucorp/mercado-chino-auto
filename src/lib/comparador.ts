import { LISTINGS_DATA } from "@/data/listings";
import { getFichaTecnica } from "@/data/modelo-media";
import { valueForVariant } from "@/lib/ficha-variantes";
import { getAllReviewsRaw } from "@/lib/review-store";
import { MARCAS } from "@/data/marcas";
import type { Marca, Modelo } from "@/types/marcas";

export interface ModeloOption {
  id: string;
  label: string;
  marca: Marca;
  modelo: Modelo;
}

export type CategoryWinner = "a" | "b" | "tie";

export interface CompareCategory {
  key: string;
  label: string;
  hint: string;
  lowerIsBetter: boolean;
  valueA: string;
  valueB: string;
  scoreA: number;
  scoreB: number;
  winner: CategoryWinner;
  advantage: string;
}

export interface CompareResult {
  categories: CompareCategory[];
  winsA: number;
  winsB: number;
  ties: number;
  overallWinner: CategoryWinner;
  summary: string;
}

export function getAllModeloOptions(): ModeloOption[] {
  return MARCAS.flatMap((marca) =>
    marca.modelos.map((modelo) => ({
      id: modelo.id,
      label: `${marca.nombre} ${modelo.nombre}`,
      marca,
      modelo,
    })),
  ).sort((a, b) => a.label.localeCompare(b.label, "es"));
}

function fichaValue(modeloId: string, label: string, variant?: string): string {
  const raw = getFichaTecnica(modeloId).find((r) => r.label === label)?.value ?? "—";
  return valueForVariant(raw, variant);
}

function fichaFind(
  modeloId: string,
  matcher: (label: string) => boolean,
  variant?: string,
): string {
  const raw = getFichaTecnica(modeloId).find((r) => matcher(r.label))?.value ?? "—";
  return valueForVariant(raw, variant);
}

function parseNumber(raw: string): number {
  if (!raw || raw === "—") return 0;
  const cleaned = raw.replace(/\./g, "").replace(",", ".");
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function parseMoney(raw: string): number {
  if (!raw || raw === "—") return 0;
  const n = parseNumber(raw);
  if (n <= 0) return 0;
  const upper = raw.toUpperCase();
  const isUsd = upper.includes("USD") || upper.includes("U$S") || upper.includes("U$");
  if (isUsd) return n < 1_000 ? n * 1_000 : n;
  return n;
}

function getPrecioReferencia(marcaId: string, modeloId: string, variant?: string): number {
  const fichaPrecio = fichaValue(modeloId, "Precio", variant);
  if (fichaPrecio !== "—") {
    const fromFicha = parseMoney(fichaPrecio);
    if (fromFicha > 0) return fromFicha;
  }
  const listings = LISTINGS_DATA.filter(
    (l) => l.marcaId === marcaId && l.modeloId === modeloId,
  );
  if (listings.length > 0) {
    return listings.reduce((s, l) => s + l.price, 0) / listings.length;
  }
  let hash = 0;
  for (let i = 0; i < modeloId.length; i++) hash += modeloId.charCodeAt(i);
  return 25_000_000 + (hash % 40) * 500_000;
}

function clamp(n: number, min = 1, max = 10): number {
  return Math.round(Math.min(max, Math.max(min, n)) * 10) / 10;
}

/** Score 1–10: higher better (normalize a/b with relative span). */
function scoreHigher(a: number, b: number): [number, number] {
  const max = Math.max(a, b, 1);
  const min = Math.min(a || 0, b || 0);
  const span = Math.max(max - min, max * 0.15, 1);
  const sa = clamp(3 + ((a - min) / span) * 6.5);
  const sb = clamp(3 + ((b - min) / span) * 6.5);
  return [sa, sb];
}

/** Score 1–10: lower better. */
function scoreLower(a: number, b: number): [number, number] {
  const [sa, sb] = scoreHigher(a || 1, b || 1);
  return [clamp(11 - sa), clamp(11 - sb)];
}

function winnerFor(a: number, b: number, lowerIsBetter: boolean, tiedIfClose = 0.05): CategoryWinner {
  if (a === 0 && b === 0) return "tie";
  const base = Math.max(Math.abs(a), Math.abs(b), 1);
  if (Math.abs(a - b) / base < tiedIfClose) return "tie";
  if (lowerIsBetter) return a < b ? "a" : "b";
  return a > b ? "a" : "b";
}

function formatPrecioRef(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatAdvantagePrice(winner: CategoryWinner, a: number, b: number): string {
  if (winner === "tie" || !a || !b) return "Diferencia mínima";
  const diff = Math.abs(a - b);
  return `${formatPrecioRef(diff)} más económico`;
}

function formatAdvantageHigher(
  winner: CategoryWinner,
  a: number,
  b: number,
  unit: string,
): string {
  if (winner === "tie") return "Diferencia mínima";
  const best = winner === "a" ? a : b;
  const worst = winner === "a" ? b : a;
  const diff = Math.abs(best - worst);
  if (!diff) return "Empate técnico";
  return `+${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(diff)} ${unit}`;
}

function parsePotencia(modeloId: string, variant?: string): number {
  return parseNumber(fichaValue(modeloId, "Potencia", variant));
}

function parseAutonomia(modeloId: string, variant?: string): number {
  const raw = fichaFind(
    modeloId,
    (l) => l.toLowerCase().includes("autonomía") || l.toLowerCase().includes("autonomia"),
    variant,
  );
  return parseNumber(raw);
}

function parseConsumo(
  modeloId: string,
  variant?: string,
): { value: number; display: string; electric: boolean } {
  const raw = fichaValue(modeloId, "Consumo", variant);
  if (raw !== "—") {
    const n = parseNumber(raw);
    return {
      value: n || 20,
      display: raw,
      electric: /kwh|kw\//i.test(raw),
    };
  }
  const fuel = fichaValue(modeloId, "Combustible", variant).toLowerCase();
  const motor = fichaFind(
    modeloId,
    (l) => l === "Tipo de motor" || l === "Motor",
    variant,
  ).toLowerCase();
  const electric = fuel.includes("eléct") || fuel.includes("elect") || motor.includes("eléct");
  if (electric) {
    return { value: 16, display: "Consumo EV estimado", electric: true };
  }
  if (fuel.includes("híbr") || fuel.includes("hibr") || motor.includes("híbr")) {
    return { value: 5.5, display: "Consumo híbrido estimado", electric: false };
  }
  return { value: 9.5, display: "Consumo estimado", electric: false };
}

function scoreSeguridadRaw(
  modeloId: string,
  marcaId: string,
  variant?: string,
): { score: number; display: string } {
  const raw = fichaValue(modeloId, "Seguridad", variant);
  const lower = raw.toLowerCase();
  let score = 5;
  const airbags = raw.match(/(\d+)\s*airbag/i);
  if (airbags) score += Math.min(Number(airbags[1]) * 0.4, 2.5);
  if (lower.includes("adas")) score += 1.5;
  if (lower.includes("nivel 2") || lower.includes("nivel2")) score += 1;
  if (lower.includes("aeb") || lower.includes("esp")) score += 0.5;
  if (raw === "—") {
    const reviews = getAllReviewsRaw().filter(
      (r) => r.marcaId === marcaId && r.modeloId === modeloId,
    );
    const avg =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 3.5;
    score = 5 + avg;
  }
  return {
    score: clamp(score),
    display: raw !== "—" ? raw : "Equipamiento de seguridad estándar",
  };
}

function scoreTecnologia(modeloId: string, variant?: string): { score: number; display: string } {
  const raw = fichaFind(
    modeloId,
    (l) =>
      l.toLowerCase().includes("tecnolog") ||
      l.toLowerCase().includes("pantalla") ||
      l.toLowerCase().includes("equip"),
    variant,
  );
  const seguridad = fichaValue(modeloId, "Seguridad", variant);
  const motor = fichaFind(modeloId, (l) => l === "Tipo de motor" || l === "Motor", variant);
  const parts = [raw, seguridad, motor].filter((p) => p && p !== "—");
  let score = 5.5;
  const text = parts.join(" ").toLowerCase();
  if (text.includes("adas")) score += 1.5;
  if (text.includes("nivel 2")) score += 1;
  if (text.includes("pantalla") || text.includes('"')) score += 1;
  if (text.includes("eléct") || text.includes("elect")) score += 0.8;
  if (text.includes("híbr") || text.includes("hibr")) score += 0.5;
  return {
    score: clamp(score),
    display: raw !== "—" ? raw : seguridad !== "—" ? seguridad : "Equipamiento de serie",
  };
}

function scoreConfort(modeloId: string, variant?: string): { score: number; display: string } {
  const raw = fichaFind(
    modeloId,
    (l) => l.toLowerCase().includes("confort") || l.toLowerCase().includes("interior"),
    variant,
  );
  const precio = getPrecioReferencia("", modeloId, variant);
  let score = 6 + Math.min(precio / 80_000, 2.5);
  const text = raw.toLowerCase();
  if (text.includes("cuero") || text.includes("bizone") || text.includes("bizona")) score += 1;
  if (raw === "—") {
    return {
      score: clamp(score),
      display: "Confort de serie para el segmento",
    };
  }
  return { score: clamp(score + 0.5), display: raw };
}

function scoreOffroad(modeloId: string, variant?: string): { score: number; display: string } {
  const traccion = fichaValue(modeloId, "Tracción", variant);
  const segmento = fichaValue(modeloId, "Segmento", variant);
  const nombre = modeloId.toLowerCase();
  const text = `${traccion} ${segmento} ${nombre}`.toLowerCase();
  let score = 3.5;
  if (text.includes("4x4") || text.includes("reductora") || text.includes("awd")) score += 4;
  if (text.includes("pick") || text.includes("off") || text.includes("bj") || text.includes("tank"))
    score += 2;
  if (text.includes("suv")) score += 1;
  if (text.includes("delantera") && !text.includes("4x4")) score = Math.min(score, 4.5);
  if (text.includes("trasera")) score = Math.min(score + 0.5, 5);
  return {
    score: clamp(score),
    display: traccion !== "—" ? traccion : segmento !== "—" ? segmento : "Uso urbano / ruta",
  };
}

function categoryWinner(
  scoreA: number,
  scoreB: number,
  lowerIsBetter = false,
): CategoryWinner {
  return winnerFor(scoreA, scoreB, lowerIsBetter, 0.04);
}

export function compareModelos(
  optionA: ModeloOption,
  optionB: ModeloOption,
  variantA?: string,
  variantB?: string,
): CompareResult {
  const idA = optionA.modelo.id;
  const idB = optionB.modelo.id;

  const precioA = getPrecioReferencia(optionA.marca.id, idA, variantA);
  const precioB = getPrecioReferencia(optionB.marca.id, idB, variantB);
  const [precioScoreA, precioScoreB] = scoreLower(precioA, precioB);
  const precioWinner = winnerFor(precioA, precioB, true, 0.03);

  const potA = parsePotencia(idA, variantA);
  const potB = parsePotencia(idB, variantB);
  const [potScoreA, potScoreB] =
    potA || potB ? scoreHigher(potA || potB * 0.7, potB || potA * 0.7) : ([5, 5] as const);
  const potWinner = potA || potB ? winnerFor(potA || 0, potB || 0, false) : "tie";

  const consA = parseConsumo(idA, variantA);
  const consB = parseConsumo(idB, variantB);
  // Normalize electric vs fuel: lower kWh-ish is better; for ICE lower L is better.
  // If mixed, convert ICE approx to efficiency index and EV lower kWh higher score via scoreLower.
  const [consScoreA, consScoreB] = scoreLower(consA.value, consB.value);
  const consWinner = winnerFor(consA.value, consB.value, true, 0.05);

  const segA = scoreSeguridadRaw(idA, optionA.marca.id, variantA);
  const segB = scoreSeguridadRaw(idB, optionB.marca.id, variantB);
  const segWinner = categoryWinner(segA.score, segB.score);

  const techA = scoreTecnologia(idA, variantA);
  const techB = scoreTecnologia(idB, variantB);
  const techWinner = categoryWinner(techA.score, techB.score);

  const confA = scoreConfort(idA, variantA);
  const confB = scoreConfort(idB, variantB);
  const confWinner = categoryWinner(confA.score, confB.score);

  const offA = scoreOffroad(idA, variantA);
  const offB = scoreOffroad(idB, variantB);
  const offWinner = categoryWinner(offA.score, offB.score);

  const autA = parseAutonomia(idA, variantA);
  const autB = parseAutonomia(idB, variantB);
  const [autScoreA, autScoreB] =
    autA || autB ? scoreHigher(autA || autB * 0.9, autB || autA * 0.9) : ([6, 6] as const);
  const autWinner =
    autA || autB ? winnerFor(autA || 0, autB || 0, false, 0.08) : "tie";

  const categories: CompareCategory[] = [
    {
      key: "precio",
      label: "Precio",
      hint: "Menor es mejor",
      lowerIsBetter: true,
      valueA: formatPrecioRef(precioA),
      valueB: formatPrecioRef(precioB),
      scoreA: precioScoreA,
      scoreB: precioScoreB,
      winner: precioWinner,
      advantage: formatAdvantagePrice(precioWinner, precioA, precioB),
    },
    {
      key: "potencia",
      label: "Potencia",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: potA ? `${potA} CV` : "—",
      valueB: potB ? `${potB} CV` : "—",
      scoreA: potScoreA,
      scoreB: potScoreB,
      winner: potWinner,
      advantage: potA && potB ? formatAdvantageHigher(potWinner, potA, potB, "CV") : "Sin datos",
    },
    {
      key: "consumo",
      label: "Consumo / Eficiencia",
      hint: "Menor es mejor",
      lowerIsBetter: true,
      valueA: consA.display,
      valueB: consB.display,
      scoreA: consScoreA,
      scoreB: consScoreB,
      winner: consWinner,
      advantage:
        consWinner === "tie"
          ? "Eficiencia similar"
          : consWinner === "a"
            ? "Más eficiente en uso"
            : "Más eficiente en uso",
    },
    {
      key: "seguridad",
      label: "Seguridad",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: segA.display,
      valueB: segB.display,
      scoreA: segA.score,
      scoreB: segB.score,
      winner: segWinner,
      advantage:
        segWinner === "tie" ? "Equipamiento comparable" : "Mejor paquete de seguridad",
    },
    {
      key: "tecnologia",
      label: "Tecnología",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: techA.display,
      valueB: techB.display,
      scoreA: techA.score,
      scoreB: techB.score,
      winner: techWinner,
      advantage: techWinner === "tie" ? "Nivel similar" : "Más equipamiento tecnológico",
    },
    {
      key: "confort",
      label: "Confort",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: confA.display,
      valueB: confB.display,
      scoreA: confA.score,
      scoreB: confB.score,
      winner: confWinner,
      advantage: confWinner === "tie" ? "Confort similar" : "Mayor confort de cabina",
    },
    {
      key: "offroad",
      label: "Off-road / Capacidad",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: offA.display,
      valueB: offB.display,
      scoreA: offA.score,
      scoreB: offB.score,
      winner: offWinner,
      advantage: offWinner === "tie" ? "Capacidad similar" : "Más aptitud todo terreno",
    },
    {
      key: "autonomia",
      label: "Autonomía / Rango",
      hint: "Mayor es mejor",
      lowerIsBetter: false,
      valueA: autA ? `${autA} km` : "—",
      valueB: autB ? `${autB} km` : "—",
      scoreA: autScoreA,
      scoreB: autScoreB,
      winner: autWinner,
      advantage:
        autA && autB
          ? formatAdvantageHigher(autWinner, autA, autB, "km")
          : autWinner === "tie"
            ? "Sin datos suficientes"
            : "Mayor autonomía declarada",
    },
  ];

  const winsA = categories.filter((c) => c.winner === "a").length;
  const winsB = categories.filter((c) => c.winner === "b").length;
  const ties = categories.filter((c) => c.winner === "tie").length;
  const overallWinner: CategoryWinner =
    winsA === winsB ? "tie" : winsA > winsB ? "a" : "b";

  const winnerLabel =
    overallWinner === "a"
      ? optionA.label
      : overallWinner === "b"
        ? optionB.label
        : null;

  const summary =
    overallWinner === "tie"
      ? "Comparativa equilibrada: ambos modelos se reparten las ventajas por categoría."
      : `${winnerLabel} lidera en ${Math.max(winsA, winsB)} de ${categories.length} categorías. Revisá la tabla para ver en qué gana cada uno.`;

  return {
    categories,
    winsA,
    winsB,
    ties,
    overallWinner,
    summary,
  };
}

export { formatPrecioRef };
