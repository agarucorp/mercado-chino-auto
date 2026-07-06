import { LISTINGS_DATA } from "@/data/listings";
import { getFichaTecnica } from "@/data/modelo-media";
import { getAllReviewsRaw } from "@/lib/review-store";
import { MARCAS } from "@/data/marcas";
import type { Marca, Modelo } from "@/types/marcas";

export interface ModeloOption {
  id: string;
  label: string;
  marca: Marca;
  modelo: Modelo;
}

export interface CompareScores {
  potencia: number;
  precio: number;
  eficiencia: number;
  seguridad: number;
  valoracion: number;
}

export interface CompareVerdict {
  key: keyof CompareScores;
  label: string;
  winner: "a" | "b" | "tie";
}

export interface CompareResult {
  rows: { label: string; valueA: string; valueB: string }[];
  scoresA: CompareScores;
  scoresB: CompareScores;
  verdicts: CompareVerdict[];
  overallWinner: "a" | "b" | "tie";
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

function fichaValue(modeloId: string, label: string): string {
  return getFichaTecnica(modeloId).find((r) => r.label === label)?.value ?? "—";
}

function parsePotencia(modeloId: string): number {
  const raw = fichaValue(modeloId, "Potencia");
  const match = raw.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function parseAutonomia(modeloId: string): number {
  const ficha = getFichaTecnica(modeloId);
  const row = ficha.find(
    (r) => r.label.includes("Autonomía") || r.label.includes("autonomía"),
  );
  if (!row) return 0;
  const match = row.value.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function getPrecioReferencia(marcaId: string, modeloId: string): number {
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

function getReviewStats(marcaId: string, modeloId: string) {
  const reviews = getAllReviewsRaw().filter(
    (r) => r.marcaId === marcaId && r.modeloId === modeloId,
  );
  if (reviews.length === 0) return { count: 0, avg: 0 };
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { count: reviews.length, avg };
}

function scoreEficiencia(modeloId: string): number {
  const combustible = fichaValue(modeloId, "Combustible").toLowerCase();
  const autonomia = parseAutonomia(modeloId);
  let score = 40;
  if (combustible.includes("eléctrico") || combustible.includes("electrico")) score += 45;
  else if (combustible.includes("híbrido") || combustible.includes("hibrido")) score += 30;
  else if (combustible.includes("diesel")) score += 10;
  score += Math.min(autonomia / 10, 15);
  return Math.min(score, 100);
}

function scoreSeguridad(modeloId: string, marcaId: string): number {
  const segmento = fichaValue(modeloId, "Segmento").toLowerCase();
  const { avg, count } = getReviewStats(marcaId, modeloId);
  let score = 50;
  if (segmento.includes("suv d") || segmento.includes("7 plazas")) score += 20;
  else if (segmento.includes("suv")) score += 12;
  else if (segmento.includes("pick")) score += 8;
  score += avg * 6;
  score += Math.min(count * 3, 12);
  return Math.min(Math.round(score), 100);
}

export function computeScores(marcaId: string, modeloId: string): CompareScores {
  const potencia = parsePotencia(modeloId);
  const precio = getPrecioReferencia(marcaId, modeloId);
  const { count, avg } = getReviewStats(marcaId, modeloId);

  return {
    potencia,
    precio,
    eficiencia: scoreEficiencia(modeloId),
    seguridad: scoreSeguridad(modeloId, marcaId),
    valoracion: count > 0 ? avg * 20 + count * 5 : 0,
  };
}

function winnerFor(
  key: keyof CompareScores,
  a: number,
  b: number,
  lowerIsBetter = false,
): "a" | "b" | "tie" {
  if (a === b) return "tie";
  if (lowerIsBetter) return a < b ? "a" : "b";
  return a > b ? "a" : "b";
}

export function compareModelos(optionA: ModeloOption, optionB: ModeloOption): CompareResult {
  const fichaA = getFichaTecnica(optionA.modelo.id);
  const fichaB = getFichaTecnica(optionB.modelo.id);
  const labels = [...new Set([...fichaA, ...fichaB].map((r) => r.label))];

  const rows = labels.map((label) => ({
    label,
    valueA: fichaValue(optionA.modelo.id, label),
    valueB: fichaValue(optionB.modelo.id, label),
  }));

  const scoresA = computeScores(optionA.marca.id, optionA.modelo.id);
  const scoresB = computeScores(optionB.marca.id, optionB.modelo.id);

  const verdicts: CompareVerdict[] = [
    {
      key: "potencia",
      label: "Potencia",
      winner: winnerFor("potencia", scoresA.potencia, scoresB.potencia),
    },
    {
      key: "precio",
      label: "Precio",
      winner: winnerFor("precio", scoresA.precio, scoresB.precio, true),
    },
    {
      key: "eficiencia",
      label: "Eficiencia",
      winner: winnerFor("eficiencia", scoresA.eficiencia, scoresB.eficiencia),
    },
    {
      key: "seguridad",
      label: "Seguridad",
      winner: winnerFor("seguridad", scoresA.seguridad, scoresB.seguridad),
    },
    {
      key: "valoracion",
      label: "Valoración usuarios",
      winner: winnerFor("valoracion", scoresA.valoracion, scoresB.valoracion),
    },
  ];

  const winsA = verdicts.filter((v) => v.winner === "a").length;
  const winsB = verdicts.filter((v) => v.winner === "b").length;
  const overallWinner = winsA === winsB ? "tie" : winsA > winsB ? "a" : "b";

  return { rows, scoresA, scoresB, verdicts, overallWinner };
}

export function formatPrecioRef(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}
