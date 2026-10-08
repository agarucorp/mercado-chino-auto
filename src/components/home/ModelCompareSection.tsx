import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  compareModelos,
  getAllModeloOptions,
  type CompareCategory,
  type CompareResult,
  type ModeloOption,
} from "@/lib/comparador";
import { cn } from "@/lib/utils";
import { getModeloPath } from "@/lib/marcas";
import { getFichaTecnica } from "@/data/modelo-media";
import { fichaVariantNames } from "@/lib/ficha-variantes";
import {
  ArrowLeftRight,
  Battery,
  CircleEqual,
  Gauge,
  Leaf,
  Mountain,
  Shield,
  Sofa,
  Trophy,
  Cpu,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CATEGORY_ICONS: Record<string, typeof Trophy> = {
  precio: Wallet,
  potencia: Gauge,
  consumo: Leaf,
  seguridad: Shield,
  tecnologia: Cpu,
  confort: Sofa,
  offroad: Mountain,
  autonomia: Battery,
};

function ScoreBar({ score, win }: { score: number; win: boolean }) {
  const filled = Math.max(0, Math.min(10, Math.round(score)));
  return (
    <div className="flex items-center gap-1.5 mt-1.5">
      <div className="flex gap-0.5" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-1.5 sm:w-2 rounded-[1px]",
              i < filled
                ? win
                  ? "bg-emerald-600"
                  : "bg-red-500/80"
                : "bg-muted-foreground/15",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "type-meta tabular-nums shrink-0",
          win ? "text-emerald-700" : "text-red-600/90",
        )}
      >
        {score.toFixed(1)}/10
      </span>
    </div>
  );
}

function CategoryCell({
  value,
  score,
  isWinner,
  isTie,
}: {
  value: string;
  score: number;
  isWinner: boolean;
  isTie: boolean;
}) {
  const winBar = isTie || isWinner;
  return (
    <div className="min-w-0">
      <p className="type-body-sm font-medium text-foreground leading-snug">{value}</p>
      <ScoreBar score={score} win={winBar} />
    </div>
  );
}

function MidResult({
  category,
  labelA,
  labelB,
}: {
  category: CompareCategory;
  labelA: string;
  labelB: string;
}) {
  if (category.winner === "tie") {
    return (
      <div className="flex flex-col items-center justify-center gap-1 text-center px-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-muted/50">
          <CircleEqual className="h-4 w-4 text-muted-foreground" />
        </span>
        <span className="type-meta text-muted-foreground uppercase tracking-wide">Empate</span>
      </div>
    );
  }
  const name = category.winner === "a" ? labelA : labelB;
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center px-1 max-w-[7rem] mx-auto">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Trophy className="h-3.5 w-3.5" />
      </span>
      <span className="type-meta text-foreground leading-tight line-clamp-2">{name}</span>
    </div>
  );
}

function VerdictDashboard({
  result,
  optionA,
  optionB,
}: {
  result: CompareResult;
  optionA: ModeloOption;
  optionB: ModeloOption;
}) {
  const winnerLabel =
    result.overallWinner === "a"
      ? optionA.label
      : result.overallWinner === "b"
        ? optionB.label
        : null;

  return (
    <div className="mt-10 space-y-8 animate-in fade-in duration-300">
      {/* Summary header */}
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-stretch rounded-2xl border border-border bg-background p-5 md:p-6">
        <div className="flex gap-4 items-start">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
              result.overallWinner === "tie"
                ? "bg-muted text-muted-foreground"
                : "bg-emerald-600 text-white",
            )}
          >
            <Trophy className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="type-meta text-muted-foreground uppercase tracking-wide">Veredicto</p>
            <h3 className="type-h2 text-foreground mt-1">
              {result.overallWinner === "tie"
                ? "Comparativa equilibrada"
                : `${winnerLabel} es el ganador`}
            </h3>
            <p className="type-body text-muted-foreground mt-2 max-w-xl">{result.summary}</p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col justify-center gap-3 md:min-w-[10rem] rounded-xl border border-border bg-muted/30 px-4 py-4">
          <div className="flex items-center justify-between gap-4 md:gap-2 flex-1 md:flex-initial">
            <span className="type-meta text-muted-foreground">Gana</span>
            <span className="type-h3 text-emerald-700 tabular-nums">
              {Math.max(result.winsA, result.winsB)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 md:gap-2 flex-1 md:flex-initial">
            <span className="type-meta text-muted-foreground">Empate</span>
            <span className="type-h3 text-muted-foreground tabular-nums">{result.ties}</span>
          </div>
          <div className="flex items-center justify-between gap-4 md:gap-2 flex-1 md:flex-initial">
            <span className="type-meta text-muted-foreground">Pierde</span>
            <span className="type-h3 text-red-600/90 tabular-nums">
              {Math.min(result.winsA, result.winsB)}
            </span>
          </div>
          {result.overallWinner !== "tie" && (
            <p className="type-meta text-muted-foreground hidden md:block text-center pt-1 border-t border-border">
              desde la óptica del ganador
            </p>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-border">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-accent text-accent-foreground">
              <th className="text-left p-4 type-meta font-medium w-[18%]">Categoría</th>
              <th className="text-left p-4 type-meta font-medium w-[24%]">{optionA.label}</th>
              <th className="text-center p-3 type-meta font-medium w-[12%]">VS</th>
              <th className="text-left p-4 type-meta font-medium w-[24%]">{optionB.label}</th>
              <th className="text-left p-4 type-meta font-medium w-[22%]">Ventaja</th>
            </tr>
          </thead>
          <tbody>
            {result.categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key] ?? Gauge;
              return (
                <tr key={cat.key} className="border-t border-border bg-background">
                  <td className="p-4 align-top">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-foreground" />
                      </span>
                      <div>
                        <p className="type-body-sm font-medium text-foreground">{cat.label}</p>
                        <p className="type-meta text-muted-foreground mt-0.5">({cat.hint})</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <CategoryCell
                      value={cat.valueA}
                      score={cat.scoreA}
                      isWinner={cat.winner === "a"}
                      isTie={cat.winner === "tie"}
                    />
                  </td>
                  <td className="p-3 align-middle">
                    <MidResult
                      category={cat}
                      labelA={optionA.modelo.nombre}
                      labelB={optionB.modelo.nombre}
                    />
                  </td>
                  <td className="p-4 align-top">
                    <CategoryCell
                      value={cat.valueB}
                      score={cat.scoreB}
                      isWinner={cat.winner === "b"}
                      isTie={cat.winner === "tie"}
                    />
                  </td>
                  <td className="p-4 align-middle">
                    <span
                      className={cn(
                        "inline-flex max-w-full rounded-full border px-3 py-1.5 type-meta leading-snug",
                        cat.winner === "tie"
                          ? "border-border text-muted-foreground bg-muted/40"
                          : "border-emerald-600/30 text-emerald-800 bg-emerald-50",
                      )}
                    >
                      {cat.advantage}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile / tablet stacked cards */}
      <div className="lg:hidden space-y-4">
        {result.categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.key] ?? Gauge;
          return (
            <article
              key={cat.key}
              className="rounded-xl border border-border bg-background p-4 space-y-4"
            >
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="type-body-sm font-medium text-foreground">{cat.label}</p>
                  <p className="type-meta text-muted-foreground">({cat.hint})</p>
                </div>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                <CategoryCell
                  value={cat.valueA}
                  score={cat.scoreA}
                  isWinner={cat.winner === "a"}
                  isTie={cat.winner === "tie"}
                />
                <MidResult
                  category={cat}
                  labelA={optionA.modelo.nombre}
                  labelB={optionB.modelo.nombre}
                />
                <CategoryCell
                  value={cat.valueB}
                  score={cat.scoreB}
                  isWinner={cat.winner === "b"}
                  isTie={cat.winner === "tie"}
                />
              </div>
              <p className="type-meta text-center text-muted-foreground">{cat.advantage}</p>
            </article>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to={getModeloPath(optionA.marca, optionA.modelo)}>
            Ver ficha {optionA.modelo.nombre}
          </Link>
        </Button>
        <Button asChild>
          <Link to={getModeloPath(optionB.marca, optionB.modelo)}>
            Ver ficha {optionB.modelo.nombre}
          </Link>
        </Button>
      </div>

      <p className="type-meta text-muted-foreground text-center max-w-2xl mx-auto">
        Las puntuaciones se estiman a partir de la ficha técnica del catálogo (precio ref., potencia,
        consumo, seguridad, autonomía y señales de segmento). No sustituyen una prueba en
        concesionario.
      </p>
    </div>
  );
}

export function ModelCompareSection() {
  const options = useMemo(() => getAllModeloOptions(), []);
  const [idA, setIdA] = useState(options[0]?.id ?? "");
  const [idB, setIdB] = useState(options[1]?.id ?? "");
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");
  const [result, setResult] = useState<CompareResult | null>(null);

  const optionA = options.find((o) => o.id === idA);
  const optionB = options.find((o) => o.id === idB);
  const variantesA = optionA ? fichaVariantNames(getFichaTecnica(optionA.modelo.id)) : [];
  const variantesB = optionB ? fichaVariantNames(getFichaTecnica(optionB.modelo.id)) : [];
  const motorA = variantesA.includes(variantA) ? variantA : (variantesA[0] ?? "");
  const motorB = variantesB.includes(variantB) ? variantB : (variantesB[0] ?? "");

  const handleCompare = () => {
    if (!optionA || !optionB || optionA.id === optionB.id) return;
    setResult(compareModelos(optionA, optionB, motorA || undefined, motorB || undefined));
  };

  const canCompare = optionA && optionB && optionA.id !== optionB.id;

  return (
    <section
      id="comparar"
      className="py-10 md:py-14 border-t-2 border-border bg-muted/30 scroll-mt-16 md:scroll-mt-20"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent mb-4">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <h2 className="type-h2 text-foreground">Compará modelos</h2>
          <p className="type-body text-muted-foreground mt-2 max-w-lg mx-auto">
            Elegí dos vehículos y obtené un veredicto por categoría con puntaje y ventajas claras.
          </p>
        </div>

        <div className="p-5 md:p-6">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-end">
            <div className="space-y-2">
              <label className="type-meta text-muted-foreground">Modelo 1</label>
              <Select
                value={idA}
                onValueChange={(v) => {
                  setIdA(v);
                  setResult(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={6} collisionPadding={16} className="max-h-72">
                  {options.map((o) => (
                    <SelectItem key={o.id} value={o.id} disabled={o.id === idB}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {variantesA.length > 1 && (
                <Select
                  value={motorA}
                  onValueChange={(v) => {
                    setVariantA(v);
                    if (optionA && optionB && optionA.id !== optionB.id && result) {
                      setResult(compareModelos(optionA, optionB, v, motorB || undefined));
                    }
                  }}
                >
                  <SelectTrigger aria-label="Motorización del modelo 1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variantesA.map((nombre) => (
                      <SelectItem key={nombre} value={nombre}>
                        {nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="hidden md:flex items-center justify-center pb-2 text-muted-foreground">
              <ArrowLeftRight className="w-5 h-5" />
            </div>

            <div className="space-y-2">
              <label className="type-meta text-muted-foreground">Modelo 2</label>
              <Select
                value={idB}
                onValueChange={(v) => {
                  setIdB(v);
                  setResult(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modelo" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={6} collisionPadding={16} className="max-h-72">
                  {options.map((o) => (
                    <SelectItem key={o.id} value={o.id} disabled={o.id === idA}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {variantesB.length > 1 && (
                <Select
                  value={motorB}
                  onValueChange={(v) => {
                    setVariantB(v);
                    if (optionA && optionB && optionA.id !== optionB.id && result) {
                      setResult(compareModelos(optionA, optionB, motorA || undefined, v));
                    }
                  }}
                >
                  <SelectTrigger aria-label="Motorización del modelo 2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variantesB.map((nombre) => (
                      <SelectItem key={nombre} value={nombre}>
                        {nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <Button
              onClick={handleCompare}
              disabled={!canCompare}
              className="w-full sm:w-auto min-w-[140px]"
            >
              Comparar
            </Button>
            {optionA && optionB && optionA.id === optionB.id && (
              <p className="type-meta text-destructive text-center">
                Seleccioná dos modelos distintos
              </p>
            )}
          </div>

          {result && optionA && optionB && (
            <VerdictDashboard result={result} optionA={optionA} optionB={optionB} />
          )}
        </div>
      </div>
    </section>
  );
}
